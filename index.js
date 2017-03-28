const { TouchBar } = require('electron');

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
      win.sessions.get(currentUid).write(`${command}\r`);
    }
  });

  const touchBar = new TouchBar([
    commandButton({ label: 'clear', bgColor: '#c0392b', command: 'clear' }),
    commandButton({ label: 'ls -la', bgColor: '#2980b9', command: 'ls -la' })
  ]);

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
    default: {
      break;
    }
  }
  return next(action);
};

exports.onRendererWindow = win => {
  waitFor(win, 'rpc', rpc => {
    rpc.on('session add', ({ uid }) => {
      win.rpc.emit('uid set', uid);
    });
  });
};
