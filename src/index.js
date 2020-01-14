import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import browserTools from 'testcafe-browser-tools';

function getScreenSize() {
  return { width: screen.availWidth, height: screen.availHeight };
}

export default {
  browser: null,
  pages: {},
  screenSizes: {},

  // Multiple browsers support
  isMultiBrowser: false,

  /**
   * Required. Method to open the browser.
   * This provider, by default, opens the browser visible (not headless) and maximized
   *
   * If you want this provider to open the browser headless with a default window-size of
   * 1920x1080, pass the argument: `ci=true`
   *
   * @param {string} id
   * @param {string} pageUrl
   * @param {object} config
   */
  async openBrowser(id, pageUrl, config) {
    //  Default launch options, values can be overwritten or add by submitting a .chromium.js file
    //  disable-infobars does not work on chrome 77 and later, therefore the option '--enable-automation' is ignored
    //  and '--no-default-browser-check' is added to the args.
    const defaultLaunchOptions = {
      args: ['--disable-infobars', '--no-default-browser-check'],
      defaultViewport: null,
      headless: false,
      ignoreDefaultArgs: ['--enable-automation'],
      timeout: 30000,
    };
    let launchOptions = {};

    //  Launch the browser if not yet launched
    if (!this.browser) {
      if (!config) {
        launchOptions = defaultLaunchOptions;
      } else {
        try {
          const configPath = resolve(config || '.');
          const launchOptionsFromConfig = require(configPath).config.chromium;

          launchOptions = { ...defaultLaunchOptions, ...launchOptionsFromConfig };
        } catch (err) {
          throw new Error('Error reading the launch options from the config file!' + err);
        }
      }

      this.browser = await puppeteer.launch(launchOptions);
    }

    //  Open the TestCafe proxy index page
    const pages = await this.browser.pages();
    const page = pages[0];

    await page.goto(pageUrl);

    //  Wait until the browser is ready before continuing
    this.waitForConnectionReady(id);

    //  Maximize the browser window
    this.maximizeWindow(id);

    //  Save the opened page for further actions
    this.pages[id] = page;
  },

  async closeBrowser(id) {
    await this.pages[id].close();
    delete this.pages[id];

    await this.browser.close();
  },

  // Optional initialization and cleanup methods
  async init() {
    return;
  },

  async dispose() {
    return;
  },

  // Extra methods
  async maximizeWindow(id) {
    await browserTools.maximize(id);

    this.screenSizes[id] = await this.runInitScript(id, getScreenSize.toString());
    this.screenSizes[id].height = Math.ceil(this.screenSizes[id].height * 0.927);

    await this.pages[id].setViewport(this.screenSizes[id]);
  },

  async canResizeWindowToDimensions(id, width, height) {
    var { width: screenWidth, height: screenHeight } = this.screenSizes[id];

    return width <= screenWidth && height <= screenHeight;
  },

  async resizeWindow(id, width, height) {
    await this.pages[id].setViewport({ width, height });
  },

  async takeScreenshot(id, screenshotPath, pageWidth, pageHeight, fullPage) {
    const dir = path.dirname(screenshotPath);

    fs.mkdirSync(dir, { recursive: true });

    await this.pages[id].screenshot({
      path: screenshotPath,
      fullPage: fullPage,
    });
  },
};
