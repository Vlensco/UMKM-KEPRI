import React from 'react';
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
import { Briefcase, Cpu, Users, Coins } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SectorAnalysis({
  data,
  selectedYear,
  selectedSector,
  setSelectedSector
}) {
  
  const formatNumber = (num) => {
    if (num == null) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  const formatCurrency = (num) => {
    if (num == null) return 'Rp 0';
    if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(2)} Miliar`;
    return `Rp ${(num / 1e6).toFixed(1)} Juta`;
  };

  // --- FILTER DATA ---
  const factUmkmYear = selectedYear === 'All'
    ? data.fact_umkm_kecamatan_sector
    : data.fact_umkm_kecamatan_sector.filter(r => r.year === selectedYear);

  // Group by sector
  const sectorMap = factUmkmYear.reduce((acc, r) => {
    const sName = r.sector_name;
    const sId = r.sector_id;
    if (!acc[sName]) {
      acc[sName] = {
        name: sName,
        id: sId,
        umkmCount: 0,
        employment: 0,
        revenue: 0
      };
    }
    acc[sName].umkmCount += (r.umkm_count || 0);
    acc[sName].employment += (r.employment_est || 0);
    acc[sName].revenue += (r.estimated_revenue_million_idr || 0);
    return acc;
  }, {});

  const sectorsList = data.dim_sector;

  const combinedSectorData = sectorsList.map(s => {
    const aggregates = sectorMap[s.sector_name] || { umkmCount: 0, employment: 0, revenue: 0 };
    return {
      ...s,
      ...aggregates
    };
  }).sort((a, b) => b.umkmCount - a.umkmCount);

  // --- CHART 1: UMKM per Sektor ---
  const umkmChartData = {
    labels: combinedSectorData.map(d => d.sector_name),
    datasets: [
      {
        label: 'Jumlah UMKM',
        data: combinedSectorData.map(d => d.umkmCount),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  };

  const umkmChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Total: ${formatNumber(context.parsed.y)} unit`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 8 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  // --- CHART 2: Omset per Sektor ---
  const revenueChartData = {
    labels: combinedSectorData.map(d => d.sector_name),
    datasets: [
      {
        label: 'Estimasi Omset',
        data: combinedSectorData.map(d => d.revenue),
        backgroundColor: '#a855f7',
        borderRadius: 4
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Omset: ${formatCurrency(context.parsed.y * 1e6)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 8 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ANALISIS DETIL SEKTOR BISNIS
        </h3>
        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Pemetaan pertumbuhan, omset, dan tingkat adopsi teknologi digital per sektor industri UMKM
        </p>
      </div>

      {/* Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {combinedSectorData.map((s) => {
          const isSelected = selectedSector === s.sector_name;
          return (
            <div 
              key={s.sector_id}
              onClick={() => setSelectedSector(isSelected ? null : s.sector_name)}
              className={`glass-card ${isSelected ? 'highlight-active' : ''}`}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: isSelected ? '4px solid var(--primary)' : '4px solid rgba(255, 255, 255, 0.04)',
                backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.03)' : undefined
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(0, 242, 254, 0.15)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {s.sector_group || 'Umum'}
                  </span>
                  <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>{s.sector_name}</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /> Unit Usaha</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{formatNumber(s.umkmCount)} Unit</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Coins size={12} /> Estimasi Omset</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{formatCurrency(s.revenue * 1e6)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={12} /> Digitalisasi Awal</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{s.digital_base_pct}%</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Default Program:</span>
                <p style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600', marginTop: '4px', lineHeight: '1.4' }}>{s.default_program}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Performance Charts */}
      <div className="dashboard-two-col">
        <div className="glass-card p-5">
          <h3 className="glass-card-title">Jumlah UMKM per Sektor</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Bar data={umkmChartData} options={umkmChartOptions} />
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="glass-card-title">Kontribusi Omset per Sektor (Juta Rp)</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Bar data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
