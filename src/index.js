import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';
import puppeteer from 'puppeteer';
import browserTools from 'testcafe-browser-tools';

function getScreenSize() {
  return { width: screen.availWidth, height: screen.availHeight };
}

/**
 * Combine two option objects.
 * When spreading two objects and combining them, array values are overwritten
 * by the latter, but we want to combine the args array.
 *
 * The default launch options always has an (empty) args array, but check
 * if the passed options also have one and combine the two arrays
 *
 * @param {*} defaultLaunchOptions
 * @param {*} launchOptionsFromConfig
 */
function combineLaunchOptions(defaultLaunchOptions, launchOptionsFromConfig) {
  const launchOptions = { ...defaultLaunchOptions, ...launchOptionsFromConfig };

  if (launchOptionsFromConfig.args === null || launchOptionsFromConfig.args === undefined) {
    launchOptions.args = defaultLaunchOptions.args;
  } else {
    const chromiumArgs = [...defaultLaunchOptions.args, ...launchOptionsFromConfig.args];
    launchOptions.args = chromiumArgs;
  }

  return launchOptions;
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
    const defaultLaunchOptions = {
      args: ['--disable-infobars'],
      defaultViewport: null,
      headless: false,
      ignoreDefaultArgs: [],
      timeout: 30000,
    };
    let launchOptions = {};
    let appMode = false;
    let disableInfoBars = false;

    //  Launch the browser if not yet launched
    if (!this.browser) {
      if (!config) {
        launchOptions = defaultLaunchOptions;
      } else {
        try {
          const configPath = resolve(config || '.');
          const browserConfiguration = require(configPath).config;
          const launchOptionsFromConfig = browserConfiguration.chromium;

          launchOptions = combineLaunchOptions(defaultLaunchOptions, launchOptionsFromConfig);

          //  Read the other configuration options
          if (browserConfiguration.appMode !== undefined && browserConfiguration.appMode !== null) {
            appMode = browserConfiguration.appMode;
          }
          if (
            browserConfiguration.disableInfoBars !== undefined &&
            browserConfiguration.disableInfoBars !== null
          ) {
            disableInfoBars = browserConfiguration.disableInfoBars;
          }

          //  Open url in Chromium application mode (set headless mode to false)
          if (appMode) {
            launchOptions.args.push(`--app=${pageUrl}`);
            launchOptions.headless = false;
          }

          //  disable-infobars does not work on chrome 77 and later, therefore the option '--enable-automation' is ignored
          //  and '--no-default-browser-check' is added to the args when you set the option disableInfoBars in the configuration
          //  [](https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md#--enable-automation)
          if (disableInfoBars) {
            launchOptions.args.push('--no-default-browser-check');
            launchOptions.ignoreDefaultArgs.push('--enable-automation');
          }
        } catch (err) {
          throw new Error('Error reading the launch options from the config file!' + err);
        }
      }

      this.browser = await puppeteer.launch(launchOptions);
    }

    //  Open the TestCafe proxy index page
    const pages = await this.browser.pages();
    const page = pages[0];

    //  If the browser is started in application mode, the pageUrl is already opened
    //  so this step can then be skipped
    if (!appMode) {
      await page.goto(pageUrl);
    }

    //  Wait until the browser is ready before continuing
    await this.waitForConnectionReady(id);

    //  Maximize the browser window if headless browser is false
    if (!launchOptions.headless) {
      await this.maximizeWindow(id);
    }

    this.screenSizes[id] = await this.runInitScript(id, getScreenSize.toString());

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

  async maximizeWindow(id) {
    await browserTools.maximize(id);
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
