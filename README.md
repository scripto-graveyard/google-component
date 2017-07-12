# google-component

[![Greenkeeper badge](https://badges.greenkeeper.io/scriptoLLC/google-component.svg)](https://greenkeeper.io/)
Interactions for Google's web-based OAuth flow.

## Usage
```js
const html = require('bel')
const GOOGLE_CLIENT_ID = 'your client id!'
const google = require('@scriptollc/google-platform')(GOOGLE_CLIENT_ID)

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
    google.renderLogout((err) => {
      if (err) return console.log(err)
      state.user = {}
      emit('render')
    })
    evt.preventDefault()
  }
}
```

## API
### `var google = GooglePlatform(clientID:string):GooglePlatform`
Create a new instance of the Google web platform component. Will attach the correct
`<meta>` tag to the `<head>` of the page when invoked. You must provide a valid
Google client ID.

#### `#render(postLoad:function):HTMLDivElement`
Render the placeholder `<div>` element for Google to render into. When the div
has been rendered, it will request the platform script to be loaded into the page
and then call the provided `postLoad` function.

#### `#loadPlatform(cb:function(err:Error)):undefined`
Load the Google platform script in the page unless it's been loaded already. Mostly
useless by itself. This is called automatically by `#render`

#### `#renderLogin(cb:function(err:Error, user:GoogleUser):undefined`
Make the `<div>` returned by `#div()` into a Google login button.  The callback
will be invoked when the user has either rejected or accepted the OAuth request
from Google.

#### `#renderLogout(cb:function(err:Error):undefined`
Attempt to log the user out of their local account. This actually requires
rendering the `<div>` into the page.  This will not revoke the permissions scope
they provided, but just allow the user to not be logged in Google.

## License
Copyright © 2017 Scripto, LLC. Apache-2.0
