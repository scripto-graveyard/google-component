const fs = require('fs')
const path = require('path')

const browserify = require('browserify')
const tapeIstanbul = require('tape-istanbul')
const tapeRun = require('tape-run')
const istanbul = require('istanbul')
const opener = require('opener')

function mainTests (cb) {
  fs.readdir('./test', (err, files) => {
    if (err) throw err
    const bfy = browserify()
    const ti = tapeIstanbul('./coverage-main.json')

    ti.on('end', cb)

    files
      .filter((f) => /(.*)\.spec.js$/.test(f))
      .forEach((spec) => bfy.add(path.join('./test', spec)))

    bfy
      .plugin('tape-istanbul/plugin', {stripBasePath: true})
      .bundle()
      .pipe(tapeRun())
      .pipe(ti)
  })
}

function createCoverage () {
  const collector = new istanbul.Collector()
  const reporter = new istanbul.Reporter()
  collector.add(require('./coverage-main.json'))
  reporter.add('lcov')
  reporter.write(collector, false, () => {
    if (process.env.CI !== 'true') {
      opener('./coverage/lcov-report/index.html')
    }
  })
}

mainTests(createCoverage)
