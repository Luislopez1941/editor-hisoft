import React from 'react';
import { Settings, Home, DollarSign, Package, Puzzle, Smartphone, Inbox, Users, Megaphone, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({
  onWebsiteClick,
  activeSubmenu,
  expandedMenus,
  toggleMenu,
  setActiveSubmenu
}) => (
  <div className="dashboard-sidebar">
    <div className="sidebar-header">
      <div className="site-selector">
        <span>My Site 1</span>
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
             <div className="nav-item active" onClick={onWebsiteClick}>
         <Settings size={16} />
         <span>Sitio web</span>
       </div>
      {/* <div className="nav-item">
        <Home size={16} />
        <span>Inicio</span>
      </div> */}
      {/* <div className="nav-item expandable" onClick={() => toggleMenu('mobile')}>
        <Smartphone size={16} />
        <span>Sitio y app móvil</span>
        <ChevronDown size={16} className={expandedMenus?.mobile ? 'rotated' : ''} />
      </div>
      {expandedMenus?.mobile && (
        <div className="submenu">
          <div className="submenu-header">Sitio web y SEO</div>
          <div className={`submenu-item ${activeSubmenu === 'sitio-web' ? 'active' : ''}`} onClick={onWebsiteClick}>
            Sitio web
          </div>
          <div className={`submenu-item ${activeSubmenu === 'seo' ? 'active' : ''}`} onClick={() => setActiveSubmenu('seo')}>
            SEO
          </div>
          <div className={`submenu-item ${activeSubmenu === 'velocidad' ? 'active' : ''}`} onClick={() => setActiveSubmenu('velocidad')}>
            Velocidad del sitio
          </div>
          <div className={`submenu-item ${activeSubmenu === 'actividad' ? 'active' : ''}`} onClick={() => setActiveSubmenu('actividad')}>
            Tiempo de actividad y seguridad
          </div>
          <div className={`submenu-item ${activeSubmenu === 'app-movil' ? 'active' : ''}`} onClick={() => setActiveSubmenu('app-movil')}>
            App móvil
          </div>
          <div className={`submenu-item ${activeSubmenu === 'logo' ? 'active' : ''}`} onClick={() => setActiveSubmenu('logo')}>
            Logo y marca
          </div>
          <div className={`submenu-item ${activeSubmenu === 'hopp' ? 'active' : ''}`} onClick={() => setActiveSubmenu('hopp')}>
            Hopp - Link en bio
          </div>
        </div>
      )} */}
      {/* <div className="nav-item">
        <DollarSign size={16} />
        <span>Ventas</span>
      </div>
      <div className="nav-item">
        <Package size={16} />
        <span>Catálogo</span>
      </div>
      <div className="nav-item">
        <Puzzle size={16} />
        <span>Apps</span>
      </div>
      <div className="nav-item">
        <Inbox size={16} />
        <span>Bandeja de entrada</span>
      </div>
      <div className="nav-item">
        <Users size={16} />
        <span>Clientes reales y potenciales</span>
      </div>
      <div className="nav-item">
        <Megaphone size={16} />
        <span>Marketing</span>
      </div> */}
    </nav>
  </div>
);

export default Sidebar; 