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

_info: not all chrome tags are supported at this moment_

## Puppeteer

```
npm install puppeteer@chrome-77
```

## Install

```
npm install testcafe-browser-provider-puppeteer-chromium
```

## Usage

When you run tests from the command line, use the provider name when specifying browsers:

```
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

## Author
