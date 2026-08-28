import { useState } from "react";

import {
  Plus,
  FileText,
  Trash2,
  Edit3,
  Check,
  Search,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

function Scripts() {
  const {
    scripts = [],
    addScript,
    updateScript,
    deleteScript,
  } = useLife();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Vlog");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editingContent, setEditingContent] =
    useState("");

  // ========================================
  // ADD SCRIPT
  // ========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    addScript({
      title: title.trim(),
      type,
      content: content.trim(),
    });

    setTitle("");
    setType("Vlog");
    setContent("");
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredScripts = scripts.filter(
    (script) =>
      script.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      script.content
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ========================================
  // EDIT
  // ========================================

  const startEditing = (script) => {
    setEditingId(script.id);
    setEditingContent(script.content);
  };

  const saveEditing = (id) => {
    updateScript(id, {
      content: editingContent,
    });

    setEditingId(null);
    setEditingContent("");
  };

  // ========================================
  // UI
  // ========================================

  return (
    <main className="scripts-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            CONTENT WORKSPACE
          </p>

          <h1>
            My Scripts
          </h1>

          <p className="subtitle">
            Capture ideas. Write stories.
            Create consistently.
          </p>

        </div>

        <div className="script-summary">

          <div className="script-summary-icon">
            <FileText size={22} />
          </div>

          <div>

            <strong>
              {scripts.length}
            </strong>

            <span>
              Total scripts
            </span>

          </div>

        </div>

      </div>

      {/* ADD SCRIPT */}

      <form
        className="script-form"
        onSubmit={handleSubmit}
      >

        <div className="input-group">

          <label>
            Script Title
          </label>

          <input
            type="text"
            placeholder="e.g. My 30 Days Client Hunting Journey"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>
            Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="Vlog">
              Vlog
            </option>

            <option value="Long Video">
              Long Video
            </option>

            <option value="Short">
              Short
            </option>

            <option value="Story">
              Story
            </option>

            <option value="Hook">
              Hook
            </option>

            <option value="Educational">
              Educational
            </option>

          </select>

        </div>

        <div className="input-group script-content-input">

          <label>
            Script / Idea
          </label>

          <textarea
            placeholder="Write your script here..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

        </div>

        <button
          type="submit"
          className="add-task-btn"
        >

          <Plus size={18} />

          Save Script

        </button>

      </form>

      {/* SEARCH */}

      <div className="script-search">

        <Search size={17} />

        <input
          type="text"
          placeholder="Search scripts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* SCRIPT LIST */}

      <div className="scripts-container">

        <div className="scripts-header">

          <div>

            <h2>
              My Content Library
            </h2>

            <p>
              Your ideas and scripts in one
              place.
            </p>

          </div>

        </div>

        {filteredScripts.length === 0 ? (

          <div className="empty-scripts">

            <FileText size={48} />

            <h3>
              No scripts yet
            </h3>

            <p>
              Start writing your first
              script above.
            </p>

          </div>

        ) : (

          <div className="script-list">

            {filteredScripts.map((script) => (

              <div
                className="script-card"
                key={script.id}
              >

                {/* HEADER */}

                <div className="script-card-header">

                  <div className="script-title">

                    <div className="script-icon">
                      <FileText size={18} />
                    </div>

                    <div>

                      <h3>
                        {script.title}
                      </h3>

                      <span>
                        {script.type}
                      </span>

                    </div>

                  </div>

                  <div className="script-actions">

                    {editingId === script.id ? (

                      <button
                        type="button"
                        className="save-btn"
                        onClick={() =>
                          saveEditing(
                            script.id
                          )
                        }
                      >

                        <Check size={16} />

                      </button>

                    ) : (

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          startEditing(script)
                        }
                      >

                        <Edit3 size={16} />

                      </button>

                    )}

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        deleteScript(
                          script.id
                        )
                      }
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

                {/* CONTENT */}

                {editingId === script.id ? (

                  <textarea
                    className="script-edit-area"
                    value={editingContent}
                    onChange={(e) =>
                      setEditingContent(
                        e.target.value
                      )
                    }
                  />

                ) : (

                  <div className="script-content">

                    {script.content ? (
                      <p>
                        {script.content}
                      </p>
                    ) : (
                      <p className="empty-content">
                        No content added yet.
                      </p>
                    )}

                  </div>

                )}

                {/* META */}

                <div className="script-meta">

                  <span>
                    Created{" "}
                    {new Date(
                      script.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <span>
                    {script.content
                      ? script.content.length
                      : 0}{" "}
                    characters
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Scripts;