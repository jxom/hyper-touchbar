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
  hyperWindow = win;

  const commandButton = ({ label, bgColor: backgroundColor, command }) => new TouchBarButton({
    label,
    backgroundColor,
    click: () => {
      win.sessions.get(currentUid).write(`${command}\r`)
    }
  });

  const touchBar = new TouchBar([
    commandButton({ label: 'clear', bgColor: '#c0392b', command: 'clear' }),
    commandButton({ label: 'ls -a', bgColor: '#2980b9', command: 'ls -a' }),
  ]);

  win.setTouchBar(touchBar);

  let currentUid;
  win.rpc.on('set uid', uid => {
    currentUid = uid;
  })
}

exports.onRendererWindow = win => {
  waitFor(win, 'rpc', rpc => {
    rpc.on('session add', ({uid}) => {
      rpc.emit('set uid', uid);
    });
    rpc.on('session set active', ({uid}) => {
      rpc.emit('set uid', uid);
    });
  });
};
