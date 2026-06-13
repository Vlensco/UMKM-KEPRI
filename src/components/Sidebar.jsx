import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  PieChart, 
  Award, 
  MessageSquareCode, 
  Download, 
  Database,
  Menu,
  X,
  Activity
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  dataSummary, 
  aiPanelOpen, 
  setAiPanelOpen, 
  sidebarOpen, 
  setSidebarOpen,
  onExportData
}) {
  const menuItems = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'regional', label: 'REGIONAL ANALYSIS', icon: Map },
    { id: 'sector', label: 'SECTOR ANALYSIS', icon: PieChart },
    { id: 'program', label: 'PROGRAM & RECOMMENDATION', icon: Award },
    { id: 'cooperative', label: 'COOPERATIVE HEALTH', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: sidebarOpen ? '232px' : '16px',
          zIndex: 50,
          display: 'flex',
          transition: 'left 0.3s ease'
        }}
        className="icon-btn lg-hidden-btn"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Sidebar Container */}
      <aside 
        className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}
        style={{
          transform: sidebarOpen ? 'translateX(0)' : undefined
        }}
      >
        {/* Logo Section */}
        <div className="sidebar-logo-section">
          <div className="logo-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <path d="M50,15 L18,80 L82,80 Z" fill="none" stroke="var(--success)" strokeWidth="8" strokeLinejoin="round" />
              <line x1="50" y1="35" x2="31" y2="80" stroke="var(--primary)" strokeWidth="4" />
              <line x1="50" y1="35" x2="69" y2="80" stroke="var(--primary)" strokeWidth="4" />
              <line x1="50" y1="55" x2="40" y2="80" stroke="var(--primary)" strokeWidth="4" />
              <line x1="50" y1="55" x2="60" y2="80" stroke="var(--primary)" strokeWidth="4" />
              <line x1="10" y1="80" x2="90" y2="80" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="logo-text-title">BATAM UMKM</h1>
            <span className="logo-text-sub">INTELLIGENCE CENTER</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close mobile sidebar
                }}
                className={`sidebar-btn ${isActive ? 'active' : ''}`}
              >
                <div className="sidebar-btn-content">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* AI Analyst Tab */}
          <button
            onClick={() => {
              setAiPanelOpen(!aiPanelOpen);
              setSidebarOpen(false);
            }}
            className={`sidebar-btn sidebar-btn-ai ${aiPanelOpen ? 'active' : ''}`}
          >
            <div className="sidebar-btn-content">
              <MessageSquareCode size={14} />
              <span>AI ANALYST</span>
            </div>
            <span className="btn-new-badge">NEW</span>
          </button>
        </nav>

        {/* Data Summary Panel */}
        <div className="sidebar-summary-panel">
          <div className="summary-title">
            <Database size={12} className="text-cyan-400" />
            <span>DATA SUMMARY</span>
          </div>
          <div className="summary-list">
            <div className="summary-row">
              <span>Kecamatan</span>
              <span className="summary-val">{dataSummary.kecamatan}</span>
            </div>
            <div className="summary-row">
              <span>Kelurahan</span>
              <span className="summary-val">{dataSummary.kelurahan}</span>
            </div>
            <div className="summary-row">
              <span>Sektor Usaha</span>
              <span className="summary-val">{dataSummary.sektor}</span>
            </div>
            <div className="summary-row">
              <span>Total UMKM 2024</span>
              <span className="summary-val">{dataSummary.totalUmkm}</span>
            </div>
            <div className="summary-row">
              <span>Koperasi Aktif</span>
              <span className="summary-val">{dataSummary.koperasiAktif}</span>
            </div>
            <div className="summary-row">
              <span>Program Aktif</span>
              <span className="summary-val">{dataSummary.programAktif}</span>
            </div>
          </div>

          <button onClick={onExportData} className="export-btn">
            <Download size={12} />
            <span>EXPORT DATA</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div>Sumber Data:</div>
          <ul>
            <li>Dinas KUMKM Kota Batam</li>
            <li>BPS Kota Batam</li>
            <li>Satu Data Batam (Data diolah)</li>
          </ul>
          <div style={{ marginTop: '12px', fontSize: '9px', fontWeight: 'bold' }}>Dashboard v1.0</div>
        </div>
      </aside>

      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)'
          }}
        />
      )}
    </>
  );
}
