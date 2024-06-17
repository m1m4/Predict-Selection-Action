import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "dist/compiled/background.js",
    output: {
      file: "dist/background.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), typescript()],
  },
  {
    input: "dist/compiled/content-script.js",
    output: {
      file: "dist/content-script.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [commonjs(), typescript()],
  },
];
