import React from 'react';

export default function Navbar({ activeTab, setActiveTab, pol201Action, onInstallPwa, canInstall }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 border-bottom border-secondary sticky-top px-3 mb-3">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info" href="#dashboard" onClick={() => setActiveTab('dashboard')}>
          <i className="bi bi-shield-lock-fill fs-4 text-cyan"></i>
          <span>군 사이버위협 관제 PWA</span>
        </a>

        <div className="d-flex align-items-center gap-3">
          {pol201Action === 'ALLOW' && (
            <span className="pulse-red-badge cursor-pointer" onClick={() => setActiveTab('sop')}>
              POL-201 긴급 대응 필요 (3대 호스트)
            </span>
          )}

          {canInstall && (
            <button className="btn btn-outline-cyan btn-sm d-flex align-items-center gap-1" onClick={onInstallPwa}>
              <i className="bi bi-download"></i>
              <span>앱 설치</span>
            </button>
          )}

          <span className="badge bg-secondary font-monospace">VERCEL READY</span>
        </div>
      </div>
    </nav>
  );
}
