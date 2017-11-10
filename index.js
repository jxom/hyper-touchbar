const { TouchBar } = require('electron');
const shellHistory = require('shell-history');

const MAX_COMMAND_HISTORY_CONTROLS = 5;
const INITIAL_TOUCH_BAR_CONTROLS = {
  default: [
    { type: 'button', payload: { label: 'clear', bgColor: '#c0392b', command: 'clear' } }
  ]
};

const getCommandHistoryControls = length => {
  let history = shellHistory();
  history = history.slice(history.length - length, history.length);
  history = history.reverse();
  return history.map(item => ({ type: 'button', payload: { label: `${item}`, bgColor: '#7f8c8d', command: `${item}` } }));
};

const getTouchBarControls = view => {
  let controls = INITIAL_TOUCH_BAR_CONTROLS[view];
  if (view === 'default') {
    controls = [...controls, ...getCommandHistoryControls(MAX_COMMAND_HISTORY_CONTROLS)];
  }
  return controls;
};

let currentUid;

const waitFor = (object, key, fn) => {
  if (key in object) {
    fn(object[key]);
  } else {
    setTimeout(() => waitFor(object, key, fn), 10);
  }
};

exports.onWindow = win => {
  const { TouchBarButton } = TouchBar;

  const commandButton = ({ label, bgColor: backgroundColor, command }) =>
    new TouchBarButton({
      label,
      backgroundColor,
      click: () => {
        win.sessions.get(currentUid).write(`\r${command}\r`);
      }
    });

  const generateControls = (view = 'default') =>
    getTouchBarControls(view)
      .map(control => {
        if (control.type === 'button') {
          return commandButton(control.payload);
        }
        return null;
      })
      .filter(control => control);

  win.setTouchBar(new TouchBar(generateControls()));

  win.rpc.on('uid set', uid => {
    currentUid = uid;
  });
  win.rpc.on('enter pressed', () => {
    setTimeout(() => {
      win.setTouchBar(new TouchBar(generateControls()));
    }, 200);
  });
};

exports.middleware = () => next => action => {
  switch (action.type) {
    case 'SESSION_SET_ACTIVE': {
      window.rpc.emit('uid set', action.uid);
      break;
    }
    case 'SESSION_ADD': {
      window.rpc.emit('uid set', action.uid);
      break;
    }
    case 'ENTER_PRESSED': {
      window.rpc.emit('enter pressed');
      break;
    }
    default: {
      break;
    }
  }
  return next(action);
};

exports.decorateTerm = function (Term, { React }) {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.onTerminal = this.onTerminal.bind(this);
    }

    onTerminal(term) {
      if (this.props.onTerminal) {
        this.props.onTerminal(term);
      }

      term.uninstallKeyboard();
      const someHandler = ['keydown', e => {
        if (e.keyCode === 13) {
          store.dispatch({
            type: 'ENTER_PRESSED'
          });
        }
      }];
      term.keyboard.handlers_ = [someHandler].concat(term.keyboard.handlers_);
      term.installKeyboard();
    }

    render() {
      const props = Object.assign({}, this.props, {
        onTerminal: this.onTerminal
      });
      return React.createElement(Term, props);
    }
  };
};
