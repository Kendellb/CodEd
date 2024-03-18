/**
 * Creates and initializes a CodeMirror editor using the basic setup. using the config from CodeMirror Docs.
 * This is created in the editor.bundle.js file.
 *
 * The imports are packages installed using npm and are under the codemirror main package
 * in the imports {} are functions that each package contains. These fucntions are extentions 
 * that edit the state of the codemirror window.
 * 
 * 
 * @typedef {Object} EditorState Represents the initial state of the CodeMirror editor.
 *
 * @typedef {Object} EditorView Represents a CodeMirror editor instance.
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
 * @typedef {Object} Keymap Represents a set of keyboard shortcuts.
 */

/**
 * Represents language support for Java.
 * @typedef {Object} LanguageSupport Represents language-specific support for Java code.
 */

/**
 * Represents line numbers displayed in the editor.
 * @typedef {Object} LineNumbers Represents the display of line numbers in the editor.
 */

/**
 * Represents highlighting of the active line gutter.
 * @typedef {Object} HighlightActiveLineGutter Represents the visual highlighting of the active line gutter.
 */

/**
 * Represents bracket matching functionality.
 * @typedef {Object} BracketMatching Represents the capability to match brackets in the editor.
 */

/**
 * Represents automatic insertion of closing brackets.
 * @typedef {Object} CloseBrackets Represents the automatic insertion of closing brackets in the editor.
 */

/**
 * Represents syntax highlighting for Java code.
 * @typedef {Object} SyntaxHighlighting Represents the syntax highlighting rules for Java code.
 */

/**
 * Represents a history mechanism for undo/redo functionality.
 * @typedef {Object} History Represents the history mechanism for undo/redo functionality in the editor.
 */

/**
 * Represents a fold gutter for code folding.
 * @typedef {Object} FoldGutter Represents the gutter used for code folding.
 */

/**
 * Represents automatic indentation on input.
 * @typedef {Object} IndentOnInput Represents automatic indentation behavior on user input.
 */

/**
 * Represents highlighting of selection matches.
 * @typedef {Object} HighlightSelectionMatches Represents the highlighting of matches for the selected text.
 */

/**
 * Represents highlighting of special characters.
 * @typedef {Object} HighlightSpecialChars Represents the highlighting of special characters in the editor.
 */

/**
 * Represents drawing of selections in the editor.
 * @typedef {Object} DrawSelection Represents the drawing of selections in the editor.
 */

/**
 * Represents a drop cursor for dragging and dropping text.
 * @typedef {Object} DropCursor Represents the cursor used for dragging and dropping text in the editor.
 */

/**
 * Represents rectangular selection functionality.
 * @typedef {Object} RectangularSelection Represents the functionality for making rectangular selections in the editor.
 */

/**
 * Represents a crosshair cursor for precise text selection.
 * @typedef {Object} CrosshairCursor Represents the cursor used for precise text selection.
 */

/**
 * Represents highlighting of the active line.
 * @typedef {Object} HighlightActiveLine Represents the highlighting of the active line in the editor.
 */

/**
 * Represents language support for Java in an editor.
 * @typedef {Object} LanguageSupport Represents language-specific support for Java in the editor.
 */


let extensions = [
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



/**
 * Class representing a text editor.
 */
class Editor {
  /**
   * Create an Editor.
   * @param {HTMLElement} el - The HTML element to attach the editor to.
   * @param {string} value - The initial value of the editor.
   */
  constructor(el, value) {
    /**
     * @private
     * @type {EditorView}
     */
    const state = this.createState(value);
    /**
     * The view of the editor.
     * @type {EditorView}
     */
    this.view = new EditorView({
      parent: el,
      state
    });
  }

  /**
   * Create the state of the editor.
   * @param {string} value - The initial value of the editor state.
   * @returns {EditorState} The created editor state.
   */
  createState(value) {
    return EditorState.create({
      doc: value,
      extensions: extensions
    });
  }

  /**
   * Update the state of the editor.
   * @param {string} str - The new value to set for the editor state.
   */
  updateState(str) {
    var newState = EditorState.create({
      doc: str,
      extensions: extensions
    });
    this.view.setState(newState);
    /*
    this.view.dispatch({
      changes: {from: 0, to: this.view.state.doc.length , insert: str}
    });
    */
  }
}


export default Editor;


