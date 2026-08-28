import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  Send,
  MessageCircle,
  Trophy,
  Search,
  Filter,
  Pencil,
  X,
  CalendarDays,
  DollarSign,
} from "lucide-react";

import { useState } from "react";
import { useLife } from "../context/LifeContext";

function Clients() {
  const {
    clients = [],
    addClient,
    updateClient,
    deleteClient,
  } = useLife();

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const emptyForm = {
    name: "",
    platform: "LinkedIn",
    service: "Web Development",
    status: "Lead",
    amount: "",
    date: "",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);

  // ================================
  // STATS
  // ================================

  const leads = clients.filter(
    (client) => client.status === "Lead"
  ).length;

  const contacted = clients.filter(
    (client) => client.status === "Contacted"
  ).length;

  const replies = clients.filter(
    (client) =>
      client.status === "Replied" ||
      client.status === "Meeting" ||
      client.status === "Proposal"
  ).length;

  const won = clients.filter(
    (client) => client.status === "Won"
  ).length;

  const revenue = clients
    .filter((client) => client.status === "Won")
    .reduce(
      (total, client) =>
        total + Number(client.amount || 0),
      0
    );

  const expectedRevenue = clients
    .filter(
      (client) =>
        client.status !== "Lost" &&
        client.status !== "Won"
    )
    .reduce(
      (total, client) =>
        total + Number(client.amount || 0),
      0
    );

  // ================================
  // FORM
  // ================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (editingClient) {
      updateClient(editingClient.id, form);
    } else {
      addClient(form);
    }

    setForm(emptyForm);
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);

    setForm({
      name: client.name || "",
      platform: client.platform || "LinkedIn",
      service: client.service || "Web Development",
      status: client.status || "Lead",
      amount: client.amount || "",
      date: client.date || "",
      notes: client.notes || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setForm(emptyForm);
  };

  // ================================
  // FILTER
  // ================================

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      client.service
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      client.platform
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      client.status === statusFilter;

    const matchesPlatform =
      platformFilter === "All" ||
      client.platform === platformFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPlatform
    );
  });

  return (
    <main className="clients-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            CAREER OS
          </p>

          <h1>
            Client Pipeline
          </h1>

          <p className="subtitle">
            Turn outreach into real opportunities.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingClient(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Client
        </button>

      </div>


      {/* =================================
          STATS
      ================================= */}

      <div className="client-stats">

        <div className="client-stat-card">
          <div className="client-stat-icon">
            <Users size={21} />
          </div>

          <span>
            Leads
          </span>

          <strong>
            {leads}
          </strong>
        </div>


        <div className="client-stat-card">
          <div className="client-stat-icon">
            <Send size={21} />
          </div>

          <span>
            Contacted
          </span>

          <strong>
            {contacted}
          </strong>
        </div>


        <div className="client-stat-card">
          <div className="client-stat-icon">
            <MessageCircle size={21} />
          </div>

          <span>
            Replies
          </span>

          <strong>
            {replies}
          </strong>
        </div>


        <div className="client-stat-card">
          <div className="client-stat-icon">
            <Trophy size={21} />
          </div>

          <span>
            Won
          </span>

          <strong>
            {won}
          </strong>
        </div>


        <div className="client-stat-card">
          <div className="client-stat-icon">
            <DollarSign size={21} />
          </div>

          <span>
            Won Revenue
          </span>

          <strong>
            ${revenue.toLocaleString()}
          </strong>
        </div>

      </div>


      {/* =================================
          PIPELINE SUMMARY
      ================================= */}

      <div className="pipeline-summary">

        <div>
          <span>
            Total Opportunities
          </span>

          <strong>
            {clients.length}
          </strong>
        </div>

        <div>
          <span>
            Expected Revenue
          </span>

          <strong>
            ${expectedRevenue.toLocaleString()}
          </strong>
        </div>

        <div>
          <span>
            Conversion Rate
          </span>

          <strong>
            {clients.length
              ? Math.round(
                  (won / clients.length) * 100
                )
              : 0}
            %
          </strong>
        </div>

      </div>


      {/* =================================
          SEARCH + FILTER
      ================================= */}

      <div className="clients-toolbar">

        <div className="client-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search clients, services..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="client-filter">

          <Filter size={17} />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option>Lead</option>
            <option>Contacted</option>
            <option>Replied</option>
            <option>Meeting</option>
            <option>Proposal</option>
            <option>Won</option>
            <option>Lost</option>
          </select>

        </div>


        <div className="client-filter">

          <select
            value={platformFilter}
            onChange={(e) =>
              setPlatformFilter(e.target.value)
            }
          >
            <option value="All">
              All Platforms
            </option>

            <option>LinkedIn</option>
            <option>Fiverr</option>
            <option>Upwork</option>
            <option>Email</option>
            <option>Instagram</option>
            <option>Other</option>
          </select>

        </div>

      </div>


      {/* =================================
          ADD / EDIT FORM
      ================================= */}

      {showForm && (

        <form
          className="client-form"
          onSubmit={handleSubmit}
        >

          <div className="client-form-header">

            <div>
              <p className="eyebrow">
                CLIENT MANAGEMENT
              </p>

              <h2>
                {editingClient
                  ? "Edit Client"
                  : "Add New Client"}
              </h2>
            </div>

            <button
              type="button"
              className="close-form-btn"
              onClick={closeForm}
            >
              <X size={20} />
            </button>

          </div>


          <div className="client-form-grid">

            <div className="form-group">

              <label>
                Client Name
              </label>

              <input
                type="text"
                placeholder="e.g. Sarah Ahmed"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Platform
              </label>

              <select
                value={form.platform}
                onChange={(e) =>
                  setForm({
                    ...form,
                    platform: e.target.value,
                  })
                }
              >
                <option>LinkedIn</option>
                <option>Fiverr</option>
                <option>Upwork</option>
                <option>Email</option>
                <option>Instagram</option>
                <option>Other</option>
              </select>

            </div>


            <div className="form-group">

              <label>
                Service
              </label>

              <select
                value={form.service}
                onChange={(e) =>
                  setForm({
                    ...form,
                    service: e.target.value,
                  })
                }
              >
                <option>
                  Web Development
                </option>

                <option>
                  Frontend Development
                </option>

                <option>
                  Backend Development
                </option>

                <option>
                  UI/UX Design
                </option>

                <option>
                  Graphic Design
                </option>

                <option>
                  Digital Marketing
                </option>
              </select>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option>Lead</option>
                <option>Contacted</option>
                <option>Replied</option>
                <option>Meeting</option>
                <option>Proposal</option>
                <option>Won</option>
                <option>Lost</option>
              </select>

            </div>


            <div className="form-group">

              <label>
                Expected Amount
              </label>

              <input
                type="number"
                placeholder="500"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
              />

            </div>


            <div className="form-group">

              <label>
                Follow-up Date
              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Notes
            </label>

            <textarea
              placeholder="Write client details, requirements or follow-up notes..."
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              {editingClient
                ? "Update Client"
                : "Save Client"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={closeForm}
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* =================================
          CLIENT PIPELINE
      ================================= */}

      <section className="clients-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              PIPELINE
            </p>

            <h2>
              My Opportunities
            </h2>

            <p>
              Track every opportunity from lead
              to paying client.
            </p>
          </div>

          <span className="results-count">
            {filteredClients.length} results
          </span>

        </div>


        {filteredClients.length === 0 ? (

          <div className="empty-state">

            <Briefcase size={42} />

            <h3>
              No clients found
            </h3>

            <p>
              Add a client or change your filters.
            </p>

          </div>

        ) : (

          <div className="clients-list">

            {filteredClients.map((client) => (

              <div
                className="client-card"
                key={client.id}
              >

                <div className="client-main">

                  <div className="client-avatar">
                    {client.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>


                  <div className="client-info">

                    <h3>
                      {client.name}
                    </h3>

                    <p>
                      {client.service}
                    </p>

                    <div className="client-meta">

                      <span>
                        {client.platform}
                      </span>

                      {client.date && (
                        <span>
                          <CalendarDays size={13} />
                          {client.date}
                        </span>
                      )}

                    </div>

                    {client.notes && (
                      <small>
                        {client.notes}
                      </small>
                    )}

                  </div>

                </div>


                <div className="client-actions">

                  <span
                    className={`client-status ${client.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {client.status}
                  </span>


                  {client.amount > 0 && (

                    <strong className="client-amount">
                      ${Number(
                        client.amount
                      ).toLocaleString()}
                    </strong>

                  )}


                  <button
                    className="icon-action edit"
                    onClick={() =>
                      handleEdit(client)
                    }
                    title="Edit client"
                  >
                    <Pencil size={16} />
                  </button>


                  <button
                    className="icon-action delete"
                    onClick={() =>
                      deleteClient(client.id)
                    }
                    title="Delete client"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Clients;