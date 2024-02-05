/**
 * Creates and initializes a CodeMirror editor using the basic setup. using the config from CodeMirror Docs.
 *
 * @class
 * @constructor
 * @param {Object} options - Configuration options for the EditorView.
 * @param {EditorState} options.state - The initial state of the editor.
 * @param {HTMLElement} options.parent - The DOM element to which the editor should be appended.
 */
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
//import { javascript } from "@codemirror/lang-javascript";

let editor = new EditorView({
  state: EditorState.create({
    extensions: [basicSetup]
  }),
  parent: document.querySelector('#editor')
});