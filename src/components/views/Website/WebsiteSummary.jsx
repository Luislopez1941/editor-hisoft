import React, { useState } from 'react';
import { Settings, Info, ExternalLink, Edit3, Plus, Home, DollarSign, Package, Puzzle, Smartphone, Inbox, Users, Megaphone, FolderOpen } from 'lucide-react';
import WebsiteSelectionModal from './WebsiteSelectionModal';
import '../Dashboard/Dashboard.css';

const WebsiteSummary = ({ onSwitchToEditor }) => {
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editorData, setEditorData] = useState(null);

  const handleWebsiteSelection = (type, template) => {
    setSelectedTemplate(template);
    if (template && template.structure) {
      setEditorData(template.structure);
    } else {
      setEditorData(null);
    }
    setShowWebsiteModal(false);
    if (onSwitchToEditor) {
      onSwitchToEditor(type, template);
    }
  };

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24}}>
        <button className="create-site-btn" style={{display: 'inline-flex', background: '#3D85C6', color: 'white', fontWeight: 700, fontSize: 16, padding: '12px 24px', borderRadius: 8, alignItems: 'center', gap: 8, zIndex: 9999}} onClick={() => setShowWebsiteModal(true)}>
          <Plus size={20} />
          Crear nuevo sitio
        </button>
      </div>
      {/* Site Summary Section */}
      <div className="site-summary">
        <div className="site-preview">
          <div className="site-thumbnail">
            <img src="https://via.placeholder.com/120x80/87CEEB/ffffff?text=Site" alt="Site Preview" />
          </div>
          <div className="site-info">
            <div className="site-title">
              <h3>My Site 1</h3>
              <span className="status-badge">No publicado</span>
            </div>
            <div className="site-options">
              <div className="option">
                <span>Plan gratuito</span>
                <a href="#" className="link">Comparar planes</a>
              </div>
              <div className="option">
                <span>Sin dominio</span>
                <a href="#" className="link">Conectar</a>
              </div>
              <div className="option">
                <span>Sin email empresarial</span>
                <a href="#" className="link">Conectar</a>
              </div>
            </div>
          </div>
          <div className="site-settings">
            <Settings size={16} />
            <span>Ajustes del sitio</span>
          </div>
        </div>
      </div>
      {/* Performance Section */}
      <div className="performance-section">
        <div className="section-header">
          <h2>Rendimiento del sitio</h2>
          <p>
            Supervisa el rendimiento de tu sitio y garantiza una experiencia de usuario fluida para tus visitantes. 
            Para conocer la velocidad y el tiempo de actividad de tu sitio,
            <a href="#" className="link">publícalo en el Editor</a>.
          </p>
        </div>
        <div className="performance-cards">
          <div className="performance-card">
            <p>Una vez que tu sitio tenga suficiente tráfico, puedes comprobar su tiempo de carga y optimizarlo.</p>
            <a href="#" className="card-link">
              Leer más <ExternalLink size={16} />
            </a>
          </div>
          <div className="performance-card">
            <p>Supervisa la disponibilidad de tu sitio publicado y descubre cómo Wix permite la continuidad operativa en todo momento.</p>
            <a href="#" className="card-link">
              Leer más <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
      <WebsiteSelectionModal
        isOpen={showWebsiteModal}
        onClose={() => setShowWebsiteModal(false)}
        onSelectOption={handleWebsiteSelection}
      />
    </>
  );
};

export default WebsiteSummary;  