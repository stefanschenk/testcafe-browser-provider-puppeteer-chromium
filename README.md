# testcafe-browser-provider-puppeteer-chromium

![](https://github.com/stefanschenk/testcafe-browser-provider-puppeteer-chromium/workflows/Node%20CI/badge.svg)

This is the **puppeteer-chromium** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

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
| 1.1.0   | chrome-78 |       78       |      r686378      |
| 1.0.2   | chrome-77 |       77       |      r674921      |

_info: not all chrome tags are supported at this moment_

## Puppeteer

Puppeteer is installed with this provider. You don't need to install puppeteer yourself within your project.

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

An example chromium configuration file, within the chromium object you can use all
[Puppeteer launch options](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).

```js
module.exports.config = {
  chromium: {
    args: ['--disable-infobars'],
    defaultViewport: null,
    headless: true,
    timeout: 30000,
  },
};
```

The default launch options are:

```js
{
  args: ['--disable-infobars', '--no-default-browser-check'],
  defaultViewport: null,
  headless: false,
  ignoreDefaultArgs: ['--enable-automation'],
  timeout: 30000,
}
```

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

## Author

Stefan Schenk
