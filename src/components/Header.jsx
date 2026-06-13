import React from 'react';
import { Bell, Sun, Moon, Calendar } from 'lucide-react';

export default function Header({
  selectedYear,
  setSelectedYear,
  yearsList,
  selectedKecamatan,
  setSelectedKecamatan,
  kecamatanList,
  selectedSector,
  setSelectedSector,
  sectorList,
  theme,
  toggleTheme,
  onResetFilters
}) {
  return (
    <header className="header-container">
      {/* Title & Subtitle */}
      <div className="header-title-section">
        <h2 className="header-title">
          BATAM UMKM GROWTH COMMAND CENTER
        </h2>
        <p className="header-subtitle">
          Data Driven Decision for UMKM Development in Batam City
        </p>
      </div>

      {/* Filters & Right Actions */}
      <div className="header-actions">
        {/* Slicers / Filters */}
        <div className="filters-wrapper">
          {/* Year Filter */}
          <div className="filter-group">
            <span className="filter-label">Tahun</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="filter-select"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>{y === 'All' ? '(All)' : y}</option>
              ))}
            </select>
          </div>

          {/* Kecamatan Filter */}
          <div className="filter-group">
            <span className="filter-label">Kecamatan</span>
            <select
              value={selectedKecamatan || 'All'}
              onChange={(e) => setSelectedKecamatan(e.target.value === 'All' ? null : e.target.value)}
              className="filter-select"
            >
              <option value="All">(All)</option>
              {kecamatanList.map((k) => (
                <option key={k.kecamatan_id || k} value={k.kecamatan || k}>
                  {k.kecamatan || k}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div className="filter-group">
            <span className="filter-label">Sektor</span>
            <select
              value={selectedSector || 'All'}
              onChange={(e) => setSelectedSector(e.target.value === 'All' ? null : e.target.value)}
              className="filter-select"
            >
              <option value="All">(All)</option>
              {sectorList.map((s) => (
                <option key={s.sector_id || s} value={s.sector_name || s}>
                  {s.sector_name || s}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedKecamatan || selectedSector) && (
            <button onClick={onResetFilters} className="clear-btn">
              CLEAR
            </button>
          )}
        </div>

        {/* Date Last Updated & Icons */}
        <div className="header-meta">
          {/* Last Updated */}
          <div className="last-updated">
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <div className="updated-details">
              <span className="updated-lbl">Data Terakhir</span>
              <span className="updated-val">18 Mei 2025 10:30 WIB</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={14} />
          </button>

          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Profile Widget */}
          <div className="user-profile-widget">
            <div className="user-avatar">
              AN
            </div>
            <div className="user-details">
              <span className="user-name">Analyst</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
