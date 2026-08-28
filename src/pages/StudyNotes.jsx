import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Save,
  Download,
  FileText,
  CalendarDays,
  Tag,
  Lightbulb,
  Brain,
  HelpCircle,
  RefreshCcw,
  Code2,
  Star,
  Check,
  ChevronLeft,
  Menu,
  X,
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading2,
  Clock3,
  MoreVertical,
} from "lucide-react";
import "./StudyNotes.css";

const STORAGE_KEY = "myLifeStudyNotes";

const createNote = () => ({
  id: Date.now() + Math.random(),
  title: "Untitled Study Note",
  subject: "General",
  topic: "",
  date: new Date().toISOString().slice(0, 10),

  content: "",
  keyPoints: "",
  definitions: "",
  examples: "",
  understanding: "",
  questions: "",
  revision: "",
  code: "",

  tags: [],
  favorite: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const starterNote = {
  ...createNote(),
  title: "JavaScript DOM",
  subject: "Web Development",
  topic: "Document Object Model",
  content:
    "<h2>What is DOM?</h2><p>DOM stands for <strong>Document Object Model</strong>. It allows JavaScript to interact with HTML elements.</p><p>The browser creates a tree-like representation of an HTML document.</p>",
  keyPoints:
    "DOM represents HTML as objects\nJavaScript can change HTML and CSS\nEvents allow user interaction\nquerySelector() selects elements",
  definitions:
    "DOM — Document Object Model\nElement — An individual HTML node\nEvent — An action such as click or keyboard input",
  examples:
    "document.querySelector('.btn')\ndocument.getElementById('title')\nbutton.addEventListener('click', handleClick)",
  understanding:
    "I understand DOM as the bridge between JavaScript and the HTML page. JavaScript uses DOM methods to find, change and respond to HTML elements.",
  questions:
    "How does event bubbling work?\nWhat is the difference between querySelector and getElementById?",
  revision:
    "Remember DOM methods\nPractice selecting elements\nPractice click events",
  code:
    "const button = document.querySelector('.btn');\n\nbutton.addEventListener('click', () => {\n  console.log('Button clicked');\n});",
  tags: ["javascript", "dom", "webdev"],
};

function StudyNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      return [starterNote];
    } catch (error) {
      console.error("StudyNotes loading error:", error);
      return [starterNote];
    }
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return starterNote.id;
  });

  const [search, setSearch] = useState("");
  const [savedStatus, setSavedStatus] = useState("Saved");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const editorRef = useRef(null);
  const saveTimer = useRef(null);

  const activeNote =
    notes.find((note) => note.id === activeId) || notes[0];

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [...notes].sort((a, b) => {
        if (a.favorite !== b.favorite) {
          return Number(b.favorite) - Number(a.favorite);
        }

        return (
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
        );
      });
    }

    return notes
      .filter((note) => {
        const searchableText = [
          note.title,
          note.subject,
          note.topic,
          note.content,
          note.keyPoints,
          note.definitions,
          note.examples,
          note.understanding,
          note.questions,
          note.revision,
          note.code,
          ...(note.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );
  }, [notes, search]);

  useEffect(() => {
    if (!activeNote) return;

    if (editorRef.current) {
      editorRef.current.innerHTML = activeNote.content || "";
    }
  }, [activeId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  function updateNote(field, value) {
    if (!activeNote) return;

    setSavedStatus("Saving...");

    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNote.id
          ? {
              ...note,
              [field]: value,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      setSavedStatus("Saved");
    }, 700);
  }

  function updateEditor() {
    if (!editorRef.current) return;

    updateNote("content", editorRef.current.innerHTML);
  }

  function createNewNote() {
    const note = createNote();

    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    setSearch("");
    setMobileSidebar(false);
    setSavedStatus("Saved");

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }, 0);
  }

  function duplicateNote() {
    if (!activeNote) return;

    const duplicate = {
      ...activeNote,
      id: Date.now() + Math.random(),
      title: `${activeNote.title} Copy`,
      favorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [duplicate, ...prev]);
    setActiveId(duplicate.id);
  }

  function deleteActiveNote() {
    if (!activeNote) return;

    const confirmed = window.confirm(
      `Delete "${activeNote.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const remaining = notes.filter(
      (note) => note.id !== activeNote.id
    );

    if (remaining.length === 0) {
      const newNote = createNote();

      setNotes([newNote]);
      setActiveId(newNote.id);
    } else {
      setNotes(remaining);
      setActiveId(remaining[0].id);
    }
  }

  function toggleFavorite() {
    if (!activeNote) return;

    updateNote("favorite", !activeNote.favorite);
  }

  function addTag(event) {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const value = event.target.value.trim();

    if (!value) return;

    const cleanTag = value.startsWith("#")
      ? value.slice(1)
      : value;

    if (!cleanTag) return;

    const currentTags = activeNote.tags || [];

    if (!currentTags.includes(cleanTag)) {
      updateNote("tags", [...currentTags, cleanTag]);
    }

    event.target.value = "";
  }

  function removeTag(tag) {
    updateNote(
      "tags",
      (activeNote.tags || []).filter((item) => item !== tag)
    );
  }

  function execCommand(command, value = null) {
    editorRef.current?.focus();

    try {
      document.execCommand(command, false, value);
    } catch (error) {
      console.error(error);
    }

    updateEditor();
  }

  function formatBlock(tag) {
    editorRef.current?.focus();

    try {
      document.execCommand("formatBlock", false, tag);
    } catch (error) {
      console.error(error);
    }

    updateEditor();
  }

  function insertDivider() {
    editorRef.current?.focus();

    try {
      document.execCommand(
        "insertHTML",
        false,
        "<hr />"
      );
    } catch (error) {
      console.error(error);
    }

    updateEditor();
  }

  function insertQuote() {
    editorRef.current?.focus();

    try {
      document.execCommand(
        "formatBlock",
        false,
        "blockquote"
      );
    } catch (error) {
      console.error(error);
    }

    updateEditor();
  }

  function saveNow() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    );

    setSavedStatus("Saved");
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function plainTextFromHTML(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html || "";
    return temp.innerText || "";
  }

  function escapeHTML(value = "") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function textToHTML(text = "") {
    return text
      .split("\n")
      .map((line) => {
        if (!line.trim()) {
          return "<div><br /></div>";
        }

        return `<div>${escapeHTML(line)}</div>`;
      })
      .join("");
  }

  function sectionHTML(title, icon, content) {
    if (!content || !content.trim()) return "";

    return `
      <section class="pdf-section">
        <h2>${icon} ${escapeHTML(title)}</h2>
        <div class="pdf-section-content">
          ${textToHTML(content)}
        </div>
      </section>
    `;
  }

  function downloadPDF() {
    if (!activeNote) return;

    const contentText = plainTextFromHTML(
      activeNote.content
    );

    const pdfWindow = window.open("", "_blank");

    if (!pdfWindow) {
      alert(
        "Please allow pop-ups in your browser to export the PDF."
      );
      return;
    }

    const tagsHTML = (activeNote.tags || [])
      .map(
        (tag) =>
          `<span class="pdf-tag">#${escapeHTML(tag)}</span>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHTML(activeNote.title)}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              background: #ffffff;
              color: #172033;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.7;
            }

            .page {
              max-width: 850px;
              margin: 0 auto;
            }

            .header {
              padding-bottom: 25px;
              border-bottom: 2px solid #e8ecf3;
              margin-bottom: 30px;
            }

            .eyebrow {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 1.8px;
              text-transform: uppercase;
              color: #667085;
              margin-bottom: 10px;
            }

            h1 {
              margin: 0 0 8px;
              font-size: 32px;
              line-height: 1.2;
              color: #111827;
            }

            .meta {
              color: #667085;
              font-size: 13px;
            }

            .tags {
              margin-top: 14px;
            }

            .pdf-tag {
              display: inline-block;
              margin: 0 6px 6px 0;
              padding: 4px 9px;
              border-radius: 999px;
              background: #f1f5f9;
              color: #475467;
              font-size: 11px;
              font-weight: 700;
            }

            .main-content {
              font-size: 15px;
            }

            .main-content h1,
            .main-content h2,
            .main-content h3 {
              color: #111827;
              line-height: 1.3;
            }

            .main-content h2 {
              font-size: 22px;
              margin-top: 25px;
            }

            .main-content p {
              margin: 8px 0;
            }

            .main-content ul,
            .main-content ol {
              padding-left: 25px;
            }

            .main-content blockquote {
              margin: 20px 0;
              padding: 14px 18px;
              border-left: 4px solid #64748b;
              background: #f8fafc;
              color: #475467;
            }

            .main-content hr {
              border: 0;
              border-top: 1px solid #e5e7eb;
              margin: 25px 0;
            }

            .pdf-section {
              margin-top: 28px;
              page-break-inside: avoid;
            }

            .pdf-section h2 {
              margin: 0 0 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 19px;
              color: #111827;
            }

            .pdf-section-content {
              font-size: 14px;
              color: #344054;
            }

            .pdf-section-content div {
              min-height: 1em;
            }

            .code-box {
              margin-top: 28px;
              page-break-inside: avoid;
            }

            .code-box h2 {
              font-size: 19px;
              margin-bottom: 12px;
            }

            pre {
              white-space: pre-wrap;
              background: #111827;
              color: #f8fafc;
              padding: 18px;
              border-radius: 10px;
              font-family: "Courier New", monospace;
              font-size: 12px;
              line-height: 1.6;
              overflow-wrap: break-word;
            }

            .footer {
              margin-top: 45px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              color: #98a2b3;
              font-size: 10px;
              text-align: center;
            }

            @media print {
              body {
                padding: 20px;
              }

              .page {
                max-width: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="page">

            <header class="header">
              <div class="eyebrow">
                Study Notes
              </div>

              <h1>
                ${escapeHTML(activeNote.title)}
              </h1>

              <div class="meta">
                ${escapeHTML(activeNote.subject || "General")}
                ${
                  activeNote.topic
                    ? ` · ${escapeHTML(activeNote.topic)}`
                    : ""
                }
                · ${escapeHTML(
                  formatDate(activeNote.date)
                )}
              </div>

              ${
                tagsHTML
                  ? `<div class="tags">${tagsHTML}</div>`
                  : ""
              }
            </header>

            ${
              contentText.trim()
                ? `
                <section class="main-content">
                  ${activeNote.content}
                </section>
              `
                : ""
            }

            ${sectionHTML(
              "Key Points",
              "⭐",
              activeNote.keyPoints
            )}

            ${sectionHTML(
              "Definitions",
              "📖",
              activeNote.definitions
            )}

            ${sectionHTML(
              "Examples",
              "💡",
              activeNote.examples
            )}

            ${sectionHTML(
              "My Understanding",
              "🧠",
              activeNote.understanding
            )}

            ${sectionHTML(
              "Questions & Doubts",
              "❓",
              activeNote.questions
            )}

            ${sectionHTML(
              "Revision Points",
              "🔁",
              activeNote.revision
            )}

            ${
              activeNote.code &&
              activeNote.code.trim()
                ? `
                <section class="code-box">
                  <h2>💻 Code</h2>
                  <pre>${escapeHTML(
                    activeNote.code
                  )}</pre>
                </section>
              `
                : ""
            }

            <div class="footer">
              Created with Study Notes
            </div>

          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 350);
            };
          </script>
        </body>
      </html>
    `;

    pdfWindow.document.open();
    pdfWindow.document.write(html);
    pdfWindow.document.close();
  }

  if (!activeNote) {
    return (
      <div className="study-notes-page">
        <div className="study-empty">
          <BookOpen size={42} />
          <h2>No notes available</h2>
          <button
            className="study-primary-btn"
            onClick={createNewNote}
          >
            <Plus size={17} />
            Create Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="study-notes-page">

      {/* MOBILE OVERLAY */}

      {mobileSidebar && (
        <div
          className="study-mobile-overlay"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`study-sidebar ${
          mobileSidebar ? "mobile-open" : ""
        }`}
      >
        <div className="study-sidebar-top">

          <div className="study-brand">
            <div className="study-brand-icon">
              <BookOpen size={20} />
            </div>

            <div>
              <strong>Study Notes</strong>
              <span>Your knowledge space</span>
            </div>
          </div>

          <button
            className="study-mobile-close"
            onClick={() => setMobileSidebar(false)}
          >
            <X size={19} />
          </button>

        </div>

        <button
          className="study-new-btn"
          onClick={createNewNote}
        >
          <Plus size={18} />
          New Study Note
        </button>

        <div className="study-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="study-search-clear"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="study-sidebar-label">
          MY NOTES
          <span>{notes.length}</span>
        </div>

        <div className="study-note-list">

          {filteredNotes.length === 0 ? (
            <div className="study-no-results">
              <Search size={25} />
              <strong>No notes found</strong>
              <span>
                Try another search term.
              </span>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                className={`study-note-item ${
                  activeNote.id === note.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActiveId(note.id);
                  setMobileSidebar(false);
                }}
              >
                <div className="study-note-item-icon">
                  {note.favorite ? (
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                  ) : (
                    <FileText size={16} />
                  )}
                </div>

                <div className="study-note-item-info">
                  <strong>
                    {note.title || "Untitled Note"}
                  </strong>

                  <span>
                    {note.subject || "General"}
                  </span>

                  <small>
                    {formatDate(note.updatedAt)}
                  </small>
                </div>
              </button>
            ))
          )}

        </div>

        <div className="study-sidebar-footer">
          <div className="study-storage-status">
            <span className="storage-dot" />
            <span>
              Notes saved locally
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="study-main">

        {/* TOPBAR */}

        <header className="study-topbar">

          <button
            className="study-menu-btn"
            onClick={() =>
              setMobileSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div className="study-breadcrumb">
            <span>Study Notes</span>
            <ChevronLeft
              size={14}
              className="breadcrumb-arrow"
            />
            <strong>
              {activeNote.subject || "General"}
            </strong>
          </div>

          <div className="study-top-actions">

            <div
              className={`study-save-status ${
                savedStatus === "Saving..."
                  ? "saving"
                  : ""
              }`}
            >
              {savedStatus === "Saved" ? (
                <Check size={14} />
              ) : (
                <Clock3 size={14} />
              )}

              {savedStatus}
            </div>

            <button
              className="study-icon-btn"
              title="Save"
              onClick={saveNow}
            >
              <Save size={17} />
            </button>

            <button
              className="study-pdf-btn"
              onClick={downloadPDF}
            >
              <Download size={16} />
              Save as PDF
            </button>

          </div>
        </header>

        {/* EDITOR AREA */}

        <div className="study-editor-wrapper">

          <div className="study-editor-header">

            <div className="study-title-area">

              <input
                className="study-title-input"
                value={activeNote.title}
                placeholder="Note title..."
                onChange={(event) =>
                  updateNote(
                    "title",
                    event.target.value
                  )
                }
              />

              <div className="study-meta-fields">

                <div className="study-meta-field">
                  <BookOpen size={14} />

                  <input
                    value={activeNote.subject}
                    placeholder="Subject"
                    onChange={(event) =>
                      updateNote(
                        "subject",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="study-meta-field">
                  <FileText size={14} />

                  <input
                    value={activeNote.topic}
                    placeholder="Topic / Chapter"
                    onChange={(event) =>
                      updateNote(
                        "topic",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="study-meta-field">
                  <CalendarDays size={14} />

                  <input
                    type="date"
                    value={activeNote.date}
                    onChange={(event) =>
                      updateNote(
                        "date",
                        event.target.value
                      )
                    }
                  />
                </div>

              </div>

            </div>

            <div className="study-header-actions">

              <button
                className={`study-favorite-btn ${
                  activeNote.favorite
                    ? "active"
                    : ""
                }`}
                onClick={toggleFavorite}
                title="Favorite"
              >
                <Star
                  size={18}
                  fill={
                    activeNote.favorite
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <button
                className="study-more-btn"
                onClick={duplicateNote}
                title="Duplicate note"
              >
                <MoreVertical size={18} />
              </button>

            </div>

          </div>

          {/* TAGS */}

          <div className="study-tags-row">

            <Tag size={15} />

            {(activeNote.tags || []).map(
              (tag) => (
                <span
                  className="study-tag"
                  key={tag}
                >
                  #{tag}

                  <button
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    ×
                  </button>
                </span>
              )
            )}

            <input
              className="study-tag-input"
              placeholder="Add tag + Enter"
              onKeyDown={addTag}
            />

          </div>

          {/* FORMAT TOOLBAR */}

          <div className="study-format-toolbar">

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                formatBlock("h2")
              }
              title="Heading"
            >
              <Heading2 size={17} />
            </button>

            <div className="format-divider" />

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand("bold")
              }
              title="Bold"
            >
              <Bold size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand("italic")
              }
              title="Italic"
            >
              <Italic size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand("underline")
              }
              title="Underline"
            >
              <Underline size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand(
                  "hiliteColor",
                  "#fef08a"
                )
              }
              title="Highlight"
            >
              <Highlighter size={17} />
            </button>

            <div className="format-divider" />

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand(
                  "insertUnorderedList"
                )
              }
              title="Bullet list"
            >
              <List size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={() =>
                execCommand(
                  "insertOrderedList"
                )
              }
              title="Numbered list"
            >
              <ListOrdered size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={insertQuote}
              title="Quote"
            >
              <Quote size={17} />
            </button>

            <button
              onMouseDown={(e) =>
                e.preventDefault()
              }
              onClick={insertDivider}
              title="Divider"
            >
              <Minus size={17} />
            </button>

          </div>

          {/* MAIN NOTE */}

          <section className="study-writing-section">

            <div className="study-section-heading">
              <div>
                <span className="section-number">
                  01
                </span>

                <div>
                  <strong>
                    Main Notes
                  </strong>

                  <span>
                    Write everything you want to remember.
                  </span>
                </div>
              </div>
            </div>

            <div
              ref={editorRef}
              className="study-rich-editor"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Start writing your notes here..."
              onInput={updateEditor}
              spellCheck
            />

          </section>

          {/* MEMORY SECTIONS */}

          <div className="study-memory-grid">

            {/* KEY POINTS */}

            <section className="study-card key-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <Star size={17} />
                </div>

                <div>
                  <strong>
                    Key Points
                  </strong>
                  <span>
                    What must I remember?
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.keyPoints}
                placeholder={
                  "• Important concept\n• Important formula\n• Main idea"
                }
                onChange={(event) =>
                  updateNote(
                    "keyPoints",
                    event.target.value
                  )
                }
              />

            </section>

            {/* DEFINITIONS */}

            <section className="study-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <BookOpen size={17} />
                </div>

                <div>
                  <strong>
                    Definitions
                  </strong>
                  <span>
                    Terms I need to know
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.definitions}
                placeholder={
                  "Term — Meaning\nTerm — Meaning"
                }
                onChange={(event) =>
                  updateNote(
                    "definitions",
                    event.target.value
                  )
                }
              />

            </section>

            {/* EXAMPLES */}

            <section className="study-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <Lightbulb size={17} />
                </div>

                <div>
                  <strong>
                    Examples
                  </strong>
                  <span>
                    Examples that make it clear
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.examples}
                placeholder={
                  "Example 1...\nExample 2..."
                }
                onChange={(event) =>
                  updateNote(
                    "examples",
                    event.target.value
                  )
                }
              />

            </section>

            {/* UNDERSTANDING */}

            <section className="study-card understanding-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <Brain size={17} />
                </div>

                <div>
                  <strong>
                    My Understanding
                  </strong>
                  <span>
                    Explain it in your own words
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.understanding}
                placeholder={
                  "Explain this concept as if you were teaching someone..."
                }
                onChange={(event) =>
                  updateNote(
                    "understanding",
                    event.target.value
                  )
                }
              />

            </section>

            {/* QUESTIONS */}

            <section className="study-card question-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <HelpCircle size={17} />
                </div>

                <div>
                  <strong>
                    Questions & Doubts
                  </strong>
                  <span>
                    Things I still need to understand
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.questions}
                placeholder={
                  "What is confusing?\nWhat should I ask?\nWhat should I research?"
                }
                onChange={(event) =>
                  updateNote(
                    "questions",
                    event.target.value
                  )
                }
              />

            </section>

            {/* REVISION */}

            <section className="study-card revision-card">

              <div className="study-card-header">
                <div className="study-card-icon">
                  <RefreshCcw size={17} />
                </div>

                <div>
                  <strong>
                    Revision Points
                  </strong>
                  <span>
                    What should I revise later?
                  </span>
                </div>
              </div>

              <textarea
                value={activeNote.revision}
                placeholder={
                  "☐ Revise concept\n☐ Practice examples\n☐ Solve questions"
                }
                onChange={(event) =>
                  updateNote(
                    "revision",
                    event.target.value
                  )
                }
              />

            </section>

          </div>

          {/* CODE */}

          <section className="study-code-section">

            <div className="study-code-header">

              <div>
                <div className="study-code-icon">
                  <Code2 size={17} />
                </div>

                <div>
                  <strong>
                    Code / Technical Notes
                  </strong>

                  <span>
                    Save useful code snippets with your notes.
                  </span>
                </div>
              </div>

              <span className="code-label">
                CODE
              </span>

            </div>

            <textarea
              className="study-code-editor"
              value={activeNote.code}
              placeholder={`const example = "Write your code here";\n\n// Your code...`}
              spellCheck={false}
              onChange={(event) =>
                updateNote(
                  "code",
                  event.target.value
                )
              }
            />

          </section>

          {/* BOTTOM */}

          <div className="study-bottom-bar">

            <div className="study-last-updated">
              <Clock3 size={14} />

              Last edited{" "}
              {formatDate(activeNote.updatedAt)}
            </div>

            <div className="study-bottom-actions">

              <button
                className="study-duplicate-btn"
                onClick={duplicateNote}
              >
                Duplicate
              </button>

              <button
                className="study-delete-btn"
                onClick={deleteActiveNote}
              >
                <Trash2 size={15} />
                Delete Note
              </button>

              <button
                className="study-save-bottom-btn"
                onClick={saveNow}
              >
                <Save size={15} />
                Save
              </button>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default StudyNotes;