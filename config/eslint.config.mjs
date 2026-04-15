import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextPlugin = require("eslint-config-next");

const eslintConfig = [
  {
    ignores: [".next/*", "node_modules/*"],
  },
  ...nextPlugin,
];

export default eslintConfig;
