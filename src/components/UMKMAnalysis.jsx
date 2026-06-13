import React from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Cpu, Activity } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom Gauge Component
function GaugeChart({ value, target, title, color = '#00f2fe' }) {
  const radius = 70;
  const cx = 100;
  const cy = 90;
  const strokeLength = Math.PI * radius;
  const fillOffset = strokeLength - (Math.min(value, 100) / 100) * strokeLength;
  
  const targetAngleRad = (180 - (target / 100) * 180) * (Math.PI / 180);
  const tx1 = cx + (radius - 8) * Math.cos(targetAngleRad);
  const ty1 = cy - (radius - 8) * Math.sin(targetAngleRad);
  const tx2 = cx + (radius + 8) * Math.cos(targetAngleRad);
  const ty2 = cy - (radius + 8) * Math.sin(targetAngleRad);

  return (
    <div className="flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <h4 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px', marginBottom: '8px', textAlign: 'center' }}>
        {title}
      </h4>
      <div style={{ position: 'relative', width: '180px', height: '110px' }}>
        <svg viewBox="0 0 200 110" style={{ width: '100%', height: '100%' }}>
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0,1 ${cx + radius},${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0,1 ${cx + radius},${cy}`}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={strokeLength}
            strokeDashoffset={fillOffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#040d1e" strokeWidth="3" />
          <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#ffffff" strokeWidth="1.5" />
          <text 
            x={tx2 + (targetAngleRad > Math.PI/2 ? -18 : 6)} 
            y={ty2 - 2} 
            style={{ fill: 'var(--text-muted)', fontSize: '8px', fontWeight: '800' }}
          >
            {target}
          </text>
          <text x={cx - radius} y={cy + 15} style={{ fill: 'var(--text-muted)', fontSize: '8px', fontWeight: 'bold' }} textAnchor="middle">0.00</text>
          <text x={cx + radius} y={cy + 15} style={{ fill: 'var(--text-muted)', fontSize: '8px', fontWeight: 'bold' }} textAnchor="middle">100</text>
        </svg>
        <div style={{ position: 'absolute', bottom: '4px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>{value.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function UMKMAnalysis({
  data,
  selectedYear,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedSector,
  highlightedChart,
  setHighlightedChart
}) {
  
  const formatNumber = (num) => {
    if (num == null) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  // --- FILTER DATA ---
  const umkmYear = selectedYear === 'All'
    ? data.fact_umkm_kecamatan_sector
    : data.fact_umkm_kecamatan_sector.filter(r => r.year === selectedYear);
  let filteredRows = umkmYear;
  if (selectedKecamatan) filteredRows = filteredRows.filter(r => r.kecamatan === selectedKecamatan);
  if (selectedSector) filteredRows = filteredRows.filter(r => r.sector_name === selectedSector);

  // --- KPI GAUGE AVERAGES ---
  const totalCount = filteredRows.reduce((acc, r) => acc + (r.umkm_count || 0), 0);
  
  const avgDigitalAdoption = selectedYear === 'All'
    ? (filteredRows.reduce((acc, r) => acc + (r.digital_adoption_pct || 0), 0) / (filteredRows.length || 1))
    : (totalCount > 0 ? filteredRows.reduce((acc, r) => acc + ((r.digital_adoption_pct || 0) * (r.umkm_count || 0)), 0) / totalCount : 0);

  const avgFormalization = selectedYear === 'All'
    ? (filteredRows.reduce((acc, r) => acc + (r.formalization_rate_pct || 0), 0) / (filteredRows.length || 1))
    : (totalCount > 0 ? filteredRows.reduce((acc, r) => acc + ((r.formalization_rate_pct || 0) * (r.umkm_count || 0)), 0) / totalCount : 0);

  // --- BAR CHART DATA ---
  const kecUmkmMap = umkmYear.reduce((acc, r) => {
    if (selectedSector && r.sector_name !== selectedSector) return acc;
    const kName = r.kecamatan;
    if (!acc[kName]) acc[kName] = 0;
    acc[kName] += (r.umkm_count || 0);
    return acc;
  }, {});

  const barChartRaw = Object.entries(kecUmkmMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const barChartData = {
    labels: barChartRaw.map(d => d.name),
    datasets: [
      {
        label: 'Total UMKM',
        data: barChartRaw.map(d => d.value),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => `Total UMKM: ${formatNumber(context.parsed.x)}`
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } },
      y: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 } } }
    }
  };

  // --- SCATTER CHART DATA ---
  const kecScatterMap = umkmYear.reduce((acc, r) => {
    const kName = r.kecamatan;
    if (!acc[kName]) {
      acc[kName] = {
        kecamatan: kName,
        totalUmkm: 0,
        employment: 0,
        revenue: 0
      };
    }
    acc[kName].totalUmkm += (r.umkm_count || 0);
    acc[kName].employment += (r.employment_est || 0);
    acc[kName].revenue += (r.estimated_revenue_million_idr || 0);
    return acc;
  }, {});

  const scatterData = Object.values(kecScatterMap);

  const KECAMATAN_COLORS = {
    'Batam Kota': '#00f2fe',
    'Sekupang': '#3b82f6',
    'Batu Ampar': '#a855f7',
    'Lubuk Baja': '#ec4899',
    'Batu Aji': '#f43f5e',
    'Bengkong': '#ef4444',
    'Nongsa': '#f59e0b',
    'Sungai Beduk': '#10b981',
    'Sagulung': '#84cc16',
    'Belakang Padang': '#06b6d4',
    'Galang': '#6366f1',
    'Bulang': '#64748b'
  };

  const scatterChartData = {
    datasets: scatterData.map(d => ({
      label: d.kecamatan,
      data: [{
        x: d.employment,
        y: d.totalUmkm,
        revenue: d.revenue
      }],
      backgroundColor: KECAMATAN_COLORS[d.kecamatan] || '#00f2fe',
      borderColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      pointRadius: Math.max(6, Math.min(d.revenue / 28000, 26)), // dynamic bubble sizing based on revenue
      pointHoverRadius: Math.max(8, Math.min(d.revenue / 28000, 28))
    }))
  };

  const scatterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#091529',
        callbacks: {
          label: (context) => {
            const raw = context.raw;
            return [
              `Kecamatan: ${context.dataset.label}`,
              `Jumlah Pekerja: ${formatNumber(raw.x)}`,
              `Jumlah UMKM: ${formatNumber(raw.y)} unit`,
              `Estimasi Pendapatan: Rp ${(raw.revenue / 1000).toFixed(1)} Miliar`
            ];
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 }, callback: (val) => `${val/1000}K` },
        title: { display: true, text: 'Jumlah Pekerja (Employment)', color: '#64748b', font: { family: 'Outfit', size: 9 } }
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 9 }, callback: (val) => `${val/1000}K` },
        title: { display: true, text: 'Jumlah UMKM', color: '#64748b', font: { family: 'Outfit', size: 9 } }
      }
    }
  };

  return (
    <div className={`page-container ${highlightedChart ? 'has-highlight' : ''}`}>
      {/* Gauges section */}
      <div 
        id="gauges-section"
        className={`dashboard-two-col ${highlightedChart === 'gauges' ? 'highlight-active' : ''}`}
        onClick={() => setHighlightedChart(null)}
      >
        <div className="glass-card flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '12px' }}>
            <Cpu size={14} />
            <span>Digital Digitalization</span>
          </div>
          <GaugeChart 
            value={avgDigitalAdoption} 
            target={80} 
            title="Avg Digital Adoption, Target and Target Adoption" 
            color="#00f2fe"
          />
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', marginTop: '4px' }}>
            Adopsi teknologi digital untuk mendukung e-commerce, POS kasir, dan pembayaran QRIS.
          </p>
        </div>

        <div className="glass-card flex-col-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 'bold', fontSize: '12px' }}>
            <Activity size={14} />
            <span>Usaha Formal</span>
          </div>
          <GaugeChart 
            value={avgFormalization} 
            target={90} 
            title="Avg Formalization, Target and Target Formalization" 
            color="#a855f7"
          />
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', marginTop: '4px' }}>
            Legalitas formal kepemilikan izin edar, sertifikasi halal, dan Nomor Induk Berusaha (NIB).
          </p>
        </div>
      </div>

      {/* Bar and Scatter plots */}
      <div className="dashboard-two-col">
        {/* Left Side: Horizontal Bar */}
        <div 
          id="bar-kecamatan-chart"
          className={`glass-card p-5 ${highlightedChart === 'bar-kecamatan' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <h3 className="glass-card-title">Total UMKM by kecamatan</h3>
          <p className="glass-card-subtitle">Urutan total unit UMKM di setiap wilayah kecamatan</p>

          <div style={{ height: '330px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Right Side: Scatter Chart */}
        <div 
          id="scatter-chart"
          className={`glass-card p-5 ${highlightedChart === 'scatter' ? 'highlight-active' : ''}`}
          onClick={() => setHighlightedChart(null)}
        >
          <h3 className="glass-card-title">Total Employment, Total UMKM and Total Revenue by kecamatan</h3>
          <p className="glass-card-subtitle">X: Pekerja, Y: Unit UMKM, Ukuran Bubble: Estimasi Omset</p>

          <div style={{ height: '280px', width: '100%', position: 'relative', marginTop: '16px' }}>
            <Scatter data={scatterChartData} options={scatterChartOptions} />
          </div>

          {/* Scatter Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '16px', maxHeight: '60px', overflowY: 'auto' }}>
            {scatterData.map((d) => (
              <div 
                key={d.kecamatan} 
                className={`legend-row ${selectedKecamatan === d.kecamatan ? 'font-bold' : ''}`}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px' }}
                onClick={() => setSelectedKecamatan(selectedKecamatan === d.kecamatan ? null : d.kecamatan)}
              >
                <div className="legend-color-circle" style={{ backgroundColor: KECAMATAN_COLORS[d.kecamatan] || '#00f2fe', width: '6px', height: '6px' }} />
                <span style={{ color: selectedKecamatan === d.kecamatan ? 'white' : 'var(--text-secondary)' }}>{d.kecamatan}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
