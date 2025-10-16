// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const InsAnnouncement = ({ courseId }) => {
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       toast.error("Title is required!");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/insAnnouncement`,
//         { title, courseId }
//       );

//       if (res.data.success) {
//         toast.success("Announcement added successfully!");
//         setTitle(""); // clear input
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.error || "Failed to add announcement."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
//       <h2 className="text-xl font-bold mb-4">Add Announcement</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Enter announcement title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded-lg text-white ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {loading ? "Saving..." : "Add Announcement"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InsAnnouncement;








import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * AnnouncementEditor.jsx
 * React 19 single-file rich-text editor using contentEditable + execCommand.
 *
 * Props:
 * - initialHtml = ""           // initial HTML content
 * - onChange = (html) => {}    // called whenever HTML changes
 * - className = ""             // wrapper tailwind classes
 * - placeholder = "..."        // editor placeholder
 * - courseId                    // id sent to backend (required for save)
 * - onSaved = (respData) => {} // called on successful save
 */
export default function AnnouncementEditor({
  initialHtml = "",
  onChange = () => {},
  className = "",
  placeholder = "Write your announcement...",
  courseId = null,
  onSaved = () => {},
}) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [html, setHtml] = useState(initialHtml || "");
  const [selectionExists, setSelectionExists] = useState(false);
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });
  const [block, setBlock] = useState("p");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- Selection helpers ----------
  function saveSelectionRange() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    try {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    } catch (e) {
      // ignore
    }
  }

  function restoreSelection() {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function isSelectionInsideEditor() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const node = sel.anchorNode;
    if (!editorRef.current) return false;
    const target = node && node.nodeType === 3 ? node.parentNode : node;
    return target ? editorRef.current.contains(target) : false;
  }

  // ---------- Toolbar state sync ----------
  function syncToolbarStates() {
    if (!editorRef.current || !isSelectionInsideEditor()) return;
    // ensure focus so queryCommandState works
    editorRef.current.focus();
    try {
      setFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
      });
      const fb = document.queryCommandValue("formatBlock");
      const v = typeof fb === "string" ? fb.toLowerCase() : "p";
      setBlock(v === "h1" ? "1" : v === "h2" ? "2" : v === "h3" ? "3" : "p");
    } catch (_) {
      // ignore (some browsers limit execCommand)
    }
  }

  // ---------- Exec wrapper ----------
  function exec(cmd, value = null) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    try {
      document.execCommand(cmd, false, value);
    } catch (e) {
      // fallback: try simple DOM manipulations for some commands if needed
      console.warn("execCommand failed:", cmd, e);
    }
    ensureListStyles();
    updateHtml();
    syncToolbarStates();
    saveSelectionRange();
  }

  // ---------- HTML state / sanitization ----------
  function updateHtml() {
    const content = editorRef.current ? editorRef.current.innerHTML : "";
    setHtml(content);
    onChange(content);
  }

  function handleInput() {
    ensureListStyles();
    updateHtml();
  }

  // sanitize paste: only plain text insertion
  function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    // insertText will preserve caret, and be safest
    try {
      document.execCommand("insertText", false, text);
    } catch {
      // fallback: insert at range
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
    }
    ensureListStyles();
    updateHtml();
  }

  // ---------- Utilities ----------
  function insertLink() {
    if (!selectionExists) {
      toast.info("Select text to create a link.");
      return;
    }
    const url = window.prompt("Enter URL (https://...)");
    if (!url) return;
    exec("createLink", url);
  }

  function insertImage() {
    const url = window.prompt("Enter image URL (https://...)");
    if (!url) return;
    exec("insertImage", url);
  }

  function toggleCodeBlock() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = selectedText;
    pre.appendChild(code);
    range.deleteContents();
    range.insertNode(pre);
    // move caret after inserted node
    const after = document.createRange();
    after.setStartAfter(pre);
    after.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(after);
    updateHtml();
  }

  function clearFormatting() {
    // remove inline formats
    exec("removeFormat");
    // convert headings/blocks to paragraph
    exec("formatBlock", "p");
    updateHtml();
  }

  function applyHeading(level) {
    if (![1, 2, 3].includes(level)) level = 3;
    exec("formatBlock", `H${level}`);
  }

  function ensureListStyles() {
    if (!editorRef.current) return;
    const root = editorRef.current;

    // headings
    root.querySelectorAll("h1,h2,h3").forEach((el) => {
      if (el.tagName === "H1") {
        el.style.fontSize = "1.875rem";
        el.style.fontWeight = "700";
        el.style.lineHeight = "2.25rem";
        el.style.marginTop = "0.5rem";
        el.style.marginBottom = "0.5rem";
      } else if (el.tagName === "H2") {
        el.style.fontSize = "1.5rem";
        el.style.fontWeight = "700";
        el.style.lineHeight = "2rem";
        el.style.marginTop = "0.5rem";
        el.style.marginBottom = "0.5rem";
      } else {
        el.style.fontSize = "1.25rem";
        el.style.fontWeight = "600";
        el.style.lineHeight = "1.75rem";
        el.style.marginTop = "0.375rem";
        el.style.marginBottom = "0.375rem";
      }
    });

    root.querySelectorAll("ul").forEach((ul) => {
      ul.style.listStyleType = "disc";
      ul.style.listStylePosition = "outside";
      ul.style.paddingLeft = "1.5rem";
      ul.style.marginTop = "0.25rem";
      ul.style.marginBottom = "0.25rem";
    });

    root.querySelectorAll("ol").forEach((ol) => {
      ol.style.listStyleType = "decimal";
      ol.style.listStylePosition = "outside";
      ol.style.paddingLeft = "1.5rem";
      ol.style.marginTop = "0.25rem";
      ol.style.marginBottom = "0.25rem";
    });

    root.querySelectorAll("li").forEach((li) => {
      li.style.display = "list-item";
    });
  }

  // ---------- Selection change listener ----------
  useEffect(() => {
    function checkSelection() {
      const sel = window.getSelection();
      const hasText = Boolean(sel && sel.toString());
      setSelectionExists(hasText);

      if (sel && sel.rangeCount > 0 && isSelectionInsideEditor()) {
        try {
          const range = sel.getRangeAt(0).cloneRange();
          savedRangeRef.current = range;
        } catch (_) {
          // ignore
        }
      }
      syncToolbarStates();
    }

    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set initial html
  useEffect(() => {
    if (!editorRef.current) return;
    if (initialHtml !== undefined && initialHtml !== null) {
      editorRef.current.innerHTML = initialHtml;
      ensureListStyles();
      setHtml(editorRef.current.innerHTML);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHtml]);

  useEffect(() => {
    ensureListStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Submit to backend ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }
    if (!courseId) {
      toast.error("Missing courseId. Can't save announcement.");
      return;
    }

    try {
      setLoading(true);
      // ensure latest html
      updateHtml();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/insAnnouncement`,
        { title: title.trim(), courseId, content: html }
      );

      if (res?.data?.success) {
        toast.success("Announcement added successfully!");
        setTitle("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          updateHtml();
        }
        onSaved(res.data);
      } else {
        toast.error(res?.data?.error || "Failed to save announcement.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add announcement.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Rendering ----------
  const showPlaceholder = !html || html === "<br>" || html.trim() === "";

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="p-3 border-b">
          <input
            value={title}
            // onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full p-2 border rounded focus:outline-none"
            aria-label="Announcement title"
          />
        </div>

        {/* Toolbar */}
        <div role="toolbar" aria-label="Announcement editor toolbar" className="flex flex-wrap gap-1 p-2 bg-white">
          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("undo")} title="Undo">Undo</button>
          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("redo")} title="Redo">Redo</button>

          <button type="button" className={`px-2 py-1 rounded hover:bg-gray-100 ${formats.bold ? "bg-gray-100" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")} title="Bold (Ctrl/Cmd+B)" aria-pressed={formats.bold}>B</button>

          <button type="button" className={`px-2 py-1 rounded hover:bg-gray-100 ${formats.italic ? "bg-gray-100" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")} title="Italic (Ctrl/Cmd+I)" aria-pressed={formats.italic}>I</button>

          <button type="button" className={`px-2 py-1 rounded hover:bg-gray-100 ${formats.underline ? "bg-gray-100" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")} title="Underline (Ctrl/Cmd+U)" aria-pressed={formats.underline}>U</button>

          <button type="button" className={`px-2 py-1 rounded hover:bg-gray-100 ${formats.ul ? "bg-gray-100" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")} title="Bulleted list" aria-pressed={formats.ul}>• List</button>

          <button type="button" className={`px-2 py-1 rounded hover:bg-gray-100 ${formats.ol ? "bg-gray-100" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")} title="Numbered list" aria-pressed={formats.ol}>1. List</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("outdent")} title="Outdent">←</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("indent")} title="Indent">→</button>

          <select value={block} onChange={(e) => {
            const val = e.target.value;
            if (val === "p") exec("formatBlock", "p");
            else exec("formatBlock", `H${val}`);
            setBlock(val);
          }} className="px-2 py-1 rounded border" title="Headings/Paragraph" aria-label="Headings">
            <option value="p">Paragraph</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyLeft")} title="Align left">L</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyCenter")} title="Align center">C</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyRight")} title="Align right">R</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={insertLink} title="Insert link" disabled={!selectionExists}>Link</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={insertImage} title="Insert image URL">Image</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={toggleCodeBlock} title="Code block" disabled={!selectionExists}>Code</button>

          <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" onMouseDown={(e) => e.preventDefault()} onClick={clearFormatting} title="Clear formatting">Clear</button>

          <input aria-label="Text color" type="color" onMouseDown={(e) => e.preventDefault()} onChange={(e) => exec("foreColor", e.target.value)} className="w-8 h-8 p-0 border-0" title="Text color" />
        </div>

        {/* Editable area */}
        <div className="p-4">
          <div
            ref={editorRef}
            onInput={() => {
              handleInput();
              syncToolbarStates();
            }}
            onPaste={handlePaste}
            contentEditable
            suppressContentEditableWarning
            className={`min-h-[160px] p-3 bg-white outline-none border rounded ${showPlaceholder ? "text-gray-400" : "text-gray-800"}`}
            aria-label="Announcement content"
            style={{ whiteSpace: "pre-wrap", caretColor: "auto" }}
          >
            {/* show placeholder as node when editor empty */}
            {showPlaceholder ? placeholder : undefined}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 p-2 bg-gray-50">
          <div className="text-sm text-gray-600">HTML length: {html.length}</div>

          <div className="flex gap-2 items-center">
            <button type="button" className="px-3 py-1 rounded bg-white border hover:bg-gray-100" onClick={() => {
              // preview in new tab
              const w = window.open();
              if (!w) return;
              w.document.write(html || "<p></p>");
              w.document.close();
            }}>
              Preview
            </button>

            <button type="button" className="px-3 py-1 rounded bg-white border hover:bg-gray-100" onClick={() => {
              // manual save trigger: update parent and keep editor
              updateHtml();
              toast.success("Content updated locally");
            }}>
              Save (local)
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {loading ? "Saving..." : "Add Announcement"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
