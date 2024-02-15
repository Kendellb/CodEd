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
import {EditorView, keymap,lineNumbers,highlightActiveLineGutter,highlightSpecialChars,
drawSelection,dropCursor,rectangularSelection,crosshairCursor,highlightActiveLine} from "@codemirror/view";
import { java,javaLanguage } from "@codemirror/lang-java";
import {bracketMatching, foldGutter, indentOnInput, syntaxHighlighting, 
  defaultHighlightStyle, foldKeymap,LanguageSupport} from "@codemirror/language";
import {defaultKeymap,history,historyKeymap} from "@codemirror/commands";
import {closeBrackets,closeBracketsKeymap} from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';



function javaLanguageSupport (){
  return new LanguageSupport(javaLanguage);
}

let startState = EditorState.create({
  doc: `public class Main(){\n public static void main(String args[]){\n\n}\n}`,
  extensions: [
    keymap.of(defaultKeymap,historyKeymap,
      closeBracketsKeymap,searchKeymap,foldKeymap), 
    java(),
    lineNumbers(),
    highlightActiveLineGutter(),
    bracketMatching(),
    closeBrackets(),
    syntaxHighlighting(defaultHighlightStyle,{fallback: true}),
    history(),
    foldGutter(),
    indentOnInput(),
    highlightSelectionMatches(),
    highlightSpecialChars(),
    drawSelection(),
    dropCursor(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    javaLanguageSupport(),
  ]
})

let editor = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
});