import React from 'react';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import './Sales.css';

const Sales = ({ onBack }) => {
  return (
    <div className="sales-view">
      <div className="sales-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="title-section">
            <h1>Ventas</h1>
            <p>Gestiona tus ventas, pedidos y transacciones.</p>
          </div>
        </div>
      </div>

      <div className="sales-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h3>$0</h3>
              <p>Ventas totales</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Pedidos</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>0%</h3>
              <p>Crecimiento</p>
            </div>
          </div>
        </div>
        
        <div className="empty-state">
          <h2>Aún no tienes ventas</h2>
          <p>Configura tu tienda y comienza a vender productos o servicios.</p>
          <button className="setup-btn">Configurar tienda</button>
        </div>
      </div>
    </div>
  );
};

export default Sales; 