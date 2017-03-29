# hyper-touchbar 🚧👷 (WIP)

NOTE: This is unstable and work in progress, and will not work in the latest version of Hyper!

> A Mac Touch Bar plugin that equips your touch bar with useful commands.

## Why is this unstable?

Because Hyper currently has Electron at version `1.6.2` as a dependency. Electron has Touch Bar support
in versions `>= 1.6.3`.

## How do I get it to work then?

1. Install the dependencies
  * If you are running Linux, install `icnsutils`, `graphicsmagick`, `xz-utils` and `rpm`
  * If you are running Windows, install `windows-build-tools` with `yarn global add windows-build-tools`.
2. [Fork](https://help.github.com/articles/fork-a-repo/) the [Hyper](https://github.com/zeit/hyper) repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
3. Install the dependencies: `yarn`
4. Install the latest Electron: `yarn add electron@beta --dev`
5. Build the code and watch for changes: `yarn run dev`
6. In another terminal tab/window/pane, run the app: `yarn run app`
7. Add `hyper-touchbar` to `plugins` in `~/.hyper.js`
