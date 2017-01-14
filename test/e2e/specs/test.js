module.exports = {
  'default e2e tests': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 30000)
      .click('#navbar > li:nth-child(1) > a')
      .waitForElementVisible('#welcome', 1000)
      .assert.containsText('#welcome', 'Please select the tool you wish to use from the menu bar at the top.')
      .click('#navbar > li:nth-child(2) > a')
      .waitForElementVisible('#bamboo-status-table', 1000)
      .click('#navbar > li:nth-child(3) > a')
      .waitForElementVisible('#px-forms-bundler', 1000)
      .end()
  }
}
