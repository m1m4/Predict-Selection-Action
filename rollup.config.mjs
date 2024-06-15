import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "background.js",
  output: {
    file: "bundle.js",
    format: "es",
  },
  plugins: [nodeResolve(), commonjs()],
};
