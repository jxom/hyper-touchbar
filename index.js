const { TouchBar } = require('electron');

const TOUCH_BAR_CONTROLS = {
  default: [
    { label: 'clear', bgColor: '#c0392b', command: 'clear' },
    { label: 'ls -la', bgColor: '#2980b9', command: 'ls -la' },
    { label: 'top', bgColor: '#2980b9', command: 'top' },
    { label: 'history', bgColor: '#2980b9', command: 'history' }
  ]
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

  const commandButton = ({ label, bgColor: backgroundColor, command }) => new TouchBarButton({
    label,
    backgroundColor,
    click: () => {
      win.sessions.get(currentUid).write(`\r${command}\r`);
    }
  });

  const generateButtons = (view = 'default') => TOUCH_BAR_CONTROLS[view].map(control => commandButton(control));

  const touchBar = new TouchBar(generateButtons());

  win.setTouchBar(touchBar);

  win.rpc.on('uid set', uid => {
    currentUid = uid;
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
    default: {
      break;
    }
  }
  return next(action);
};
