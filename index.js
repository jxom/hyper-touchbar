const { exec } = require('child_process');
const { TouchBar } = require('electron');

const waitFor = (object, key, fn) => {
  if (key in object) {
    fn(object[key]);
  } else {
    setTimeout(() => waitFor(object, key, fn), 10);
  }
}

exports.onWindow = (win) => {
  const { TouchBarButton } = TouchBar;

  const commandButton = ({ label, bgColor: backgroundColor, command }) => new TouchBarButton({
    label,
    backgroundColor,
    click: () => {
      win.sessions.get(currentUid).write(`${command}\r`)
    }
  });

  const touchBar = new TouchBar([
    commandButton({ label: 'clear', bgColor: '#c0392b', command: 'clear' }),
    commandButton({ label: 'ls -la', bgColor: '#2980b9', command: 'ls -la' }),
  ]);

  win.setTouchBar(touchBar);

  win.rpc.on('uid set', (uid) => {
    currentUid = uid;
  })
}

exports.middleware = store => next => (action) => {
  switch (action.type) {
    case 'SESSION_SET_ACTIVE': {
      window.rpc.emit('uid set', action.uid);
    }
  }
  return next(action);
};

exports.onRendererWindow = win => {
  waitFor(win, 'rpc', rpc => {
    rpc.on('session add', ({uid}) => {
      win.rpc.emit('uid set', uid);
    });
  });
};
