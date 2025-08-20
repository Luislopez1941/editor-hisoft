import React, { useState } from 'react';
import styled from 'styled-components';

const NewsletterContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 28px;
  background: ${props => props.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.color || '#ffffff'};
  border-radius: ${props => props.borderRadius || '24px'};
  text-align: ${props => props.textAlign || 'center'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const NewsletterTitle = styled.h3`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: inherit;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NewsletterSubtitle = styled.p`
  font-size: 18px;
  margin: 0 0 32px 0;
  color: inherit;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 400;
  position: relative;
  z-index: 2;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`;

const EmailInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  font-weight: 500;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubscribeButton = styled.button`
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &::before {
      display: none;
    }
  }
`;

const Message = styled.div`
  margin-top: 24px;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  z-index: 2;
  animation: slideInUp 0.4s ease;
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &.success {
    background: rgba(34, 197, 94, 0.25);
    color: #bbf7d0;
    border: 1px solid rgba(34, 197, 94, 0.4);
    backdrop-filter: blur(10px);
  }
  
  &.error {
    background: rgba(239, 68, 68, 0.25);
    color: #fecaca;
    border: 1px solid rgba(239, 68, 68, 0.4);
    backdrop-filter: blur(10px);
  }
`;

const NewsletterFormComponent = ({
  title = 'Suscríbete a nuestro boletín',
  subtitle = 'Recibe las últimas noticias y ofertas',
  placeholder = 'tu@email.com',
  submitText = 'Suscribirse',
  successMessage = '¡Gracias por suscribirte!',
  errorMessage = 'Error al suscribirse. Intenta de nuevo.',
  styles = {}
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor, ingresa un email válido' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simular suscripción
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la lógica real de suscripción
      console.log('Email suscrito:', email);
      
      setMessage({ type: 'success', text: successMessage });
      setEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NewsletterContainer {...styles}>
      <NewsletterTitle>{title}</NewsletterTitle>
      <NewsletterSubtitle>{subtitle}</NewsletterSubtitle>
      
      <NewsletterForm onSubmit={handleSubmit}>
        <EmailInput
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <SubscribeButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Suscribiendo...' : submitText}
        </SubscribeButton>
      </NewsletterForm>
      
      {message && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}
    </NewsletterContainer>
  );
};

export default NewsletterFormComponent;
