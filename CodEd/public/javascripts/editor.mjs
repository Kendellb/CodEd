/**
 * Creates and initializes a CodeMirror editor using the basic setup. using the config from CodeMirror Docs.
 *
 * The imports are packages installed using npm and are under the codemirror main package
 * in the imports {} are functions that each package contains. These fucntions are extentions 
 * that edit the state of the codemirror window.
 * 
 * 
 * @type {EditorState} Represents the initial state of the CodeMirror editor.
 *
 * @type {EditorView} Represents a CodeMirror editor instance.
 */
import {EditorState} from "@codemirror/state";
//import {EditorView, basicSetup } from "@codemirror/basic-setup";
import {EditorView, keymap,lineNumbers,highlightActiveLineGutter} from "@codemirror/view";
import { java } from "@codemirror/lang-java";
import {bracketMatching } from "@codemirror/language";
import {defaultKeymap} from "@codemirror/commands";
import {closeBrackets} from "@codemirror/autocomplete"

let startState = EditorState.create({
  doc: "Hello World",
  extensions: [
    keymap.of(defaultKeymap), 
    java(),
    lineNumbers(),
    highlightActiveLineGutter(),
    bracketMatching(),
    closeBrackets()
  ]
})

let editor = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
});