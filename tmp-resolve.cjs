try {
  console.log(require.resolve('@playwright/test'));
} catch (e) {
  console.error('resolve error', e && e.message);
  process.exit(1);
}
