import { useRef, useState } from "react";
import { useLife } from "../context/LifeContext";

import {
  BookOpen,
  Upload,
  FileText,
  Plus,
  Check,
  Trash2,
  X,
  ExternalLink,
  Clock,
  Target,
  Layers,
} from "lucide-react";

function Study() {
  const {
    studyMaterials = [],
    addStudyMaterial,
    deleteStudyMaterial,
    addStudyTopic,
    deleteStudyTopic,
    toggleStudyTopic,
    getStudyProgress,
  } = useLife();

  const fileInputRef = useRef(null);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("University");

  const [description, setDescription] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [topicInput, setTopicInput] =
    useState("");

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);

    if (!title) {
      setTitle(
        file.name.replace(".pdf", "")
      );
    }
  };

  // ==========================================
  // CONVERT PDF TO BASE64
  // ==========================================

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result);

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  // ==========================================
  // ADD STUDY MATERIAL
  // ==========================================

  const handleAddStudy = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please upload a PDF first.");
      return;
    }

    try {
      const fileData =
        await fileToBase64(selectedFile);

      addStudyMaterial({
        title:
          title.trim() ||
          selectedFile.name,

        category,

        description:
          description.trim(),

        fileName:
          selectedFile.name,

        fileData,

        fileSize:
          selectedFile.size,

        topics: [],
      });

      setTitle("");
      setCategory("University");
      setDescription("");
      setSelectedFile(null);
      setShowAdd(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      alert(
        "Something went wrong while adding the PDF."
      );
    }
  };

  // ==========================================
  // ADD TOPIC
  // ==========================================

  const handleAddTopic = (materialId) => {
    if (!topicInput.trim()) return;

    addStudyTopic(
      materialId,
      topicInput
    );

    setTopicInput("");
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.round(
      bytes / 1024
    )} KB`;
  };

  // ==========================================
  // GET TOPIC STATS
  // ==========================================

  const getTopicStats = (material) => {
    const topics =
      material.topics || [];

    const completed =
      topics.filter(
        (topic) =>
          topic.completed
      ).length;

    return {
      completed,
      total: topics.length,
    };
  };

  // ==========================================
  // TOTAL STATS
  // ==========================================

  const totalTopics =
    studyMaterials.reduce(
      (total, material) =>
        total +
        (material.topics?.length || 0),
      0
    );

  const completedTopics =
    studyMaterials.reduce(
      (total, material) =>
        total +
        (material.topics || []).filter(
          (topic) =>
            topic.completed
        ).length,
      0
    );

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopics /
            totalTopics) *
            100
        )
      : 0;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="study-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="study-header">

        <div>
          <p className="eyebrow">
            STUDY SYSTEM
          </p>

          <h1>
            My Study
          </h1>

          <p className="subtitle">
            Upload your PDFs, break them into
            topics, and learn them one by one.
          </p>
        </div>

        <div className="study-header-icon">
          <BookOpen size={25} />
        </div>

      </div>

      {/* =====================================
          TOP STATS
      ===================================== */}

      <div className="study-stats">

        <div className="study-stat-card">

          <div className="study-stat-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>
              Study Materials
            </span>

            <strong>
              {studyMaterials.length}
            </strong>
          </div>

        </div>

        <div className="study-stat-card">

          <div className="study-stat-icon">
            <Layers size={21} />
          </div>

          <div>
            <span>
              Total Topics
            </span>

            <strong>
              {totalTopics}
            </strong>
          </div>

        </div>

        <div className="study-stat-card">

          <div className="study-stat-icon">
            <Check size={21} />
          </div>

          <div>
            <span>
              Topics Completed
            </span>

            <strong>
              {completedTopics}
            </strong>
          </div>

        </div>

        <div className="study-stat-card">

          <div className="study-stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>
              Overall Progress
            </span>

            <strong>
              {overallProgress}%
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          ADD BUTTON
      ===================================== */}

      <div className="study-actions">

        <div>
          <h2>
            Study Library
          </h2>

          <p>
            Keep all your learning material
            organized in one place.
          </p>
        </div>

        <button
          type="button"
          className="study-add-btn"
          onClick={() =>
            setShowAdd(true)
          }
        >
          <Plus size={18} />
          Add PDF
        </button>

      </div>

      {/* =====================================
          ADD PDF FORM
      ===================================== */}

      {showAdd && (
        <div className="study-form-card">

          <div className="study-form-header">

            <div>
              <p className="eyebrow">
                NEW MATERIAL
              </p>

              <h2>
                Add Study PDF
              </h2>
            </div>

            <button
              type="button"
              className="study-close-btn"
              onClick={() =>
                setShowAdd(false)
              }
            >
              <X size={19} />
            </button>

          </div>

          <form
            onSubmit={handleAddStudy}
          >

            {/* PDF UPLOAD */}

            <div className="pdf-upload-box">

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={
                  handleFileChange
                }
              />

              <Upload size={30} />

              <strong>
                {selectedFile
                  ? selectedFile.name
                  : "Upload your PDF"}
              </strong>

              <span>
                Click here or choose a PDF
                file from your computer
              </span>

              {selectedFile && (
                <small>
                  {formatFileSize(
                    selectedFile.size
                  )}
                </small>
              )}

            </div>

            {/* TITLE */}

            <div className="study-form-grid">

              <div className="study-input-group">

                <label>
                  Material Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Data Structures Notes"
                />

              </div>

              {/* CATEGORY */}

              <div className="study-input-group">

                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                >
                  <option>
                    University
                  </option>

                  <option>
                    DSA
                  </option>

                  <option>
                    Python
                  </option>

                  <option>
                    Machine Learning
                  </option>

                  <option>
                    Web Development
                  </option>

                  <option>
                    Trading
                  </option>

                  <option>
                    Career
                  </option>

                  <option>
                    Personal
                  </option>
                </select>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="study-input-group">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="What is this PDF about?"
                rows="4"
              />

            </div>

            {/* FORM ACTIONS */}

            <div className="study-form-actions">

              <button
                type="button"
                className="study-cancel-btn"
                onClick={() =>
                  setShowAdd(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="study-save-btn"
              >
                <Upload size={17} />
                Add PDF
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {studyMaterials.length === 0 ? (

        <div className="study-empty">

          <div className="study-empty-icon">
            <BookOpen size={40} />
          </div>

          <h2>
            Your study library is empty
          </h2>

          <p>
            Upload your first PDF and turn
            it into a study plan.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowAdd(true)
            }
          >
            <Plus size={17} />
            Add Your First PDF
          </button>

        </div>

      ) : (

        /* ===================================
           MATERIAL GRID
        =================================== */

        <div className="study-grid">

          {studyMaterials.map(
            (material) => {

              const progress =
                getStudyProgress(
                  material
                );

              const {
                completed,
                total,
              } =
                getTopicStats(
                  material
                );

              const isSelected =
                selectedMaterial?.id ===
                material.id;

              return (

                <div
                  className={`study-card ${
                    isSelected
                      ? "study-card-open"
                      : ""
                  }`}
                  key={material.id}
                >

                  {/* CARD TOP */}

                  <div className="study-card-top">

                    <div className="study-pdf-icon">
                      <FileText
                        size={23}
                      />
                    </div>

                    <div className="study-card-title">

                      <h3>
                        {material.title}
                      </h3>

                      <span>
                        {material.fileName}
                      </span>

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="study-meta">

                    <span className="study-category">
                      {material.category}
                    </span>

                    <span>
                      {formatFileSize(
                        material.fileSize
                      )}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  {material.description && (
                    <p className="study-description">
                      {material.description}
                    </p>
                  )}

                  {/* PROGRESS */}

                  <div className="study-progress">

                    <div className="study-progress-top">

                      <span>
                        Progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>

                    </div>

                    <div className="study-progress-bar">

                      <div
                        className="study-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* TOPIC STATS */}

                  <div className="study-card-stats">

                    <div>
                      <strong>
                        {completed}/{total}
                      </strong>

                      <span>
                        Topics
                      </span>
                    </div>

                    <div>
                      <strong>
                        {progress}%
                      </strong>

                      <span>
                        Complete
                      </span>
                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="study-card-actions">

                    {material.fileData && (
                      <a
                        href={
                          material.fileData
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="study-read-btn"
                      >
                        <ExternalLink
                          size={16}
                        />
                        Read PDF
                      </a>
                    )}

                    <button
                      type="button"
                      className="study-topics-btn"
                      onClick={() =>
                        setSelectedMaterial(
                          isSelected
                            ? null
                            : material
                        )
                      }
                    >
                      {isSelected
                        ? "Close Topics"
                        : "Study Topics"}
                    </button>

                  </div>

                  {/* TOPICS PANEL */}

                  {isSelected && (

                    <div className="study-topics-panel">

                      <div className="study-topics-header">

                        <div>
                          <strong>
                            {material.title}
                          </strong>

                          <span>
                            Tick topics as
                            you complete them.
                          </span>
                        </div>

                        <span>
                          {completed}/{total}
                        </span>

                      </div>

                      {/* ADD TOPIC */}

                      <div className="add-topic-row">

                        <input
                          type="text"
                          value={
                            topicInput
                          }
                          onChange={(e) =>
                            setTopicInput(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key ===
                              "Enter"
                            ) {
                              e.preventDefault();

                              handleAddTopic(
                                material.id
                              );
                            }
                          }}
                          placeholder="Write a topic..."
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleAddTopic(
                              material.id
                            )
                          }
                        >
                          <Plus size={17} />
                        </button>

                      </div>

                      {/* TOPIC LIST */}

                      <div className="study-topic-list">

                        {(
                          material.topics ||
                          []
                        ).length === 0 ? (

                          <div className="no-topics">

                            <BookOpen
                              size={22}
                            />

                            <span>
                              No topics yet.
                              Add your first
                              topic above.
                            </span>

                          </div>

                        ) : (

                          (
                            material.topics ||
                            []
                          ).map(
                            (topic) => (

                              <div
                                className={`study-topic ${
                                  topic.completed
                                    ? "completed"
                                    : ""
                                }`}
                                key={
                                  topic.id ||
                                  topic.name
                                }
                              >

                                <button
                                  type="button"
                                  className={`study-topic-check ${
                                    topic.completed
                                      ? "checked"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleStudyTopic(
                                      material.id,
                                      topic.id
                                    )
                                  }
                                >
                                  {topic.completed && (
                                    <Check
                                      size={14}
                                    />
                                  )}
                                </button>

                                <span>
                                  {topic.name}
                                </span>

                                <button
                                  type="button"
                                  className="delete-topic-btn"
                                  onClick={() =>
                                    deleteStudyTopic(
                                      material.id,
                                      topic.id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>

                              </div>

                            )
                          )

                        )}

                      </div>

                    </div>

                  )}

                  {/* DELETE */}

                  <button
                    type="button"
                    className="study-delete-btn"
                    onClick={() => {
                      const confirmed =
                        window.confirm(
                          "Delete this study material?"
                        );

                      if (confirmed) {
                        deleteStudyMaterial(
                          material.id
                        );

                        if (
                          selectedMaterial?.id ===
                          material.id
                        ) {
                          setSelectedMaterial(
                            null
                          );
                        }
                      }
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              );
            }
          )}

        </div>

      )}

      {/* =====================================
          BOTTOM FOCUS
      ===================================== */}

      <div className="study-focus">

        <div className="study-focus-icon">
          ✦
        </div>

        <div>

          <p className="eyebrow">
            TODAY'S STUDY RULE
          </p>

          <h2>
            Don't just read.
            <br />
            Understand. Practice. Remember.
          </h2>

          <p>
            Open one PDF, choose a few topics,
            study them deeply, and tick them
            off when you truly understand them.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Study;