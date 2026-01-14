// lexical editor
import React, { useState, useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';
import {
  ListItemNode,
  ListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import { CodeNode, $createCodeNode } from '@lexical/code';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';

// editor theme
const theme = {
  heading: {
    h1: 'text-3xl font-bold text-gray-900 mt-4 mb-2',
    h2: 'text-2xl font-bold text-gray-800 mt-3 mb-1',
    h3: 'text-xl font-semibold text-gray-800 mt-2',
  },
  list: {
    ul: 'list-disc ml-5 mb-2',
    ol: 'list-decimal ml-5 mb-2',
    listitem: 'text-gray-700',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-1 rounded font-mono text-red-500',
  },
  code: 'bg-gray-800 text-white p-4 rounded-md font-mono text-sm my-2 block',
  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2',
};

// editor toolbar
const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // format state
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setActiveFormats({
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
      });
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  const btnClass = active =>
    `p-1.5 rounded transition-colors ${
      active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-white p-1.5 sticky top-0 z-10">
      <button
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        className={btnClass()}
      >
        ⟲
      </button>
      <button
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        className={btnClass()}
      >
        ⟳
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={btnClass(activeFormats.bold)}
      >
        <b>B</b>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={btnClass(activeFormats.italic)}
      >
        <i>I</i>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={btnClass(activeFormats.underline)}
      >
        <u>U</u>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createHeadingNode('h1'));
          })
        }
        className={btnClass()}
      >
        H1
      </button>

      <button
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createHeadingNode('h2'));
          })
        }
        className={btnClass()}
      >
        H2
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        className={btnClass()}
      >
        • List
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        className={btnClass()}
      >
        1. List
      </button>

      <button
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection))
              $setBlocksType(selection, () => $createCodeNode());
          })
        }
        className={btnClass()}
      >
        Code
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className={btnClass()}
      >
        Left
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className={btnClass()}
      >
        Center
      </button>
    </div>
  );
};

// main editor
const Richeditor = ({ onChange }) => {
  // editor config
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: err => console.error(err),
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode],
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid w-full h-80 border border-black rounded-xl overflow-hidden bg-white">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="flex flex-col borderborder-gray-300 h-full overflow-hidden">
            <Toolbar />
            <div className="relative flex-1 overflow-y-auto scrollbar-hide">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-full p-4 outline-none text-gray-800" />
                }
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 pointer-events-none italic">
                    Start writing something amazing...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <OnChangePlugin
                onChange={editorState => {
                  editorState.read(() => {
                    if (onChange) {
                      onChange(editorState.toJSON());
                    }
                  });
                }}
              />
            </div>
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default Richeditor;
