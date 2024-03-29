/**
 * Configuration object for Rollup bundling.
 * 
 * @type {Object}
 * @property {string} input - The entry point for the bundling process.
 * @property {Object} output - The configuration for the output bundle.
 * @property {string} output.file - The file path for the output bundle.
 * @property {string} output.format - The format of the output bundle (CommonJS in this case).
 * @property {Array<Plugin>} plugins - An array of Rollup plugins to use during bundling.
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
export default {
  input: "./editor.mjs",
  output: {
    file: "./public/javascripts/editor.bundle.js",
    format: "iife",
    name: "editor",
  },
  plugins: [nodeResolve({browser: true})],
};