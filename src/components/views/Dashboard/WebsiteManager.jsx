import React, { useState } from 'react';
import { ArrowLeft, Edit3, Plus, Globe, Palette } from 'lucide-react';
import WebsiteSelectionModal from './WebsiteSelectionModal';
import './WebsiteManager.css';

const WebsiteManager = ({ onBack, onSwitchToEditor }) => {
  const [showCreationModal, setShowCreationModal] = useState(false);

  const handleCreateWebsite = () => {
    setShowCreationModal(true);
  };

  const handleEditWebsite = () => {
    // Ir directamente al editor sin plantilla (sitio existente)
    onSwitchToEditor('edit', null);
  };

  const handleWebsiteSelection = (type, template) => {
    console.log('Selección desde WebsiteManager:', type, template);
    if (onSwitchToEditor) {
      onSwitchToEditor(type, template);
    }
    setShowCreationModal(false);
  };

  return (
    <div className="website-manager">
      {/* Header */}
      <div className="website-manager-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="header-title">
          <Globe size={24} />
          <h1>Gestionar Sitio Web</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="website-manager-content">
        <div className="manager-section">
          <h2>¿Qué te gustaría hacer?</h2>
          <p>Administra tu sitio web existente o crea uno completamente nuevo</p>

          <div className="action-cards">
            {/* Editar Sitio Existente */}
            <div className="action-card" onClick={handleEditWebsite}>
              <div className="card-icon edit-icon">
                <Edit3 size={32} />
              </div>
              <div className="card-content">
                <h3>Editar Sitio Actual</h3>
                <p>Continúa trabajando en tu sitio web existente "My Site 1"</p>
                <div className="card-features">
                  <span>• Modificar contenido</span>
                  <span>• Actualizar diseño</span>
                  <span>• Agregar nuevas secciones</span>
                </div>
              </div>
              <div className="card-action">
                <span>Editar Ahora</span>
                <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>

            {/* Crear Nuevo Sitio */}
            <div className="action-card" onClick={handleCreateWebsite}>
              <div className="card-icon create-icon">
                <Plus size={32} />
              </div>
              <div className="card-content">
                <h3>Crear Nuevo Sitio</h3>
                <p>Empieza desde cero con una nueva creación</p>
                <div className="card-features">
                  <span>• Plantillas profesionales</span>
                  <span>• Diseño desde cero</span>
                  <span>• Múltiples categorías</span>
                </div>
              </div>
              <div className="card-action">
                <span>Crear Sitio</span>
                <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card">
            <Palette size={24} />
            <div className="info-content">
              <h4>Editor Profesional</h4>
              <p>Accede a nuestro editor drag & drop con herramientas profesionales para crear sitios web impresionantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Website Creation Modal */}
      <WebsiteSelectionModal 
        isOpen={showCreationModal}
        onClose={() => setShowCreationModal(false)}
        onSelectOption={handleWebsiteSelection}
      />
    </div>
  );
};

export default WebsiteManager; 