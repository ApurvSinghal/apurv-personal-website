export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      if (!process.env.NEW_RELIC_LOG) {
        process.env.NEW_RELIC_LOG = 'stdout';
      }
      if (!process.env.NEW_RELIC_NO_CONFIG_FILE) {
        process.env.NEW_RELIC_NO_CONFIG_FILE = 'true';
      }
      await import('newrelic');
    }
  }
}
