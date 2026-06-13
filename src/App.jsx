import React, { useState, useEffect } from 'react';
import dashboardData from './data/dashboard_data.json';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import UMKMAnalysis from './components/UMKMAnalysis';
import CooperativeHealth from './components/CooperativeHealth';
import SectorAnalysis from './components/SectorAnalysis';
import ProgramRecommendation from './components/ProgramRecommendation';
import AIVoiceAnalyst from './components/AIVoiceAnalyst';

function App() {
  // 1. GLOBAL STATE
  const [activeTab, setActiveTab] = useState('overview'); // overview, regional, sector, program, cooperative
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedChart, setHighlightedChart] = useState(null); 
  const [theme, setTheme] = useState('dark');

  // Apply body dark/light theme classes
  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
    }
  }, [theme]);

  // Extract lookup lists from JSON data
  const yearsList = ['All', 2024, 2023, 2022, 2021, 2020];
  const kecamatanList = dashboardData.dim_kecamatan;
  const sectorList = dashboardData.dim_sector;

  // Calculate static metrics for left sidebar Data Summary (for 2024)
  const fact2024 = dashboardData.fact_umkm_kecamatan_sector.filter(r => r.year === 2024);
  const totalUmkm2024 = fact2024.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
  
  const kop2024 = dashboardData.fact_koperasi_kecamatan.filter(r => r.year === 2024);
  const activeKop2024 = kop2024.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);

  const dataSummary = {
    kecamatan: kecamatanList.length,
    kelurahan: 65, 
    sektor: sectorList.length,
    totalUmkm: new Intl.NumberFormat('id-ID').format(totalUmkm2024),
    koperasiAktif: new Intl.NumberFormat('id-ID').format(activeKop2024),
    programAktif: dashboardData.dim_program.length
  };

  // 2. EXPORT DATA FUNCTION
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dashboardData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Batam_UMKM_DataMart_V3_Export_${selectedYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset Slicer filters
  const handleResetFilters = () => {
    setSelectedKecamatan(null);
    setSelectedSector(null);
  };

  // AI chart highlight controller
  const triggerChartHighlight = (chartId) => {
    setHighlightedChart(chartId);
    
    // Auto-scroll target element into view
    setTimeout(() => {
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    // Clear highlight after 6 seconds
    setTimeout(() => {
      setHighlightedChart(null);
    }, 6000);
  };

  // Render the current view page
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            data={dashboardData}
            selectedYear={selectedYear}
            selectedKecamatan={selectedKecamatan}
            setSelectedKecamatan={setSelectedKecamatan}
            selectedSector={selectedSector}
            highlightedChart={highlightedChart}
            setHighlightedChart={setHighlightedChart}
          />
        );
      case 'regional':
        return (
          <UMKMAnalysis
            data={dashboardData}
            selectedYear={selectedYear}
            selectedKecamatan={selectedKecamatan}
            setSelectedKecamatan={setSelectedKecamatan}
            selectedSector={selectedSector}
            highlightedChart={highlightedChart}
            setHighlightedChart={setHighlightedChart}
          />
        );
      case 'sector':
        return (
          <SectorAnalysis
            data={dashboardData}
            selectedYear={selectedYear}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
          />
        );
      case 'program':
        return (
          <ProgramRecommendation
            data={dashboardData}
            selectedYear={selectedYear}
            selectedKecamatan={selectedKecamatan}
            setSelectedKecamatan={setSelectedKecamatan}
          />
        );
      case 'cooperative':
        return (
          <CooperativeHealth
            data={dashboardData}
            selectedYear={selectedYear}
            selectedKecamatan={selectedKecamatan}
            setSelectedKecamatan={setSelectedKecamatan}
            highlightedChart={highlightedChart}
            setHighlightedChart={setHighlightedChart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSummary={dataSummary}
        aiPanelOpen={aiPanelOpen}
        setAiPanelOpen={setAiPanelOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onExportData={handleExportData}
      />

      {/* 2. Main Dashboard Area */}
      <div className="main-area">
        {/* Header */}
        <Header
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          yearsList={yearsList}
          selectedKecamatan={selectedKecamatan}
          setSelectedKecamatan={setSelectedKecamatan}
          kecamatanList={kecamatanList}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          sectorList={sectorList}
          theme={theme}
          toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onResetFilters={handleResetFilters}
        />

        {/* Content & AI Right Panel */}
        <div className="content-wrapper">
          
          {/* Main scrollable dashboard metrics */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', backgroundColor: 'rgba(3, 11, 24, 0.2)' }}>
            {renderContent()}
          </div>

          {/* AI Voice Analyst Right Side panel */}
          {aiPanelOpen && (
            <AIVoiceAnalyst
              data={dashboardData}
              selectedYear={selectedYear}
              selectedKecamatan={selectedKecamatan}
              selectedSector={selectedSector}
              onHighlightChart={triggerChartHighlight}
              onSwitchTab={setActiveTab}
              onClose={() => setAiPanelOpen(false)}
            />
          )}

        </div>
      </div>
    </>
  );
}

export default App;
