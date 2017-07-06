const test = require('tape')

const google = require('../')()

test('server side rendering', (t) => {
  t.ok(google.render(google.renderLogin(() => t.fail('this should noop'))), 'rendered login')
  t.ok(google.render(google.renderLogout(() => t.fail('this should noop'))), 'rendered logout')
  t.ok(google.render(google.loadPlatform(() => t.fail('this should noop'))), 'loaded platform')
  t.end()
})
