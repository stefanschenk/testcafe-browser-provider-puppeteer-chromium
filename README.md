# testcafe-browser-provider-puppeteer-chromium
![](https://github.com/stefanschenk/testcafe-browser-provider-puppeteer-chromium/workflows/Node%20CI/badge.svg)

This is the **puppeteer-chromium** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

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
 
