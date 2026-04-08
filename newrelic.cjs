"use strict";

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "apurv-personal-website"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
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
