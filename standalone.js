var choo = require('choo')
var html = require('bel')
var GooglePlatform = require('./')
var google = GooglePlatform()
var app = choo()
app.route('/', main)
document.querySelector('body').appendChild(app.start())

function main (state, emit) {
  return html`<div>
    <p><button onclick=${logout}>log out</button></p>
    <p>
      <b>User logged in?</b><br>
      <pre><code>${JSON.stringify(state.user, null, 2)}</pre></code>
    </p>
    ${google.render(google.renderLogin(onLogin))}
  </div>`

  function onLogin (err, user) {
    if (err) return console.log(err)
    state.user = user
    emit('render')
  }

  function logout (evt) {
    google.renderLogout(function (err) {
      if (err) return console.log(err)
      state.user = {}
      emit('render')
    })
    evt.preventDefault()
  }
}
