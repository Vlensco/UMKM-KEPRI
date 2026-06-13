import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';

export default function ProgramRecommendation({
  data,
  selectedYear,
  selectedKecamatan,
  setSelectedKecamatan
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedKecamatan]);
  
  const formatNumber = (num) => {
    if (num == null) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  const formatCurrency = (num) => {
    if (num == null) return 'Rp 0';
    if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(2)} Miliar`;
    if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(1)} Juta`;
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  // --- FILTER DATA ---
  const programsList = data.dim_program;

  let priorityRows = selectedYear === 'All'
    ? data.fact_program_priority
    : data.fact_program_priority.filter(r => r.year === selectedYear);
  if (selectedKecamatan) {
    priorityRows = priorityRows.filter(r => r.kecamatan === selectedKecamatan);
  }

  const sortedPriorities = [...priorityRows].sort((a, b) => b.relevance_score - a.relevance_score);
  const totalPages = Math.ceil(sortedPriorities.length / pageSize);
  const paginatedPriorities = sortedPriorities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          REKOMENDASI PROGRAM & PRIORITAS INTERVENSI
        </h3>
        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Pemetaan prioritas alokasi program pendampingan UMKM berbasis kecamatan dan skor tingkat relevansi kebutuhan
        </p>
      </div>

      {/* Catalog Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {programsList.map((prog) => (
          <div 
            key={prog.program_id} 
            className="glass-card"
            style={{
              padding: '20px',
              borderLeft: '4px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(0, 242, 254, 0.15)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {prog.program_category}
                </span>
                <Award size={14} style={{ color: 'var(--primary)' }} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{prog.program_name}</h4>
              <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>{prog.program_description}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', marginTop: 'auto' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Alokasi Dana:</span>
              <span style={{ color: 'white', fontWeight: '800' }}>{formatCurrency(prog.cost_per_beneficiary_idr)} / Org</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table priorities */}
      <div className="glass-card p-5">
        <h3 className="glass-card-title">
          Tingkat Relevansi Program {selectedKecamatan ? `di Kecamatan ${selectedKecamatan}` : 'Kota Batam'}
        </h3>
        <p className="glass-card-subtitle" style={{ marginBottom: '16px' }}>Pemeringkatan program pendampingan berdasarkan urgensi dan total target penerima</p>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Kecamatan</th>
                <th>Nama Program</th>
                <th style={{ textAlign: 'right' }}>Urgensi Relevansi</th>
                <th style={{ textAlign: 'right' }}>Target Penerima</th>
                <th style={{ textAlign: 'right' }}>Alokasi Anggaran</th>
                <th style={{ textAlign: 'right' }}>Estimasi Sukses (UMKM)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPriorities.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ color: 'white', fontWeight: 'bold' }}>{row.kecamatan}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row.program_name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span 
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '800',
                        backgroundColor: row.relevance_score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: row.relevance_score >= 80 ? 'var(--success)' : 'var(--warning)',
                        border: row.relevance_score >= 80 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      {row.relevance_score.toFixed(1)} / 100
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'white' }}>{formatNumber(row.target_beneficiaries)} Org</td>
                  <td style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: 'bold' }}>{formatCurrency(row.budget_idr)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--secondary)', fontWeight: 'bold' }}>{formatNumber(row.estimated_successful_umkm)} Unit</td>
                </tr>
              ))}
              {sortedPriorities.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '24px' }}>
                    Tidak ditemukan data relevansi program untuk kriteria penyaringan aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '20px', 
          flexWrap: 'wrap', 
          gap: '12px', 
          paddingTop: '16px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.06)' 
        }}>
          {/* Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="filter-select"
              style={{ padding: '4px 8px', minWidth: '60px' }}
            >
              {[10, 25, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>data per halaman</span>
          </div>

          {/* Info text */}
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Menampilkan {sortedPriorities.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, sortedPriorities.length)} dari {sortedPriorities.length} data
          </div>

          {/* Page numbers */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="icon-btn"
                style={{ width: 'auto', padding: '0 8px', fontSize: '10px', height: '26px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Sebelumnya
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`icon-btn ${currentPage === p ? 'active' : ''}`}
                  style={{ 
                    width: '26px', 
                    height: '26px', 
                    fontSize: '11px',
                    backgroundColor: currentPage === p ? 'rgba(0, 242, 254, 0.15)' : undefined,
                    borderColor: currentPage === p ? 'var(--primary)' : undefined,
                    color: currentPage === p ? 'var(--primary)' : undefined
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="icon-btn"
                style={{ width: 'auto', padding: '0 8px', fontSize: '10px', height: '26px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
