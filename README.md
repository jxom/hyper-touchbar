# hyper-touchbar

NOTE: This is unstable, and will not work in the latest version of Hyper!

> A Mac Touch Bar plugin that equips your touch bar with useful commands.

## Why is this unstable?

Because Hyper currently has Electron at version `1.6.2` as a dependency. Electron has Touch Bar support
in versions `>= 1.6.3`.

## How do I get it to work then?

- [Follow these steps first!](https://github.com/zeit/hyper#contribute)
- `npm install electron@beta --save-dev`
- `npm run app`
- Add `hyper-touchbar` to `plugins` in `~/.hyper.js`
