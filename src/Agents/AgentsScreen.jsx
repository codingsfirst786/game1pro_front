import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../Css/agents.css";
import Navbar from "../components/Navbar";

const AgentsScreen = () => {
  const agents = [
    {
      id: "AG101",
      name: "John Doe",
      image: "https://i.pravatar.cc/100?img=1",
      countries: ["🇺🇸", "🇬🇧", "🇨🇦"],
      whatsapp: "1234567890",
    },
    {
      id: "AG102",
      name: "Ayesha Noor",
      image: "https://i.pravatar.cc/100?img=2",
      countries: ["🇵🇰", "🇮🇳", "🇦🇪"],
      whatsapp: "923001112233",
    },
    {
      id: "AG103",
      name: "David Smith",
      image: "https://i.pravatar.cc/100?img=3",
      countries: ["🇩🇪", "🇫🇷", "🇮🇹"],
      whatsapp: "447700900123",
    },
  ];

  return (
    <>
     <div className="agents-wrapper">
      <div className="agents-container">
        <h2 className="agents-heading">Talk with Agents to Get Points 🎮</h2>
        <p className="agents-subheading">
          Verified agents are here to help you trade points and play games.
        </p>

        {agents.map((agent, idx) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-info">
              <img src={agent.image} alt={agent.name} className="agent-avatar" />

              <div className="agent-details">
                <h3 className="agent-name">{agent.name}</h3>
                <p className="agent-id">ID: {agent.id}</p>
                <span className="verified-badge">✅ Verified Agent</span>
                <div className="agent-countries">
                  {agent.countries.map((flag, i) => (
                    <span key={i} className="flag">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
              {/* WhatsApp Icon on right side */}
              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-icon"
              >
                <FaWhatsapp />
              </a>
            </div>

            {idx !== agents.length - 1 && <hr className="agent-divider" />}
          </div>
        ))}
      </div>
    </div>
     </>
  );
};

export default AgentsScreen;
