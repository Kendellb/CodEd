/**
 * Creates and initializes a CodeMirror editor using the basic setup. using the config from CodeMirror Docs.
 * This is created in the editor.bundle.js file.
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


/**
 * Creates language support for Java.
 * @function javaLanguageSupport
 * @returns {LanguageSupport} Language support for Java.
 */
function javaLanguageSupport (){
  return new LanguageSupport(javaLanguage);
}

/**
 * Represents a keymap for keyboard shortcuts.
 * @type {Keymap}
 * 
 * Represents language support for Java.
 * @type {LanguageSupport}
 * 
 * Represents line numbers displayed in the editor.
 * @type {LineNumbers}
 * 
 * Represents highlighting of the active line gutter.
 * @type {HighlightActiveLineGutter}
 * 
 * Represents bracket matching functionality.
 * @type {BracketMatching}
 * 
 * Represents automatic insertion of closing brackets.
 * @type {CloseBrackets}
 * 
 * Represents syntax highlighting for Java code.
 * @type {SyntaxHighlighting}
 * 
 * Represents a history mechanism for undo/redo functionality.
 * @type {History}
 * 
 * Represents a fold gutter for code folding.
 * @type {FoldGutter}
 * 
 * Represents automatic indentation on input.
 * @type {IndentOnInput}
 * 
 * Represents highlighting of selection matches.
 * @type {HighlightSelectionMatches}
 * 
 * Represents highlighting of special characters.
 * @type {HighlightSpecialChars}
 * 
 * Represents drawing of selections in the editor.
 * @type {DrawSelection}
 * 
 * Represents a drop cursor for dragging and dropping text.
 * @type {DropCursor}
 * 
 * Represents rectangular selection functionality.
 * @type {RectangularSelection}
 * 
 * Represents a crosshair cursor for precise text selection.
 * @type {CrosshairCursor}
 *
 * Represents highlighting of the active line.
 * @type {HighlightActiveLine}
 *
 * Represents language support for Java in an editor.
 * @type {LanguageSupport}
 */



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