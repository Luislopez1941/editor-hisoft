import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3 } from 'lucide-react';
import WebsiteSelectionModal from '../Dashboard/WebsiteSelectionModal';
import './Website.css';

const Website = ({ onBack, onSwitchToEditor }) => {
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);

  const handleCreateNewWebsite = () => {
    setShowWebsiteModal(true);
  };

  const handleEditWebsite = () => {
    if (onSwitchToEditor) {
      onSwitchToEditor('edit', null);
    }
  };

  const handleWebsiteSelection = (type, template) => {
    console.log('Selección desde Website:', type, template);
    if (onSwitchToEditor) {
      onSwitchToEditor(type, template);
    }
    setShowWebsiteModal(false);
  };

  return (
    <div className="website-view">
      {/* Header */}
      <div className="website-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="title-section">
            <h1>Resumen del sitio web</h1>
            <p>Administra tu sitio web, el SEO, tus dominios y más.</p>
          </div>
        </div>
        <div className="header-right">
          <button className="create-site-btn" onClick={handleCreateNewWebsite}>
            <Plus size={16} />
            Crear nuevo sitio web
          </button>
          <button className="edit-site-btn" onClick={handleEditWebsite}>
            <Edit3 size={16} />
            Editar sitio web
          </button>
        </div>
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
            <Edit3 size={16} />
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
            <div className="card-header">
              <h3>Supervisa la velocidad de tu sitio</h3>
            </div>
            <p>Una vez que tu sitio tenga suficiente tráfico, podrás comprobar su tiempo de carga y optimizarlo.</p>
            <a href="#" className="card-link">Leer más</a>
          </div>

          <div className="performance-card">
            <div className="card-header">
              <h3>Monitorea el tiempo de actividad de tu sitio</h3>
            </div>
            <p>Supervisa la disponibilidad de tu sitio publicado y descubre cómo Wix permite la continuidad operativa en todo momento.</p>
            <a href="#" className="card-link">Leer más</a>
          </div>
        </div>
      </div>

      {/* Website Selection Modal */}
      <WebsiteSelectionModal 
        isOpen={showWebsiteModal}
        onClose={() => setShowWebsiteModal(false)}
        onSelectOption={handleWebsiteSelection}
      />
    </div>
  );
};

export default Website; 