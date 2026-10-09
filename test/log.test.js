const { test } = require('node:test');
const assert = require('node:assert');
const log = require('../log');

test('silence holds for calls without the log as this', t => {
  const out = t.mock.method(console, 'log', () => {});
  const info = t.mock.method(console, 'info', () => {});
  global.verbose = false;
  global.dryRun = true;

  // the drivers call log.sql.apply(null, ...)
  log.silence(true);
  log.sql.apply(null, ['SELECT 1', function () {}]);
  log.info.apply(null, ['hidden']);
  assert.strictEqual(out.mock.callCount(), 0);
  assert.strictEqual(info.mock.callCount(), 0);

  log.silence(false);
  log.info.apply(null, ['shown']);
  assert.strictEqual(info.mock.callCount(), 1);

  delete global.dryRun;
  delete global.verbose;
});
