"use strict";

try {
  require("newrelic");
} catch (error) {
  const isMissingNewRelicModule =
    error &&
    error.code === "MODULE_NOT_FOUND" &&
    typeof error.message === "string" &&
    error.message.includes("newrelic");

  if (!isMissingNewRelicModule) {
    throw error;
  }
}