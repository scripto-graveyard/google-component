var assert = require('assert')
var window = require('global/window')
var document = require('global/document')
var loadScript = require('load-script')
var html = require('bel')
var CacheComponent = require('cache-component')
var onload = require('on-load')

function noop () {}

function GooglePlatform (clientID) {
  if (!(this instanceof GooglePlatform)) return new GooglePlatform(clientID)
  CacheComponent.call(this)
  this.divId = 'g-signin2'
  this.metaName = 'google-signin-client_id'
  this.metaContent = clientID || ''
  this.scriptId = 'google-platform'

  this.attachMetaTag()
}

GooglePlatform.prototype = Object.create(CacheComponent.prototype)

GooglePlatform.prototype._render = function (loaded, classes, style) {
  if (typeof loaded !== 'function') {
    loaded = noop
  }
  var self = this
  classes = Array.isArray(classes) ? classes : []
  style = style || ''
  var div = html`<div id="${this.divId}" class="${classes.join(' ')}" style="${style}"></div>`

  onload(div, function () {
    self.loadPlatform(loaded)
  })

  return div
}

GooglePlatform.prototype._update = function () {
  return false
}

GooglePlatform.prototype.attachMetaTag = function attachMetaTag () {
  assert.ok(this.metaContent && this.metaContent.length > 0, 'You must supply a GOOGLE_CLIENT_ID')
  var metaTags = document.getElementsByTagName('meta')

  var hasMeta = [].slice.call(metaTags).some(function (t) {
    return t.name === this.metaName
  })

  if (!hasMeta) {
    var meta = html`<meta name="${this.metaName}" content="${this.metaContent}">`
    document.head.appendChild(meta)
  }
}

GooglePlatform.prototype.loadPlatform = function loadPlatform (cb) {
  var self = this
  if (!document.getElementById(this.scriptId)) {
    return loadScript('https://apis.google.com/js/platform.js', {async: true}, function (err, script) {
      if (err) {
        return cb(err)
      }
      script.id = self.scriptId
      cb()
    })
  }
  setTimeout(cb, 0)
}

GooglePlatform.prototype.renderLogin = function renderLogin (cb) {
  this.loadPlatform(function (err) {
    if (err) {
      return cb(err)
    }
    window.gapi.signin2.render('g-signin2', {
      scope: 'email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: function onSuccess (user) {
        cb(null, user)
      },
      onfailure: cb
    })
  })
}

GooglePlatform.prototype.renderLogout = function renderLogout (cb) {
  this.loadPlatform(function (err) {
    if (err) {
      return cb(err)
    }

    window.gapi.signin2.render('g-signin2', {
      scope: 'email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: function onsuccess () {
        window.gapi.load('auth2', function gapiLoaded () {
          var gAuth = window.gapi.auth2.getAuthInstance()
          gAuth
            .signOut()
            .then(cb)
            .catch(cb)
        })
      },
      onfailure: cb
    })
  })
}

module.exports = GooglePlatform
