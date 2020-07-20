# testcafe-browser-provider-puppeteer-chromium

![](https://github.com/stefanschenk/testcafe-browser-provider-puppeteer-chromium/workflows/Node%20CI/badge.svg)

This is the **puppeteer-chromium** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

It downloads Chromium with a fixed revision to your local node_modules folder, which is used by TestCafe if you use
the browser `puppeteer-chromium` in you cli or api command.

This provider starts the browser non-headless and maximized by default. If you want to to run this browser headless you
can overwrite the default launch options by using a chromium configuration file (see further down).

# Getting started

## Installation

To use the puppeteer-chromium provider in your project, run:

```
npm install --save-dev testcafe-browser-provider-puppeteer-chromium
```

This will install the latest version of this provider, combined with the latest version of puppeteer.

If you want to install a specific version of this provider to run TestCafe tests against a specific chromium version, you can install the provider using a npm tag.

For example, in order to test against the chromium revision that is compatible with Chrome 77 with this provider, use `chrome-77` npm tag:

```
npm install --save-dev testcafe-browser-provider-puppeteer-chromium@chrome-77
```

| version | Tag       | Chrome version | Chromium revision |
| ------- | --------- | :------------: | :---------------: |
| 1.6.0   | chrome-83 |       83       |      r756035      |
| 1.1.0   | chrome-78 |       78       |      r686378      |
| 1.0.5   | chrome-77 |       77       |      r674921      |

_info: not all chrome tags are supported at this moment_

## Puppeteer

Puppeteer is installed with this provider. You don't need to install puppeteer yourself within your project.

## Chromium

When Puppeteer is installed, the post-install script of puppeteer will download and install a certain version of Chromium.
This version will be downloaded from google servers. If you would like to download the Chromium revision from a repository of your own
you can set the `PUPPETEER_DOWNLOAD_HOST` environment variable.

You can always manually download a Chromium revision from google and upload to your repository.
An example uri where to find the linux x64 binary for a chromium revision is;

```
https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/%CHROMIUM_REVISION%/chrome-linux.zip
```

`%CHROMIUM_REVISION%` is the revision _without_ the preceding `r`, eg. `756035`

## Usage

When you run tests from the command line, use the provider name when specifying browsers:

```sh
testcafe puppeteer-chromium 'path/to/test/file.js'
```

When you use API, pass the provider name to the `browsers()` method:

```js
testCafe
  .createRunner()
  .src('path/to/test/file.js')
  .browsers('puppeteer-chromium')
  .run();
```

### Launch options configuration file

You can pass a chromium configuration file to the provider to override the default browser launch options.
This configuration file can be named however you would like, but my suggestion would be `.chromium.js`.
The configuration file can be placed in the root folder or subfolder of your project.

An example chromium configuration file, within the `chromium` object you can use all
[Puppeteer launch options](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).

```js
module.exports.config = {
  appMode: false,
  chromium: {
    args: ['--disable-infobars'],
    defaultViewport: null,
    headless: true,
    timeout: 30000,
  },
  disableInfoBars: false,
};
```

The default launch options are:

```js
{
  args: ['--disable-infobars'],
  defaultViewport: null,
  headless: false,
  ignoreDefaultArgs: [],
  timeout: 30000,
}
```

The new configuration options outside the chromium object are: `appMode` and `disableInfoBars`.

If you set `appMode` to `true`, the Chromium will be started with the `--app` argument, which is Chromium without menu or address bar.
This application mode cannot be used together with headless mode, so headless is set to `false` when this option is set.

If you set `disableInfoBars` to `true`, then the infobar 'chrome is controlled by automated software' will not be shown.
Since v76, the argument `--disable-infobars` does not work anymore, but there is a workaround by disabling the default
argument `--enable-automation`. Disabled this toggle has more consequences, see the following link:
[](https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md#--enable-automation).

#### Passing the configuration file to the browser provider

Using the commandline, you pass the configuration file like this. The file path will be resolved
by the browser provider using the resolve method from the node path module.

```
testcafe puppeteer-chromium:.chromium.js 'path/to/test/file.js'
```

Or when using the API:

```js
testCafe
  .createRunner()
  .src('path/to/test/file.js')
  .browsers('puppeteer-chromium:.chromium.js')
  .run();
```

## Helpers

You can use helper functions from the provider in your test files. Use ES6 import statement to access them.

```
import { hoverElement } from 'testcafe-browser-provider-puppeteer-chromium';
```

### hoverElement

Hover the mousecursor over an element, providing a css selector string.

```
async function hoverElement (selector)
```

| Parameter | Type   | Description                                                                                                                       |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| selector  | String | A CSS Selector to search for element to hover. If there are multiple elements satisfying the selector, the first will be hovered. |

## Author

Stefan Schenk

## Update history

| Version | Description                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- |
| 1.6.0   | Puppeteer for Chromium v83                                                                        |
| 1.0.5   | Added the possibility to launch multiple browsers to enable support for concurrent test execution |
