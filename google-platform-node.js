var html = require('bel')

module.exports = function () {
  return {
    render: function () { return html`<div></div>` },
    loadPlatform: function () {},
    renderLogin: function () {},
    renderLogout: function () {}
  }
}
