import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 32px;
  background: ${props => props.background || '#ffffff'};
  border: ${props => props.border || '1px solid #e5e7eb'};
  border-radius: ${props => props.borderRadius || '20px'};
  box-shadow: ${props => props.boxShadow || '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  }
`;

const FormTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px 0;
  text-align: center;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 40px 0;
  text-align: center;
  line-height: 1.6;
  font-weight: 400;
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  
  &::after {
    content: ${props => props.required ? ' *' : ''};
    color: #ef4444;
    font-weight: 700;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #fafafa;
  color: #1f2937;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
  
  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  resize: vertical;
  min-height: 140px;
  background: #fafafa;
  color: #1f2937;
  font-weight: 500;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
  
  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
`;

const Message = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &.success {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
    border: 1px solid #6ee7b7;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  }
  
  &.error {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #991b1b;
    border: 1px solid #f87171;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  }
`;

const ContactForm = ({ 
  title = 'Contáctanos',
  subtitle = '¿Tienes alguna pregunta? ¡Escríbenos!',
  fields = [
    { type: 'text', name: 'nombre', label: 'Nombre completo', required: true, placeholder: 'Tu nombre completo' },
    { type: 'email', name: 'email', label: 'Correo electrónico', required: true, placeholder: 'tu@email.com' },
    { type: 'tel', name: 'telefono', label: 'Teléfono', required: false, placeholder: '+52 (55) 1234-5678' },
    { type: 'textarea', name: 'mensaje', label: 'Mensaje', required: true, placeholder: 'Cuéntanos en qué podemos ayudarte...', rows: 4 }
  ],
  submitText = 'Enviar mensaje',
  successMessage = '¡Gracias! Tu mensaje ha sido enviado correctamente.',
  errorMessage = 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
  styles = {}
}) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la lógica real de envío
      console.log('Datos del formulario:', formData);
      
      setMessage({ type: 'success', text: successMessage });
      setFormData({});
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value)
    };

    switch (field.type) {
      case 'textarea':
        return (
          <FormGroup key={field.name}>
            <Label required={field.required}>{field.label}</Label>
            <Textarea
              {...commonProps}
              rows={field.rows || 4}
            />
          </FormGroup>
        );
      
      default:
        return (
          <FormGroup key={field.name}>
            <Label required={field.required}>{field.label}</Label>
            <Input
              {...commonProps}
              type={field.type}
            />
          </FormGroup>
        );
    }
  };

  return (
    <FormContainer {...styles}>
      <FormTitle>{title}</FormTitle>
      <FormSubtitle>{subtitle}</FormSubtitle>
      
      {message && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}
      
      <form onSubmit={handleSubmit}>
        {fields.map(renderField)}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : submitText}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default ContactForm;
