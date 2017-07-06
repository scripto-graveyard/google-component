const test = require('tape')
const GooglePlatform = require('../')

test('throwing', (t) => {
  t.throws(() => {
    const google = GooglePlatform()
    document.body.appendChild(google.render())
    while (document.body.children.length > 0) {
      document.body.removeChild(document.body.firstChild)
    }
  })
  t.end()
})

test('loading', (t) => {
  t.plan(3)
  const google = GooglePlatform('foobar')
  document.body.appendChild(google.render(() => t.pass('loaded platform')))
  t.ok(document.querySelector(`meta[name="${google.metaName}"]`), 'has meta')
  t.ok(document.querySelector(`#${google.divId}`), 'has div')
  while (document.body.children.length > 0) {
    document.body.removeChild(document.body.firstChild)
  }
})

test('loading with new', (t) => {
  t.plan(3)
  const google = new GooglePlatform('foobar')
  document.body.appendChild(google.render(() => t.pass('loaded platform')))
  t.ok(document.querySelector(`meta[name="${google.metaName}"]`), 'has meta')
  t.ok(document.querySelector(`#${google.divId}`), 'has div')
  while (document.body.children.length > 0) {
    document.body.removeChild(document.body.firstChild)
  }
})
