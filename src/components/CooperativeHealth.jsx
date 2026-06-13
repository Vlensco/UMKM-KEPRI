import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ShieldCheck, Heart, ShieldAlert, Award } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CooperativeHealth({
  data,
  selectedYear,
  selectedKecamatan,
  setSelectedKecamatan,
  highlightedChart,
  setHighlightedChart
}) {
  const [selectedSemester, setSelectedSemester] = useState('All');

  const formatNumber = (num) => {
    if (num == null) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  const formatPercent = (num) => {
    if (num == null || isNaN(num)) return '0%';
    return (num * 100).toFixed(1) + '%';
  };

  // --- FILTER DATA ---
  let kopRows = selectedYear === 'All'
    ? data.fact_koperasi_kecamatan
    : data.fact_koperasi_kecamatan.filter(r => r.year === selectedYear);
  if (selectedSemester !== 'All') {
    kopRows = kopRows.filter(r => r.semester === selectedSemester);
  }

  let filteredKop = kopRows;
  if (selectedKecamatan) {
    filteredKop = filteredKop.filter(r => r.kecamatan === selectedKecamatan);
  }

  const totalActive = filteredKop.reduce((acc, r) => acc + (r.active_cooperative || 0), 0);
  const totalInactive = filteredKop.reduce((acc, r) => acc + (r.inactive_cooperative || 0), 0);
  const totalCooperative = filteredKop.reduce((acc, r) => acc + (r.total_cooperative || 0), 0);
  const activeRatio = totalCooperative > 0 ? totalActive / totalCooperative : 0;

  // --- CHART DATA PREPARATIONS ---
  const kecGroupMap = kopRows.reduce((acc, r) => {
    const kName = r.kecamatan;
    if (!acc[kName]) {
      acc[kName] = {
        name: kName,
        active: 0,
        inactive: 0,
        total: 0
      };
    }
    acc[kName].active += (r.active_cooperative || 0);
    acc[kName].inactive += (r.inactive_cooperative || 0);
    acc[kName].total += (r.total_cooperative || 0);
    return acc;
  }, {});

  const chartData = Object.values(kecGroupMap).map(k => ({
    ...k,
    activeRatio: k.total > 0 ? k.active / k.total : 0
  })).sort((a, b) => b.total - a.total);

  // Clustered Column Chart (Active vs Total)
  const statusChartData = {
    labels: chartData.map(d => d.name),
    datasets: [
      {
        label: 'Total Aktif',
        data: chartData.map(d => d.active),
        backgroundColor: '#3b82f6',
        borderRadius: 3
      },
      {
        label: 'Sum of total_cooperative',
        data: chartData.map(d => d.total),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderRadius: 3
      }
    ]
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 9, weight: 'bold' } }
      },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatNumber(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  // Inactive Horizontal Bar Chart
  const inactiveData = [...chartData].sort((a, b) => b.inactive - a.inactive);
  const inactiveChartData = {
    labels: inactiveData.map(d => d.name),
    datasets: [
      {
        label: 'Tidak Aktif',
        data: inactiveData.map(d => d.inactive),
        backgroundColor: '#ef4444',
        borderRadius: 3
      }
    ]
  };

  const inactiveChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Tidak Aktif: ${formatNumber(context.parsed.x)}`
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  // Active Ratio Chart
  const ratioData = [...chartData].sort((a, b) => b.activeRatio - a.activeRatio);
  const ratioChartData = {
    labels: ratioData.map(d => d.name),
    datasets: [
      {
        label: 'Active Ratio',
        data: ratioData.map(d => d.activeRatio),
        backgroundColor: '#10b981',
        borderRadius: 3
      }
    ]
  };

  const ratioChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Active Ratio: ${formatPercent(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.04)' }, 
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 }, callback: (val) => `${(val*100).toFixed(0)}%` } 
      }
    }
  };

  return (
    <div className={`page-container ${highlightedChart ? 'has-highlight' : ''}`}>
      {/* Semester filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ANALISIS KOPERASI SEKTORAL
          </h3>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Evaluasi kesehatan usaha Koperasi terdaftar di Kota Batam
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Semester:</span>
          <div className="table-header-tabs">
            {['All', 'Semester 1'].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`tab-pill ${selectedSemester === sem ? 'active' : ''}`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedYear === 2024 && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          backgroundColor: 'rgba(245, 158, 11, 0.1)', 
          border: '1px solid rgba(245, 158, 11, 0.25)', 
          color: 'var(--warning)', 
          fontSize: '11px', 
          lineHeight: '1.5' 
        }}>
          💡 <strong>Informasi Data Koperasi 2024:</strong> Publikasi resmi Satu Data Batam untuk tahun 2024 hanya memuat jumlah <strong>Koperasi Aktif</strong> (Semester 1) dan tidak memuat data Koperasi Tidak Aktif (kosong/NaN). Hal ini menyebabkan rasio keaktifan terhitung 100% dan grafik tidak aktif terlihat kosong. Untuk melihat analisis koperasi dengan data tidak aktif yang lengkap, silakan pilih tahun <strong>2023</strong> atau <strong>2025</strong>.
        </div>
      )}

      {/* 1. KPIs */}
      <div 
        id="coop-kpis"
        className={`kpi-grid ${highlightedChart === 'coop-kpi' ? 'highlight-active' : ''}`}
        onClick={() => setHighlightedChart(null)}
      >
        <div className="glass-card kpi-card border-cyan">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">Active Ratio</span>
            <Heart size={15} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{activeRatio.toFixed(2)}</h3>
            <span className="kpi-card-unit">Rasio Keaktifan</span>
          </div>
        </div>

        <div className="glass-card kpi-card border-green">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">Total Aktif</span>
            <ShieldCheck size={15} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatNumber(totalActive)}</h3>
            <span className="kpi-card-unit">Koperasi Aktif</span>
          </div>
        </div>

        <div className="glass-card kpi-card border-rose">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">Total Tidak Aktif</span>
            <ShieldAlert size={15} style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatNumber(totalInactive)}</h3>
            <span className="kpi-card-unit">Koperasi Mati / Beku</span>
          </div>
        </div>

        <div className="glass-card kpi-card border-purple">
          <div className="kpi-card-header">
            <span className="kpi-card-lbl">Total Koperasi</span>
            <Award size={15} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <h3 className="kpi-card-val">{formatNumber(totalCooperative)}</h3>
            <span className="kpi-card-unit">Koperasi Terdaftar</span>
          </div>
        </div>
      </div>

      {/* 2. Clustered Column & Inactive Horizontal Bar */}
      <div className="dashboard-two-col">
        {/* Clustered Columns */}
        <div 
          id="coop-status-chart"
          className={`glass-card p-5 ${highlightedChart === 'coop-status' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <h3 className="glass-card-title">Total Aktif and Sum of total_cooperative by kecamatan</h3>
          <p className="glass-card-subtitle">Perbandingan koperasi operasional aktif vs total terdaftar</p>

          <div style={{ height: '280px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Bar data={statusChartData} options={statusChartOptions} />
          </div>
        </div>

        {/* Inactive horizontal */}
        <div 
          id="coop-inactive-chart"
          className={`glass-card p-5 ${highlightedChart === 'coop-inactive' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <h3 className="glass-card-title">Total Tidak Aktif by kecamatan</h3>
          <p className="glass-card-subtitle">Sebaran unit koperasi mati atau tidak aktif di setiap kecamatan</p>

          <div style={{ height: '280px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Bar data={inactiveChartData} options={inactiveChartOptions} />
          </div>
        </div>
      </div>

      {/* 3. Active ratio chart */}
      <div 
        id="coop-ratio-chart"
        className={`glass-card p-5 ${highlightedChart === 'coop-ratio' ? 'highlight-active' : ''}`}
        onClick={() => setHighlightedChart(null)}
      >
        <h3 className="glass-card-title">Active Ratio by kecamatan</h3>
        <p className="glass-card-subtitle">Persentase rasio koperasi aktif terhadap total unit terdaftar</p>

        <div style={{ height: '220px', width: '100%', position: 'relative', marginTop: '16px' }}>
          <Bar data={ratioChartData} options={ratioChartOptions} />
        </div>
      </div>
    </div>
  );
}
