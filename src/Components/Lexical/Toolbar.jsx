import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { RICH_TEXT_OPTIONS, RichTextAction, LOW_PRIORIRTY } from "../Constants";
import { HEADINGS } from "../Constants";
import { $createHeadingNode } from "@lexical/rich-text";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState({});

  const updateToolbar = () => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setSelectionMap({
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Code]: selection.hasFormat("code"),
      });
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((p) => ({
            ...p,
            [RichTextAction.Undo]: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((p) => ({
            ...p,
            [RichTextAction.Redo]: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  const onAction = (id) => {
    switch (id) {
      case RichTextAction.Bold:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case RichTextAction.Italics:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case RichTextAction.Underline:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case RichTextAction.Strikethrough:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case RichTextAction.Code:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      case RichTextAction.LeftAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case RichTextAction.CenterAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case RichTextAction.RightAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case RichTextAction.JustifyAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        break;
      case RichTextAction.Undo:
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      case RichTextAction.Redo:
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-black p-2">
      <select type="button"
        className="border border-black p-1 h-8 mr-2"
        onChange={(e) => {
          const heading = e.target.value;
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 0) return;

              const headingNode = $createHeadingNode(heading);
              nodes.forEach((node) => {
                node.remove(); // detach node from its current parent
                headingNode.append(node);
              });

              selection.insertNodes([headingNode]);
            }
          });
        }}
        defaultValue=""
      >
        <option value="" disabled>
         Heading
        </option>
        {HEADINGS.map((h) => (
          <option key={h} value={h}>
            {h.toUpperCase()}
          </option>
        ))}
      </select>
      {RICH_TEXT_OPTIONS.map(({ id, label, icon: Icon }) =>
        id === RichTextAction.Divider ? (
          // eslint-disable-next-line react-hooks/purity
          <div key={Math.random()} className="w-px h-5 bg-black mx-1" />
        ) : (
          <button
            type="button"
            key={id}
            onClick={() => onAction(id)}
            disabled={disableMap[id]}
            className={`flex items-center justify-center w-8 h-8 border border-black
              ${selectionMap[id] ? "bg-black text-white" : "bg-white text-black"}
              disabled:opacity-40`}
            title={label}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </button>
        )
      )}
    </div>
  );
};

export default Toolbar;