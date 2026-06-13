import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Star, 
  Target, 
  Building, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const KECAMATAN_MAP_DATA = [
  { id: 'BATAM-BTA', name: 'Batu Ampar', x: 190, y: 75, path: 'M 160,80 C 170,50, 195,45, 205,50 C 215,55, 215,75, 210,85 C 205,95, 185,95, 175,95 Z', labelX: 190, labelY: 72 },
  { id: 'BATAM-BKG', name: 'Bengkong', x: 230, y: 75, path: 'M 210,85 C 215,75, 215,55, 225,50 C 235,45, 245,55, 250,65 C 255,75, 250,85, 240,90 C 230,95, 220,95, 210,85 Z', labelX: 232, labelY: 75 },
  { id: 'BATAM-BTK', name: 'Batam Kota', x: 280, y: 105, path: 'M 240,90 C 250,85, 255,75, 260,65 C 275,65, 290,70, 300,80 C 310,90, 315,110, 305,125 C 295,140, 275,145, 265,135 C 255,125, 245,110, 240,90 Z', labelX: 275, labelY: 105 },
  { id: 'BATAM-LBB', name: 'Lubuk Baja', x: 212, y: 112, path: 'M 175,95 C 185,95, 205,95, 210,85 C 220,95, 230,95, 240,90 C 245,110, 235,125, 225,130 C 215,135, 195,135, 185,125 Z', labelX: 212, labelY: 112 },
  { id: 'BATAM-SKP', name: 'Sekupang', x: 145, y: 135, path: 'M 120,105 C 130,90, 150,85, 160,80 C 175,95, 185,125, 185,135 C 185,145, 170,165, 155,175 C 140,185, 120,180, 110,160 C 100,140, 110,120, 120,105 Z', labelX: 145, labelY: 138 },
  { id: 'BATAM-NGA', name: 'Nongsa', x: 375, y: 105, path: 'M 300,80 C 310,70, 335,45, 360,40 C 390,35, 420,50, 440,75 C 450,90, 445,115, 425,135 C 405,155, 365,175, 340,180 C 325,175, 310,140, 305,125 C 315,110, 310,90, 300,80 Z', labelX: 370, labelY: 110 },
  { id: 'BATAM-BTAJ', name: 'Batu Aji', x: 178, y: 180, path: 'M 155,175 C 170,165, 185,145, 195,135 C 205,145, 210,165, 205,185 C 200,205, 185,215, 170,225 C 155,230, 145,210, 155,175 Z', labelX: 178, labelY: 180 },
  { id: 'BATAM-SGL', name: 'Sagulung', x: 205, y: 245, path: 'M 170,225 C 185,215, 200,205, 205,185 C 220,195, 235,205, 245,225 C 255,245, 240,270, 225,285 C 210,295, 185,290, 175,270 C 165,250, 160,235, 170,225 Z', labelX: 205, labelY: 245 },
  { id: 'BATAM-SGB', name: 'Sungai Beduk', x: 285, y: 180, path: 'M 225,130 C 235,125, 255,125, 265,135 C 275,145, 295,140, 305,125 C 310,140, 325,175, 340,180 C 335,195, 320,215, 305,225 C 290,235, 265,230, 245,225 C 235,205, 230,195, 225,130 Z', labelX: 285, labelY: 180 },
  { id: 'BATAM-BLP', name: 'Belakang Padang', x: 60, y: 132, path: 'M 60,110 C 70,110, 80,120, 80,130 C 80,140, 70,150, 60,150 C 50,150, 40,140, 40,130 C 40,120, 50,110, 60,110 Z M 75,160 C 80,160, 85,165, 85,170 C 85,175, 80,180, 75,180 C 70,180, 65,175, 65,170 C 65,165, 70,160, 75,160 Z', labelX: 60, labelY: 130 },
  { id: 'BATAM-BUL', name: 'Bulang', x: 115, y: 300, path: 'M 90,240 C 98,240, 105,247, 105,255 C 105,263, 98,270, 90,270 C 82,270, 75,263, 75,255 C 75,247, 82,240, 90,240 Z M 115,280 C 125,280, 133,288, 133,298 C 133,308, 125,316, 115,316 C 105,316, 97,308, 97,298 C 97,288, 105,280, 115,280 Z', labelX: 115, labelY: 298 },
  { id: 'BATAM-GLG', name: 'Galang', x: 260, y: 332, path: 'M 260,305 C 275,305, 285,315, 285,325 C 285,340, 270,355, 255,355 C 240,355, 235,340, 235,325 C 235,315, 245,305, 260,305 Z M 275,370 C 285,370, 292,377, 292,385 C 292,395, 280,405, 270,405 C 260,405, 255,395, 255,385 C 255,377, 265,370, 275,370 Z', labelX: 260, labelY: 332 }
];

export default function DashboardOverview({
  data,
  selectedYear,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedSector,
  highlightedChart,
  setHighlightedChart
}) {
  const [mapMetric, setMapMetric] = useState('totalUmkm');
  const [trendView, setTrendView] = useState('line');
  const [tableTab, setTableTab] = useState('totalUmkm');

  // Formatting helpers
  const formatNumber = (num) => {
    if (num == null) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  const formatPercent = (num) => {
    if (num == null) return '0%';
    return num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
  };

  const formatCurrencyTrillion = (num) => {
    if (num == null) return 'Rp 0 T';
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`;
  };

  const formatCurrencyMillion = (num) => {
    if (num == null) return 'Rp 0 Jt';
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Juta`;
  };

  // --- FILTER DATA ---
  const factUmkmYear = selectedYear === 'All'
    ? data.fact_umkm_kecamatan_sector
    : data.fact_umkm_kecamatan_sector.filter(r => r.year === selectedYear);

  const kpiYear = selectedYear === 'All'
    ? data.kpi_scoring.filter(r => r.year === 2024)
    : data.kpi_scoring.filter(r => r.year === selectedYear);

  const macroYear = selectedYear === 'All'
    ? (data.fact_macro_city.find(r => r.year === 2024) || {})
    : (data.fact_macro_city.find(r => r.year === selectedYear) || {});

  const kopYear = selectedYear === 'All'
    ? data.fact_koperasi_kecamatan
    : data.fact_koperasi_kecamatan.filter(r => r.year === selectedYear);

  let filteredUmkm = factUmkmYear;
  if (selectedKecamatan) filteredUmkm = filteredUmkm.filter(r => r.kecamatan === selectedKecamatan);
  if (selectedSector) filteredUmkm = filteredUmkm.filter(r => r.sector_name === selectedSector);

  // --- KPI CALCULATIONS ---
  const totalUmkmValue = filteredUmkm.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
  
  // Calculate Growth YoY:
  const prevYear = selectedYear === 'All' ? 2023 : selectedYear - 1;
  const currentYearForYoY = selectedYear === 'All' ? 2024 : selectedYear;
  
  const currentFilteredUmkm = data.fact_umkm_kecamatan_sector.filter(r => r.year === currentYearForYoY);
  let finalCurrentUmkm = currentFilteredUmkm;
  if (selectedKecamatan) finalCurrentUmkm = finalCurrentUmkm.filter(r => r.kecamatan === selectedKecamatan);
  if (selectedSector) finalCurrentUmkm = finalCurrentUmkm.filter(r => r.sector_name === selectedSector);
  const currentTotalUmkm = finalCurrentUmkm.reduce((acc, r) => acc + (r.umkm_count || 0), 0);

  const prevFilteredUmkm = data.fact_umkm_kecamatan_sector.filter(r => r.year === prevYear);
  let finalPrevUmkm = prevFilteredUmkm;
  if (selectedKecamatan) finalPrevUmkm = finalPrevUmkm.filter(r => r.kecamatan === selectedKecamatan);
  if (selectedSector) finalPrevUmkm = finalPrevUmkm.filter(r => r.sector_name === selectedSector);
  const prevTotalUmkm = finalPrevUmkm.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
  
  const growthYoY = prevTotalUmkm > 0 ? ((currentTotalUmkm - prevTotalUmkm) / prevTotalUmkm) * 100 : 0;
  
  const activeKecamatanCount = new Set(filteredUmkm.map(r => r.kecamatan)).size;

  let activeKpi = kpiYear;
  if (selectedKecamatan) activeKpi = activeKpi.filter(r => r.kecamatan === selectedKecamatan);
  const avgOppScore = activeKpi.length > 0 ? activeKpi.reduce((acc, r) => acc + (r.opportunity_score || 0), 0) / activeKpi.length : 0;
  const avgIntScore = activeKpi.length > 0 ? activeKpi.reduce((acc, r) => acc + (r.intervention_need_score || 0), 0) / activeKpi.length : 0;

  let activeKop = kopYear;
  if (selectedKecamatan) activeKop = activeKop.filter(r => r.kecamatan === selectedKecamatan);
  const totalCoopActive = activeKop.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);
  
  // Coop growth:
  const currentActiveKopForYoY = data.fact_koperasi_kecamatan.filter(r => r.year === currentYearForYoY);
  let finalCurrentKop = currentActiveKopForYoY;
  if (selectedKecamatan) finalCurrentKop = finalCurrentKop.filter(r => r.kecamatan === selectedKecamatan);
  const currentCoopActive = finalCurrentKop.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);

  const prevKop = data.fact_koperasi_kecamatan.filter(r => r.year === prevYear);
  let finalPrevKop = prevKop;
  if (selectedKecamatan) finalPrevKop = finalPrevKop.filter(r => r.kecamatan === selectedKecamatan);
  const prevCoopActive = finalPrevKop.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);
  const coopGrowth = prevCoopActive > 0 ? ((currentCoopActive - prevCoopActive) / prevCoopActive) * 100 : 0;

  // --- MAP VALUES ---
  const mapKecamatanValues = KECAMATAN_MAP_DATA.map(k => {
    const kpiRow = kpiYear.find(r => r.kecamatan === k.name);
    const umkmRows = factUmkmYear.filter(r => r.kecamatan === k.name);
    
    const umkmCount = umkmRows.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
    const growth = kpiRow ? kpiRow.growth_yoy_pct : 0;
    const opp = kpiRow ? kpiRow.opportunity_score : 0;
    const intv = kpiRow ? kpiRow.intervention_need_score : 0;

    return {
      ...k,
      totalUmkm: umkmCount,
      growth,
      opportunityScore: opp,
      interventionScore: intv
    };
  });

  const maxMapVal = Math.max(...mapKecamatanValues.map(k => k[mapMetric] || 1));

  const getMapColor = (val, max) => {
    if (val === 0) return '#0d213f';
    const ratio = Math.min(val / max, 1);
    
    if (mapMetric === 'totalUmkm') {
      if (val > 7000) return '#f59e0b';
      if (val > 4000) return '#00f2fe';
      if (val > 2000) return '#3b82f6';
      if (val > 1000) return '#1d4ed8';
      return '#172554';
    } else if (mapMetric === 'growth') {
      return `rgba(16, 185, 129, ${0.2 + ratio * 0.8})`;
    } else if (mapMetric === 'opportunityScore') {
      return `rgba(245, 158, 11, ${0.2 + ratio * 0.8})`;
    } else {
      return `rgba(239, 68, 68, ${0.2 + ratio * 0.8})`;
    }
  };

  // --- SECTOR composition ---
  const sectorCounts = filteredUmkm.reduce((acc, r) => {
    const sName = r.sector_name;
    if (!acc[sName]) acc[sName] = 0;
    acc[sName] += (r.umkm_count || 0);
    return acc;
  }, {});

  const rawSectorData = Object.entries(sectorCounts).map(([name, value]) => ({
    name,
    value,
    percentage: totalUmkmValue > 0 ? (value / totalUmkmValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  const sectorData = [];
  let otherSum = 0;
  rawSectorData.forEach((s, idx) => {
    if (idx < 9) sectorData.push(s);
    else otherSum += s.value;
  });
  if (otherSum > 0) {
    sectorData.push({
      name: 'Lainnya',
      value: otherSum,
      percentage: totalUmkmValue > 0 ? (otherSum / totalUmkmValue) * 100 : 0
    });
  }

  const SECTOR_COLORS = [
    '#00f2fe', '#3b82f6', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#84cc16', '#64748b'
  ];

  // --- TREND DATA ---
  const yearlyUMKMRaw = data.fact_umkm_kecamatan_sector.reduce((acc, r) => {
    const yr = r.year;
    if (selectedKecamatan && r.kecamatan !== selectedKecamatan) return acc;
    if (selectedSector && r.sector_name !== selectedSector) return acc;
    if (!acc[yr]) acc[yr] = 0;
    acc[yr] += (r.umkm_count || 0);
    return acc;
  }, {});

  const trendData = Object.entries(yearlyUMKMRaw)
    .map(([year, value]) => ({ year: Number(year), value }))
    .sort((a, b) => a.year - b.year);

  // --- CHART JS DATA FORMATS ---
  const lineChartData = {
    labels: trendData.map(d => d.year),
    datasets: [
      {
        label: 'Total UMKM',
        data: trendData.map(d => d.value),
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: '#030a16',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.25,
        fill: true
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        titleFont: { family: 'Outfit', size: 10 },
        bodyFont: { family: 'Outfit', size: 10 },
        callbacks: {
          label: (context) => `Total UMKM: ${formatNumber(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  const barChartData = {
    labels: trendData.map(d => d.year),
    datasets: [
      {
        label: 'Total UMKM',
        data: trendData.map(d => d.value),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Total UMKM: ${formatNumber(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  const donutChartData = {
    labels: sectorData.map(s => s.name),
    datasets: [
      {
        data: sectorData.map(s => s.value),
        backgroundColor: SECTOR_COLORS,
        borderColor: 'rgba(5, 12, 26, 0.8)',
        borderWidth: 1.5
      }
    ]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        titleFont: { family: 'Outfit', size: 10 },
        bodyFont: { family: 'Outfit', size: 10 },
        callbacks: {
          label: (context) => `${context.label}: ${formatNumber(context.parsed)} unit`
        }
      }
    },
    cutout: '62%'
  };

  // --- TABLE ROWS ---
  const tableData = kpiYear.map(r => ({
    kecamatan: r.kecamatan,
    totalUmkm: r.umkm_2024,
    growth: r.growth_yoy_pct,
    opportunityScore: r.opportunity_score,
    interventionScore: r.intervention_need_score
  }));

  const sortedTableData = [...tableData].sort((a, b) => b[tableTab] - a[tableTab]).slice(0, 5);

  return (
    <div className={`page-container ${highlightedChart ? 'has-highlight' : ''}`}>
      {/* 1. KPI Cards */}
      <div 
        id="kpi-cards"
        className={`kpi-grid ${highlightedChart === 'kpis' ? 'highlight-active' : ''}`}
        onClick={() => setHighlightedChart(null)}
      >
        {/* Card 1 */}
        <div className="glass-card kpi-card border-purple">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">TOTAL UMKM ({selectedYear})</span>
            <Users size={15} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatNumber(totalUmkmValue)}</h3>
            <span className="kpi-card-unit">UMKM</span>
          </div>
          <div className={`kpi-card-change ${growthYoY >= 0 ? 'up' : 'down'}`}>
            {growthYoY >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            <span>{formatPercent(growthYoY)} vs {prevYear}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card kpi-card border-green">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">GROWTH YOY</span>
            <TrendingUp size={15} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatPercent(growthYoY)}</h3>
          </div>
          <div className="kpi-card-change up">
            <ArrowUpRight size={10} />
            <span>2.41% vs 2023</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card kpi-card border-cyan">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">KECAMATAN AKTIF</span>
            <MapPin size={15} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{activeKecamatanCount}</h3>
            <span className="kpi-card-unit">Kecamatan</span>
          </div>
          <span className="kpi-card-change up">100% Coverage</span>
        </div>

        {/* Card 4 */}
        <div className="glass-card kpi-card border-amber">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">OPPORTUNITY SCORE</span>
            <Star size={15} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{avgOppScore.toFixed(1)} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/100</span></h3>
          </div>
          <span className="kpi-card-change up" style={{ color: 'var(--warning)' }}>Tinggi</span>
        </div>

        {/* Card 5 */}
        <div className="glass-card kpi-card border-rose">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">INTERVENTION NEED</span>
            <Target size={15} style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{avgIntScore.toFixed(1)} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/100</span></h3>
          </div>
          <span className="kpi-card-change down" style={{ color: 'var(--danger)' }}>Perlu Intervensi</span>
        </div>

        {/* Card 6 */}
        <div className="glass-card kpi-card border-teal">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">KOPERASI AKTIF</span>
            <Building size={15} style={{ color: '#14b8a6' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatNumber(totalCoopActive)}</h3>
            <span className="kpi-card-unit">Unit</span>
          </div>
          <div className={`kpi-card-change ${coopGrowth >= 0 ? 'up' : 'down'}`}>
            <ArrowUpRight size={10} />
            <span>{formatPercent(coopGrowth)} vs {prevYear}</span>
          </div>
        </div>
      </div>

      {/* 2. Map & Trend charts */}
      <div className="dashboard-two-col">
        {/* Map */}
        <div 
          id="map-chart"
          className={`glass-card p-5 ${highlightedChart === 'map' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <div className="glass-card-header">
            <div>
              <h3 className="glass-card-title">DISTRIBUSI UMKM PER KECAMATAN</h3>
              <p className="glass-card-subtitle">Tekan wilayah peta untuk menyaring wilayah</p>
            </div>
            
            <select
              value={mapMetric}
              onChange={(e) => setMapMetric(e.target.value)}
              className="filter-select"
            >
              <option value="totalUmkm">Total UMKM</option>
              <option value="growth">Growth YoY</option>
              <option value="opportunityScore">Opportunity Score</option>
              <option value="interventionScore">Intervention Need</option>
            </select>
          </div>

          <div className="map-canvas-container">
            <style>{`
              .map-canvas-container path {
                cursor: pointer;
              }
              .map-canvas-container path:hover {
                fill-opacity: 0.85;
                stroke: #00f2fe !important;
                stroke-width: 2px !important;
                filter: drop-shadow(0 0 6px rgba(0, 242, 254, 0.5));
              }
            `}</style>
            <svg viewBox="0 0 480 430" style={{ width: '100%', maxHeight: '360px' }}>
              <g>
                {mapKecamatanValues.map((k) => {
                  const val = k[mapMetric];
                  const color = getMapColor(val, maxMapVal);
                  const isSelected = selectedKecamatan === k.name;
                  
                  return (
                    <g key={k.id} style={{ cursor: 'pointer' }}>
                      <path
                        d={k.path}
                        fill={color}
                        stroke={isSelected ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)'}
                        strokeWidth={isSelected ? 2.5 : 1}
                        style={{ transition: 'all 0.3s ease' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKecamatan(isSelected ? null : k.name);
                        }}
                      />
                      <text 
                        x={k.labelX} 
                        y={k.labelY - 2} 
                        style={{ 
                          fill: '#f8fafc', 
                          fontSize: '8px', 
                          fontWeight: '700', 
                          pointerEvents: 'none',
                          textShadow: '0px 1px 2px rgba(0,0,0,0.9)',
                          letterSpacing: '0.1px'
                        }} 
                        textAnchor="middle"
                      >
                        {k.name}
                      </text>
                      <text 
                        x={k.labelX} 
                        y={k.labelY + 8} 
                        style={{ 
                          fill: mapMetric === 'totalUmkm' ? '#00f2fe' : mapMetric === 'growth' ? '#10b981' : mapMetric === 'opportunityScore' ? '#f59e0b' : '#ef4444', 
                          fontSize: '9px', 
                          fontWeight: '800', 
                          pointerEvents: 'none',
                          textShadow: '0px 1px 2px rgba(0,0,0,0.9)'
                        }} 
                        textAnchor="middle"
                      >
                        {mapMetric === 'totalUmkm' ? formatNumber(val) : mapMetric === 'growth' ? formatPercent(val) : val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Map Legend */}
            <div className="map-legend">
              <span className="map-legend-title">LEGEND ({mapMetric === 'totalUmkm' ? 'Total UMKM' : mapMetric})</span>
              {mapMetric === 'totalUmkm' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div className="legend-item"><div className="legend-color-dot" style={{ backgroundColor: '#f59e0b' }}></div><span>&gt; 7.000</span></div>
                  <div className="legend-item"><div className="legend-color-dot" style={{ backgroundColor: '#00f2fe' }}></div><span>4.000 - 7.000</span></div>
                  <div className="legend-item"><div className="legend-color-dot" style={{ backgroundColor: '#3b82f6' }}></div><span>2.000 - 4.000</span></div>
                  <div className="legend-item"><div className="legend-color-dot" style={{ backgroundColor: '#1d4ed8' }}></div><span>1.000 - 2.000</span></div>
                  <div className="legend-item"><div className="legend-color-dot" style={{ backgroundColor: '#172554' }}></div><span>&lt; 1.000</span></div>
                </div>
              ) : (
                <div className="gradient-bar-wrapper">
                  <span style={{ color: 'var(--text-muted)' }}>Rendah</span>
                  <div className="legend-gradient-bar"
                    style={{
                      background: mapMetric === 'growth' ? 'linear-gradient(to right, #172554, #10b981)' :
                                  mapMetric === 'opportunityScore' ? 'linear-gradient(to right, #172554, #f59e0b)' :
                                  'linear-gradient(to right, #172554, #ef4444)'
                    }}
                  />
                  <span style={{ color: '#fff' }}>Tinggi</span>
                </div>
              )}
            </div>

            {selectedKecamatan && (
              <button onClick={() => setSelectedKecamatan(null)} className="float-btn">
                Lihat Detail Peta
              </button>
            )}
          </div>
        </div>

        {/* Trend line */}
        <div 
          id="trend-chart"
          className={`glass-card p-5 ${highlightedChart === 'trend' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <div className="glass-card-header">
            <h3 className="glass-card-title">TREND TOTAL UMKM (2020-2024)</h3>
            <select
              value={trendView}
              onChange={(e) => setTrendView(e.target.value)}
              className="filter-select"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            {trendView === 'line' ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>

          <div className="trend-stats-row">
            <div className="trend-stat-card">
              <span className="trend-stat-lbl">Avg Growth 5Th</span>
              <span className="trend-stat-val" style={{ color: 'var(--primary)' }}>10.35%</span>
            </div>
            <div className="trend-stat-card">
              <span className="trend-stat-lbl">Growth Tertinggi</span>
              <span className="trend-stat-val" style={{ color: 'var(--success)' }}>2023 (18.34%)</span>
            </div>
            <div className="trend-stat-card">
              <span className="trend-stat-lbl">Growth Terendah</span>
              <span className="trend-stat-val" style={{ color: 'var(--warning)' }}>2021 (7.65%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table & Sector pie */}
      <div className="dashboard-two-col">
        {/* Table */}
        <div 
          id="table-chart"
          className={`glass-card p-5 ${highlightedChart === 'table' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <div className="glass-card-header">
            <div>
              <h3 className="glass-card-title">TOP 5 KECAMATAN BERDASARKAN INDIKATOR</h3>
              <p className="glass-card-subtitle">Klik baris kecamatan untuk menyaring wilayah</p>
            </div>

            <div className="table-header-tabs">
              {['totalUmkm', 'growth', 'opportunityScore', 'interventionScore'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTableTab(tab)}
                  className={`tab-pill ${tableTab === tab ? 'active' : ''}`}
                >
                  {tab === 'totalUmkm' ? 'Total UMKM' : 
                   tab === 'growth' ? 'Growth' : 
                   tab === 'opportunityScore' ? 'Opp Score' : 'Intervention'}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>Kecamatan</th>
                  <th style={{ textAlign: 'right' }}>Total UMKM</th>
                  <th style={{ textAlign: 'right' }}>Growth YoY</th>
                  <th style={{ textAlign: 'right' }}>Opp Score</th>
                  <th style={{ textAlign: 'right' }}>Intervention</th>
                </tr>
              </thead>
              <tbody>
                {sortedTableData.map((row, index) => {
                  const isFiltered = selectedKecamatan === row.kecamatan;
                  return (
                    <tr 
                      key={row.kecamatan} 
                      className={isFiltered ? 'filtered' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedKecamatan(isFiltered ? null : row.kecamatan)}
                    >
                      <td>
                        <span className={`rank-badge ${index === 0 ? 'rank-badge-1' : index === 1 ? 'rank-badge-2' : index === 2 ? 'rank-badge-3' : 'rank-badge-default'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td style={{ color: 'white', fontWeight: 'bold' }}>{row.kecamatan}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(row.totalUmkm)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 'bold' }}>{formatPercent(row.growth)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--warning)', fontWeight: 'bold' }}>{row.opportunityScore.toFixed(1)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 'bold' }}>{row.interventionScore.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Donut */}
        <div 
          id="sector-chart"
          className={`glass-card p-5 ${highlightedChart === 'sector' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <h3 className="glass-card-title">KOMPOSISI UMKM BERDASARKAN SEKTOR ({selectedYear})</h3>
          <p className="glass-card-subtitle">Distribusi jumlah UMKM berdasarkan kelompok usaha</p>

          <div className="donut-wrapper">
            <div className="donut-chart-container">
              <Doughnut data={donutChartData} options={donutChartOptions} />
              <div className="donut-inner-text">
                <span className="donut-val">{formatNumber(totalUmkmValue)}</span>
                <span className="donut-lbl">UMKM</span>
              </div>
            </div>

            <div className="donut-legend">
              {sectorData.map((s, idx) => (
                <div key={s.name} className="legend-row">
                  <div className="legend-lbl-col">
                    <div className="legend-color-circle" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }} />
                    <span className="legend-lbl-txt">{s.name}</span>
                  </div>
                  <div className="legend-val-col">
                    <span className="legend-val-num">{formatNumber(s.value)}</span>
                    <span>({formatPercent(s.percentage)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Macro metrics */}
      <div 
        id="macro-metrics"
        className={`macro-grid-row ${highlightedChart === 'macro' ? 'highlight-active' : ''}`}
        onClick={() => setHighlightedChart(null)}
      >
        <div className="glass-card macro-card">
          <span className="macro-card-lbl">PDRB Batam ({selectedYear})</span>
          <h4 className="macro-card-val">{formatCurrencyTrillion(macroYear.pdrb_current_trillion_idr)}</h4>
          <span className="macro-card-change" style={{ color: 'var(--success)' }}>▲ 6.04% vs 2023</span>
        </div>

        <div className="glass-card macro-card">
          <span className="macro-card-lbl">PDRB per Kapita</span>
          <h4 className="macro-card-val">{formatCurrencyMillion(181.05)}</h4>
          <span className="macro-card-change" style={{ color: 'var(--success)' }}>▲ 5.02% vs 2023</span>
        </div>

        <div className="glass-card macro-card">
          <span className="macro-card-lbl">IPM Batam ({selectedYear})</span>
          <h4 className="macro-card-val">{(macroYear.ipm || 83.32).toFixed(2)}</h4>
          <span className="macro-card-change" style={{ color: 'var(--primary)' }}>Sangat Tinggi</span>
        </div>

        <div className="glass-card macro-card">
          <span className="macro-card-lbl">Tingkat Kemiskinan</span>
          <h4 className="macro-card-val">{formatPercent(macroYear.poverty_rate_pct || 4.85)}</h4>
          <span className="macro-card-change" style={{ color: 'var(--success)' }}>▼ 0.27% vs 2023</span>
        </div>

        <div className="glass-card macro-card">
          <span className="macro-card-lbl">Koperasi Aktif</span>
          <h4 className="macro-card-val">{formatNumber(totalCoopActive)} Unit</h4>
          <span className="macro-card-change" style={{ color: 'var(--success)' }}>▲ 5.03% vs 2023</span>
        </div>

        <div className="glass-card macro-card">
          <span className="macro-card-lbl">Program Aktif ({selectedYear})</span>
          <h4 className="macro-card-val">6 Program</h4>
          <span className="macro-card-change" style={{ color: 'var(--primary)' }}>12 Kecamatan</span>
        </div>
      </div>
    </div>
  );
}
