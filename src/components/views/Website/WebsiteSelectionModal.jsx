import React, { useState } from 'react';
import { X, Palette, Layers, ArrowRight } from 'lucide-react';
import './WebsiteSelectionModal.css';
import { templates as templatesData } from '../../../data/templates';

const WebsiteSelectionModal = ({ isOpen, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const templates = [
    {
      id: 'business',
      name: 'Negocio Profesional',
      description: 'Perfecto para empresas y servicios profesionales',
      image: 'https://via.placeholder.com/300x200/1e334d/ffffff?text=Negocio',
      category: 'business'
    },
    {
      id: 'blog',
      name: 'Blog Personal',
      description: 'Ideal para blogs, noticias y contenido editorial',
      image: 'https://via.placeholder.com/300x200/3D85C6/ffffff?text=Blog',
      category: 'blog'
    },
    {
      id: 'ecommerce',
      name: 'Tienda Online',
      description: 'Diseño optimizado para comercio electrónico',
      image: 'https://via.placeholder.com/300x200/2c5aa0/ffffff?text=Tienda',
      category: 'ecommerce'
    }
  ];

  const handleContinue = () => {
    if (selectedOption === 'scratch') {
      onSelectOption('scratch', null);
    } else if (selectedOption) {
      const template = templates.find(t => t.id === selectedOption);
      // Buscar la estructura real en templates.js
      const fullTemplate = templatesData[selectedOption];
      onSelectOption('template', {
        ...template,
        structure: fullTemplate ? fullTemplate.elements : null
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="website-modal">
        <div className="modal-header">
          <h2>¿Cómo te gustaría diseñar tu sitio web?</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="design-options">
            <div 
              className={`design-option ${selectedOption === 'scratch' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('scratch')}
            >
              <div className="option-icon">
                <Palette size={40} />
              </div>
              <h3>Empezar desde cero</h3>
              <p>Crea tu diseño único con total libertad creativa usando nuestro editor drag & drop</p>
              <div className="option-preview">
                <div className="blank-canvas">
                  <span>Canvas en blanco</span>
                </div>
              </div>
            </div>

            <div className="divider">
              <span>o</span>
            </div>

            <div 
              className={`design-option templates-option ${selectedOption && selectedOption !== 'scratch' ? 'selected' : ''}`}
            >
              <div className="option-icon">
                <Layers size={40} />
              </div>
              <h3>Usar plantillas</h3>
              <p>Comienza con una plantilla profesional y personalízala a tu gusto</p>
              
              <div className="templates-grid">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className={`template-card ${selectedOption === template.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(template.id)}
                  >
                    <div className="template-image">
                      <img src={template.image} alt={template.name} />
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="continue-btn" 
            onClick={handleContinue}
            disabled={!selectedOption}
          >
            Continuar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSelectionModal; 