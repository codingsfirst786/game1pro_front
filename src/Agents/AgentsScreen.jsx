import React, { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiSearch, FiChevronDown, FiCopy, FiCheck } from "react-icons/fi";
import "../Css/agents.css";
import Navbar from "../components/Navbar";

const AgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setErr("");
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/agents", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const json = await res.json();
        if (res.ok) {
          const agentUsers = (json.agents || []).filter(
            (user) => user.role === "agent"
          );
          setAgents(agentUsers);
        } else {
          setErr(json.message || "Failed to fetch agents.");
        }
      } catch (e) {
        setErr("Network error. Please try again.");
        // console.error("Error fetching agents:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...agents];

    if (q) {
      list = list.filter((a) => {
        const name = (a.username || "").toLowerCase();
        const id = (a._id || "").toLowerCase();
        const wa = (a.whatsappNumber || "").toLowerCase();
        return name.includes(q) || id.includes(q) || wa.includes(q);
      });
    }

    switch (sortBy) {
      case "name_asc":
        list.sort((a, b) => (a.username || "").localeCompare(b.username || ""));
        break;
      case "name_desc":
        list
          .sort((a, b) => (a.username || "").localeCompare(b.username || ""))
          .reverse();
        break;
      case "recent": // if you later attach createdAt, you can refine this
        list.reverse();
        break;
      default:
        break;
    }

    return list;
  }, [agents, query, sortBy]);

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // ignore
    }
  };

  const safeWaLink = (num) => {
    const clean = (num || "").replace(/[^\d+]/g, "");
    return clean ? `https://wa.me/${clean}` : null;
  };

  return (
    <>
      <div className="agents-wrapper fancy-bg">
        <div className="agents-container glass">
          <header className="agents-header">
            <h2 className="agents-heading">
              Talk with Agents to Get Points 🎮
            </h2>
            <p className="agents-subheading">
              Verified agents are here to help you trade points and play games.
            </p>

            <div className="agents-toolbar">
              <div className="searchbar">
                <FiSearch className="search-icon" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, ID, or WhatsApp…"
                  aria-label="Search agents"
                />
              </div>

              <div className="sorter">
                <FiChevronDown className="sort-caret" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort agents"
                >
                  <option value="name_asc">Name A–Z</option>
                  <option value="name_desc">Name Z–A</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </header>

          {err && <div className="alert error">{err}</div>}

          {loading ? (
            <div className="skeleton-list">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="agent-card skeleton">
                  <div className="agent-info">
                    <div className="avatar-skel shimmer" />
                    <div className="meta-skel">
                      <div className="line-skel shimmer" />
                      <div className="line-skel short shimmer" />
                    </div>
                    <div className="btn-skel shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <img
                src="https://assets-v2.frontify.com/s3/frontify-enterprise-files-us/instances/aiux/files/3e6ac2a4-a31a-4d5f-8d68-9d845f69c6dc/empty.svg"
                alt=""
                aria-hidden
              />
              <h3>No agents found</h3>
              <p>Try a different search or check back later.</p>
            </div>
          ) : (
            filtered.map((agent, idx) => {
              const wa = safeWaLink(agent.whatsappNumber);
              return (
                <div key={agent._id} className="agent-card">
                  <div className="agent-info">
                    <img
                      src={`https://i.pravatar.cc/100?u=${agent._id}`}
                      alt={agent.username}
                      className="agent-avatar"
                      loading="lazy"
                    />

                    <div className="agent-details">
                      <div className="name-row">
                        <h3 className="agent-name">
                          {agent.username || "Unnamed Agent"}
                        </h3>
                        <span className="verified-badge" title="Verified Agent">
                          ✅ Verified
                        </span>
                      </div>

                      <div className="id-row">
                        <span className="agent-id">ID: {agent._id}</span>
                        <button
                          className="copy-id"
                          onClick={() => copyId(agent._id)}
                          aria-label="Copy Agent ID"
                          title="Copy ID"
                        >
                          {copiedId === agent._id ? (
                            <FiCheck className="copy-icon" />
                          ) : (
                            <FiCopy className="copy-icon" />
                          )}
                        </button>
                      </div>

                      {agent.countries?.length ? (
                        <div className="agent-countries">
                          {agent.countries.map((c) => (
                            <span key={c} className="country-badge">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="agent-whatsapp">
                      {agent.whatsappNumber ? (
                        <a
                          href={`https://wa.me/${agent.whatsappNumber.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-link ripple"
                        >
                          <FaWhatsapp className="chat-icon" />
                        </a>
                      ) : (
                        <button
                          className="chat-link disabled"
                          title="No WhatsApp number"
                          disabled
                        >
                          <FaWhatsapp className="chat-icon" />
                        </button>
                      )}
                    </div>
                  </div>

                  {idx !== filtered.length - 1 && (
                    <hr className="agent-divider" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AgentsScreen;
