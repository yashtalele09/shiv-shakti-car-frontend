import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Highlighter,
} from "lucide-react";
import { Button } from "./button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cyan-600 underline cursor-pointer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <div
      className={`border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bold")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("italic")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("underline")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("bulletList")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive("orderedList")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive({ textAlign: "left" })
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive({ textAlign: "center" })
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`h-8 w-8 p-0 ${
              editor.isActive({ textAlign: "right" })
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Links and Colors */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`h-8 w-8 p-0 ${
              editor.isActive("link")
                ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                : ""
            }`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHighlight("#fef3c7")}
            className="h-8 w-8 p-0"
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColor("#dc2626")}
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
              title="Red"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColor("#059669")}
              className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
              title="Green"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColor("#2563eb")}
              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
              title="Blue"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setColor("#7c3aed")}
              className="h-8 w-8 p-0 bg-purple-500 hover:bg-purple-600"
              title="Purple"
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white dark:bg-slate-900">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[120px] focus:outline-none prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-strong:text-gray-900 dark:prose-strong:text-slate-100 prose-em:text-gray-700 dark:prose-em:text-slate-300 prose-ul:text-gray-700 dark:prose-ul:text-slate-300 prose-ol:text-gray-700 dark:prose-ol:text-slate-300 prose-li:text-gray-700 dark:prose-li:text-slate-300 prose-blockquote:text-gray-600 dark:prose-blockquote:text-slate-400 prose-code:text-gray-900 dark:prose-code:text-slate-100 prose-pre:bg-gray-100 dark:prose-pre:bg-slate-800 prose-a:text-cyan-600 dark:prose-a:text-cyan-400"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
