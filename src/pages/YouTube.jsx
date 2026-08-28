import { useState } from "react";

import {
  Plus,
  Trash2,
  Lightbulb,
  Film,
  Scissors,
  CheckCircle,
  Eye,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

function YouTube() {
  const {
    youtubeVideos = [],
    addYoutubeVideo,
    updateYoutubeStatus,
    updateYoutubeViews,
    deleteYoutubeVideo,
  } = useLife();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vlog");
  const [status, setStatus] = useState("Idea");
  const [publishDate, setPublishDate] = useState("");

  // ================================
  // ADD VIDEO
  // ================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    addYoutubeVideo({
      title: title.trim(),
      category,
      status,
      publishDate,
    });

    setTitle("");
    setCategory("Vlog");
    setStatus("Idea");
    setPublishDate("");
  };

  // ================================
  // STATUS ICONS
  // ================================

  const statusIcons = {
    Idea: Lightbulb,
    "To Film": Film,
    Editing: Scissors,
    Published: CheckCircle,
  };

  // ================================
  // STATUS CLASS
  // ================================

  const statusClass = (value) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };

  // ================================
  // STATS
  // ================================

  const ideas = youtubeVideos.filter(
    (video) => video.status === "Idea"
  ).length;

  const filming = youtubeVideos.filter(
    (video) => video.status === "To Film"
  ).length;

  const editing = youtubeVideos.filter(
    (video) => video.status === "Editing"
  ).length;

  const published = youtubeVideos.filter(
    (video) => video.status === "Published"
  ).length;

  // ================================
  // UI
  // ================================

  return (
    <main className="youtube-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            CONTENT SYSTEM
          </p>

          <h1>
            YouTube Studio
          </h1>

          <p className="subtitle">
            Turn ideas into published videos.
          </p>
        </div>

        <div className="youtube-summary">

          <div className="youtube-logo">
            ▶
          </div>

          <div>
            <strong>
              {youtubeVideos.length}
            </strong>

            <span>
              Total videos
            </span>
          </div>

        </div>

      </div>


      {/* STATS */}

      <div className="youtube-stats">

        <div className="youtube-stat">
          <Lightbulb size={20} />

          <strong>
            {ideas}
          </strong>

          <span>
            Ideas
          </span>
        </div>


        <div className="youtube-stat">
          <Film size={20} />

          <strong>
            {filming}
          </strong>

          <span>
            To Film
          </span>
        </div>


        <div className="youtube-stat">
          <Scissors size={20} />

          <strong>
            {editing}
          </strong>

          <span>
            Editing
          </span>
        </div>


        <div className="youtube-stat">
          <CheckCircle size={20} />

          <strong>
            {published}
          </strong>

          <span>
            Published
          </span>
        </div>

      </div>


      {/* ADD VIDEO FORM */}

      <form
        className="youtube-form"
        onSubmit={handleSubmit}
      >

        <div className="input-group">

          <label>
            Video Title
          </label>

          <input
            type="text"
            placeholder="e.g. A Day in My Life as a Developer"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </div>


        <div className="input-group">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="Vlog">
              Vlog
            </option>

            <option value="Study">
              Study
            </option>

            <option value="Coding">
              Coding
            </option>

            <option value="Freelancing">
              Freelancing
            </option>

            <option value="Business">
              Business
            </option>

            <option value="Self Improvement">
              Self Improvement
            </option>

            <option value="Shorts">
              Shorts
            </option>
          </select>

        </div>


        <div className="input-group">

          <label>
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="Idea">
              Idea
            </option>

            <option value="To Film">
              To Film
            </option>

            <option value="Editing">
              Editing
            </option>

            <option value="Published">
              Published
            </option>
          </select>

        </div>


        <div className="input-group">

          <label>
            Publish Date
          </label>

          <input
            type="date"
            value={publishDate}
            onChange={(e) =>
              setPublishDate(e.target.value)
            }
          />

        </div>


        <button
          type="submit"
          className="add-task-btn"
        >
          <Plus size={18} />

          Add Video
        </button>

      </form>


      {/* CONTENT PIPELINE */}

      <div className="youtube-container">

        <div className="youtube-header">

          <div>

            <h2>
              Content Pipeline
            </h2>

            <p>
              Manage every video from idea
              to publication.
            </p>

          </div>

        </div>


        {/* EMPTY STATE */}

        {youtubeVideos.length === 0 ? (

          <div className="empty-youtube">

            <div className="youtube-empty-icon">
              ▶
            </div>

            <h3>
              No videos yet
            </h3>

            <p>
              Add your first YouTube idea
              above.
            </p>

          </div>

        ) : (

          /* VIDEO LIST */

          <div className="youtube-list">

            {youtubeVideos.map((video) => {

              const Icon =
                statusIcons[video.status] ||
                Lightbulb;

              return (

                <div
                  className="youtube-card"
                  key={video.id}
                >

                  {/* VIDEO INFO */}

                  <div className="youtube-video-info">

                    <div className="youtube-icon">
                      <Icon size={19} />
                    </div>

                    <div>

                      <h3>
                        {video.title}
                      </h3>

                      <span>
                        {video.category}
                      </span>

                    </div>

                  </div>


                  {/* STATUS */}

                  <select
                    className={`youtube-status ${statusClass(
                      video.status
                    )}`}
                    value={video.status}
                    onChange={(e) =>
                      updateYoutubeStatus(
                        video.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Idea">
                      Idea
                    </option>

                    <option value="To Film">
                      To Film
                    </option>

                    <option value="Editing">
                      Editing
                    </option>

                    <option value="Published">
                      Published
                    </option>

                  </select>


                  {/* DATE */}

                  <div className="youtube-date">

                    {video.publishDate
                      ? video.publishDate
                      : "No date"}

                  </div>


                  {/* VIEWS */}

                  {video.status === "Published" && (

                    <div className="youtube-views">

                      <Eye size={15} />

                      <input
                        type="number"
                        min="0"
                        value={video.views ?? 0}
                        onChange={(e) =>
                          updateYoutubeViews(
                            video.id,
                            e.target.value
                          )
                        }
                      />

                    </div>

                  )}


                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteYoutubeVideo(
                        video.id
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </main>
  );
}

export default YouTube;