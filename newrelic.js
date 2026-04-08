"use strict";

const licenseKey = process.env.NEW_RELIC_LICENSE_KEY || "";
const isEuLicenseKey = licenseKey.startsWith("eu01");

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "apurv-personal-website"],
  license_key: licenseKey,
  host: process.env.NEW_RELIC_HOST || (isEuLicenseKey ? "collector.eu01.nr-data.net" : "collector.newrelic.com"),
  logging: {
    level: "info",
  },
  application_logging: {
    forwarding: {
      enabled: true,
    },
    local_decorating: {
      enabled: true,
    },
  },
  distributed_tracing: {
    enabled: true,
  },
};