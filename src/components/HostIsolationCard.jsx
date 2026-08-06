import React from 'react';

export default function HostIsolationCard({ host, onIsolate, onRestore }) {
  const isIsolated = host.status === 'ISOLATED';

  return (
    <div className={`cyber-card p-3 mb-3 ${isIsolated ? 'border-danger' : 'border-success'}`}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className={`fs-2 ${isIsolated ? 'text-danger' : 'text-success'}`}>
            <i className={isIsolated ? 'bi bi-pc-horizontal text-danger' : 'bi bi-pc-display text-success'}></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="m-0 text-white fw-bold">{host.name} ({host.ip})</h6>
              <span className={`badge ${isIsolated ? 'bg-danger pulse-red-badge' : 'bg-success'}`}>
                {isIsolated ? '🚫 격리됨 (ISOLATED)' : '✅ 정상 연결 (RESTORED)'}
              </span>
            </div>
            <div className="small text-muted mt-1">
              Tor Port 9001: <strong className="text-warning">{host.port9001}건</strong> | 
              Metasploit Port 4444: <strong className="text-warning">{host.port4444}건</strong> | 
              평균 대비 패킷: <strong className="text-danger">{host.multiplier}</strong>
            </div>
          </div>
        </div>

        <div>
          {isIsolated ? (
            <button className="btn btn-outline-success btn-sm font-monospace" onClick={() => onRestore(host.ip)}>
              <i className="bi bi-arrow-counterclockwise me-1"></i>격리 해제
            </button>
          ) : (
            <button className="btn btn-danger btn-sm font-monospace fw-bold" onClick={() => onIsolate(host.ip)}>
              <i className="bi bi-slash-circle me-1"></i>즉시 격리
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
