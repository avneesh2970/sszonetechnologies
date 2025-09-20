/* eslint-disable react/prop-types */
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrderedIcon as OrderedList,
  Quote,
  ImageIcon,
  LinkIcon,
  AlignLeftIcon as TextAlignLeft,
  AlignCenterIcon as TextAlignCenter,
  AlignRightIcon as TextAlignRight,
  AlignJustifyIcon as TextAlignJustify,
  UnderlineIcon,
  SuperscriptIcon,
  SubscriptIcon,
  HighlighterIcon as HighlightIcon,
  CodeIcon,
} from "lucide-react"


// import HeadingDropdown from "./HeadingDropdown";

const CustomMenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center bg-gray-100 border border-gray-300 rounded-md p-2">
      {/* Headings */}
      <div className="flex items-center mr-2">
        {/* <HeadingDropdown editor={editor} /> */}
      </div>

      {/* Text Styles */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("bold") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Bold"
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("italic") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Italic"
        >
          <Italic className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("strike") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("code") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Code"
        >
          <Code className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("underline") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("superscript") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Superscript"
        >
          <SuperscriptIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("subscript") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Subscript"
        >
          <SubscriptIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("highlight") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Highlight"
        >
          <HighlightIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("codeBlock") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Code Block"
        >
          <CodeIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("bulletList") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Bullet List"
        >
          <List className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("orderedList") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Ordered List"
        >
          <OrderedList className="h-5 w-5" />
        </button>
      </div>

      {/* Blockquotes */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("blockquote") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Blockquote"
        >
          <Quote className="h-5 w-5" />
        </button>
      </div>

      {/* Horizontal Rule */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
          title="Horizontal Rule"
        >
          <hr className="w-5 border-t-2 border-gray-700" />
        </button>
      </div>

      {/* Image */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL")
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("image") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Link */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive("link") ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Link"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
        {/* <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
          title="Remove Link"
        >
          Unlink
        </button> */}
      </div>

      {/* Text Alignment */}
      <div className="flex items-center mr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Align Left"
        >
          <TextAlignLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-200 text-emerald-600"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Align Center"
        >
          <TextAlignCenter className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-emerald-600" : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Align Right"
        >
          <TextAlignRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded-md flex items-center ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-gray-200 text-emerald-600"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          title="Align Justify"
        >
          <TextAlignJustify className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default CustomMenuBar