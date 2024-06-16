import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/background.js",
  output: {
    file: "bundle.js",
    format: "es",
  },
  plugins: [nodeResolve(), commonjs()],
};
