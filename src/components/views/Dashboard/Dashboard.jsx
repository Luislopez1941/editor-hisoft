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
import WebsiteSummary from '../Website/WebsiteSummary';
import Sidebar from '../Sidebar';
import './Dashboard.css';

const Dashboard = ({ onSwitchToWebsiteManager }) => {
  const [expandedMenus, setExpandedMenus] = useState({ mobile: true });
  const [activeSubmenu, setActiveSubmenu] = useState('sitio-web');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'website', 'sales', etc.
  const [showWebsiteManager, setShowWebsiteManager] = useState(false);

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleWebsiteClick = () => {
    setCurrentView('website-summary');
  };

  const handleSalesClick = () => {
    setCurrentView('sales');
  };

  const handleBackToMain = () => {
    setShowWebsiteManager(false);
    setCurrentView('main');
  };

  const handleSwitchToEditor = (type, template) => {
    setShowWebsiteManager(false);
    setCurrentView('website');
    if (onSwitchToWebsiteManager) {
      onSwitchToWebsiteManager(type, template);
    }
  };


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
        <Sidebar 
          onWebsiteClick={handleWebsiteClick} 
          activeSubmenu={activeSubmenu}
          expandedMenus={expandedMenus}
          toggleMenu={toggleMenu}
          setActiveSubmenu={setActiveSubmenu}
        />
        {/* Main Content */}
        <div className="dashboard-main">
          {currentView === 'website-summary' && <WebsiteSummary onSwitchToEditor={handleSwitchToEditor} />}
          {currentView === 'website' && <Website onBack={() => setCurrentView('website-summary')} onSwitchToEditor={() => setCurrentView('website')} />}
          {currentView === 'sales' && <Sales onBack={handleBackToMain} />}
          {/* Agrega más vistas aquí según currentView */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 