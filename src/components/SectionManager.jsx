import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Home, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Save,
  ArrowLeft,
  ArrowRight,
  Globe,
  Layers
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const SectionManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  width: 300px;
`;

const SectionHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.4;
`;

const CreateSectionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin: 16px 20px 0 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, sans-serif;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }
`;

const SectionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
`;

const SectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent'};
  border-left: 3px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#f8fafc'};
  }
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => props.$isHome ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  color: white;
`;

const SectionInfo = styled.div`
  flex: 1;
`;

const SectionName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  font-family: 'Inter', system-ui, sans-serif;
`;

const SectionSlug = styled.div`
  font-size: 12px;
  color: #64748b;
  font-family: 'Inter', system-ui, sans-serif;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${SectionItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger ? '#fee2e2' : '#f1f5f9'};
    color: ${props => props.danger ? '#dc2626' : '#1e293b'};
  }
`;

// Modal para crear/editar secciones
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', system-ui, sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', system-ui, sans-serif;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const SectionManager = () => {
  const { 
    sections, 
    activeSectionId, 
    createSection, 
    deleteSection, 
    updateSection, 
    setActiveSection 
  } = useEditor();
  
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const handleCreateSection = () => {
    setEditingSection(null);
    setFormData({ name: '', slug: '' });
    setShowModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setFormData({ name: section.name, slug: section.slug });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-');
    
    if (editingSection) {
      updateSection(editingSection.id, { 
        name: formData.name.trim(), 
        slug 
      });
    } else {
      createSection(formData.name.trim(), slug);
    }
    
    setShowModal(false);
    setFormData({ name: '', slug: '' });
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
      deleteSection(sectionId);
    }
  };

  const handleNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || value.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  return (
    <>
      <SectionManagerContainer>
        <SectionHeader>
          <SectionTitle>
            <Layers size={20} />
            Gestionar Secciones
          </SectionTitle>
          <SectionSubtitle>
            Organiza tu sitio web en múltiples secciones
          </SectionSubtitle>
        </SectionHeader>

        <CreateSectionButton onClick={handleCreateSection}>
          <Plus size={16} />
          Nueva Sección
        </CreateSectionButton>

        <SectionList>
          {Object.values(sections).map((section) => (
            <SectionItem
              key={section.id}
              $active={section.id === activeSectionId}
              onClick={() => setActiveSection(section.id)}
            >
              <SectionIcon $isHome={section.isHome}>
                {section.isHome ? <Home size={16} /> : <Globe size={16} />}
              </SectionIcon>
              <SectionInfo>
                <SectionName>{section.name}</SectionName>
                <SectionSlug>/{section.slug}</SectionSlug>
              </SectionInfo>
              {!section.isHome && (
                <SectionActions>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSection(section);
                    }}
                    title="Editar sección"
                  >
                    <Edit3 size={14} />
                  </ActionButton>
                  <ActionButton
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    title="Eliminar sección"
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </SectionActions>
              )}
            </SectionItem>
          ))}
        </SectionList>
      </SectionManagerContainer>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingSection ? 'Editar Sección' : 'Nueva Sección'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Nombre de la sección</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Acerca de, Servicios, Contacto"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>URL (slug)</Label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="Ej: acerca-de, servicios, contacto"
                />
              </FormGroup>

              <ModalActions>
                <Button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  <Save size={14} style={{ marginRight: '6px' }} />
                  {editingSection ? 'Guardar' : 'Crear'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default SectionManager; 