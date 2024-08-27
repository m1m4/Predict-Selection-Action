import { nodeResolve } from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/background.ts",
    output: {
      dir: "dist/",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions: [".js", ".ts"],
      }),
      sucrase({
        transforms: ["typescript"],
      }),
      commonjs(),
    ],
  },
];
