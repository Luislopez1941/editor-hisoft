import React, { useState } from 'react';
import { 
  Settings, 
  Home, 
  CreditCard, 
  DollarSign, 
  Package, 
  Puzzle, 
  Smartphone, 
  Inbox, 
  Users, 
  Megaphone,
  ChevronDown,
  ChevronRight,
  Edit3,
  Info,
  ExternalLink,
  Search,
  Bell,
  HelpCircle,
  User,
  ArrowLeft,
  Plus
} from 'lucide-react';
import Website from '../Website/Website';
import Sales from '../Sales/Sales';
import './Dashboard.css';

const Dashboard = ({ onSwitchToWebsiteManager }) => {
  const [expandedMenus, setExpandedMenus] = useState({ mobile: true });
  const [activeSubmenu, setActiveSubmenu] = useState('sitio-web');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'website', 'sales', etc.

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleWebsiteClick = () => {
    // Ir directamente al editor manteniendo sidebar y header
    if (onSwitchToWebsiteManager) {
      onSwitchToWebsiteManager('website', null);
    }
  };

  const handleSalesClick = () => {
    setCurrentView('sales');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };



  // Si estamos en la vista de Website, mostrar el componente Website
  if (currentView === 'website') {
    return (
      <Website 
        onBack={handleBackToMain}
        onSwitchToEditor={onSwitchToWebsiteManager}
      />
    );
  }

  // Si estamos en la vista de Sales, mostrar el componente Sales
  if (currentView === 'sales') {
    return (
      <Sales onBack={handleBackToMain} />
    );
  }

  return (
    <div className="dashboard">
      {/* Header Superior */}
      <div className="dashboard-top-header">
        <div className="header-left">
          <div className="wix-logo-main">WIX</div>
          <div className="site-selector-main">
            <span>My Site 1</span>
            <ChevronDown size={16} />
          </div>
          <nav className="top-nav">
            <a href="#" className="nav-link">Explorar</a>
            <a href="#" className="nav-link">Contratar a un profesional</a>
            <a href="#" className="nav-link">Ayuda</a>
          </nav>
        </div>
        
        <div className="header-center">
          <button className="upgrade-btn">Haz Upgrade</button>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <Search size={16} />
            <input type="text" placeholder="Buscar herramientas, apps, ayuda y más..." />
          </div>
          <Bell size={20} />
          <HelpCircle size={20} />
          <User size={20} />
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="site-selector">
            <span>My Site 1</span>
            <ChevronDown size={16} />
          </div>
        </div>
        
        <div className="sidebar-progress">
          <div className="setup-section">
            <span className="setup-title">Configuremos tu negocio</span>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">1/7 completados</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <Settings size={16} />
            <span>Configuración</span>
          </div>
          <div className="nav-item">
            <Home size={16} />
            <span>Inicio</span>
          </div>
          <div className="nav-item expandable" onClick={() => toggleMenu('payments')}>
            <CreditCard size={16} />
            <span>Recibir pagos</span>
            <ChevronRight size={16} className={expandedMenus.payments ? 'rotated' : ''} />
          </div>
          <div className="nav-item" onClick={handleSalesClick}>
            <DollarSign size={16} />
            <span>Ventas</span>
          </div>
          <div className="nav-item expandable" onClick={() => toggleMenu('catalog')}>
            <Package size={16} />
            <span>Catálogo</span>
            <ChevronRight size={16} className={expandedMenus.catalog ? 'rotated' : ''} />
          </div>
          <div className="nav-item expandable" onClick={() => toggleMenu('apps')}>
            <Puzzle size={16} />
            <span>Apps</span>
            <ChevronRight size={16} className={expandedMenus.apps ? 'rotated' : ''} />
          </div>
          <div className="nav-item expandable" onClick={() => toggleMenu('mobile')}>
            <Smartphone size={16} />
            <span>Sitio y app móvil</span>
            <ChevronDown size={16} className={expandedMenus.mobile ? 'rotated' : ''} />
          </div>
          
          {/* Submenu móvil */}
          {expandedMenus.mobile && (
            <div className="submenu">
              <div className="submenu-header">Sitio web y SEO</div>
                             <div 
                 className={`submenu-item ${activeSubmenu === 'sitio-web' ? 'active' : ''}`}
                 onClick={handleWebsiteClick}
               >
                 Sitio web
               </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'seo' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('seo')}
              >
                SEO
              </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'velocidad' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('velocidad')}
              >
                Velocidad del sitio
              </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'actividad' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('actividad')}
              >
                Tiempo de actividad y seguridad
              </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'app-movil' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('app-movil')}
              >
                App móvil
              </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'logo' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('logo')}
              >
                Logo y marca
              </div>
              <div 
                className={`submenu-item ${activeSubmenu === 'hopp' ? 'active' : ''}`}
                onClick={() => setActiveSubmenu('hopp')}
              >
                Hopp - Link en bio
              </div>
            </div>
          )}

          <div className="nav-item">
            <Inbox size={16} />
            <span>Bandeja de entrada</span>
          </div>
          <div className="nav-item expandable" onClick={() => toggleMenu('customers')}>
            <Users size={16} />
            <span>Clientes reales y potenciales</span>
            <ChevronRight size={16} className={expandedMenus.customers ? 'rotated' : ''} />
          </div>
          <div className="nav-item">
            <Megaphone size={16} />
            <span>Marketing</span>
          </div>
        </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard Principal</h1>
            <p>Bienvenido a tu panel de administración.</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <span>Acciones del sitio</span>
              <ChevronDown size={16} />
            </div>
            <button className="design-site-btn">
              <Edit3 size={16} />
              Diseñar sitio
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
              <div className="card-header">
                <h3>Supervisa la velocidad de tu sitio</h3>
                <Info size={16} />
              </div>
              <p>Una vez que tu sitio tenga suficiente tráfico, podrás comprobar su tiempo de carga y optimizarlo.</p>
              <a href="#" className="card-link">
                Leer más <ExternalLink size={16} />
              </a>
            </div>

            <div className="performance-card">
              <div className="card-header">
                <h3>Monitorea el tiempo de actividad de tu sitio</h3>
                <Info size={16} />
              </div>
              <p>Supervisa la disponibilidad de tu sitio publicado y descubre cómo Wix permite la continuidad operativa en todo momento.</p>
              <a href="#" className="card-link">
                Leer más <ExternalLink size={16} />
              </a>
            </div>
          </div>
                 </div>
         </div>
       </div>

     </div>
   );
};

export default Dashboard; 