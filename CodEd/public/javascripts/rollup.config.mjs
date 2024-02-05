import { nodeResolve } from "@rollup/plugin-node-resolve";
export default {
  input: "./editor.mjs",
  output: {
    file: "./public/javascripts/editor.bundle.js",
    format: "cjs",
  },
  plugins: [nodeResolve()],
};