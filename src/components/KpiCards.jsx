import React from 'react';
import { SUMMARY_STATS } from '../services/mockDataService.js';

export default function KpiCards({ pol201Action }) {
  return (
    <div className="row g-3 mb-4">
      {/* Total Traffic */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="cyber-card p-3 d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">총 로그 분석 건수</div>
            <div className="fs-3 fw-bold text-white mt-1">{SUMMARY_STATS.totalEvents.toLocaleString()}건</div>
            <div className="small text-info mt-1"><i className="bi bi-clock-history me-1"></i>00:00~06:40 (KST)</div>
          </div>
          <div className="fs-1 text-info opacity-75"><i className="bi bi-bar-chart-steps"></i></div>
        </div>
      </div>

      {/* Normal Traffic */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="cyber-card p-3 d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">정상 업무 트래픽</div>
            <div className="fs-3 fw-bold text-success mt-1">{SUMMARY_STATS.normalCount.toLocaleString()}건</div>
            <div className="small text-success mt-1">전체 트래픽의 {SUMMARY_STATS.normalRatio}</div>
          </div>
          <div className="fs-1 text-success opacity-75"><i className="bi bi-shield-check"></i></div>
        </div>
      </div>

      {/* Blocked Attacks */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="cyber-card p-3 d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">차단된 공격 트래픽</div>
            <div className="fs-3 fw-bold text-warning mt-1">{SUMMARY_STATS.blockedCount.toLocaleString()}건</div>
            <div className="small text-warning mt-1">스캔/무차별대입/DDoS ({SUMMARY_STATS.blockedRatio})</div>
          </div>
          <div className="fs-1 text-warning opacity-75"><i className="bi bi-shield-x"></i></div>
        </div>
      </div>

      {/* Emergency C2 Alert */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className={`cyber-card p-3 d-flex align-items-center justify-content-between ${pol201Action === 'ALLOW' ? 'border-danger' : ''}`}>
          <div>
            <div className="text-muted small">C2 긴급 유출 트래픽</div>
            <div className={`fs-3 fw-bold mt-1 ${pol201Action === 'ALLOW' ? 'text-danger' : 'text-success'}`}>
              {SUMMARY_STATS.criticalCount.toLocaleString()}건
            </div>
            <div className={`small mt-1 ${pol201Action === 'ALLOW' ? 'text-danger fw-bold' : 'text-success'}`}>
              {pol201Action === 'ALLOW' ? '🚨 ALLOW (긴급 차단 필요)' : '✅ DENY (차단 완료)'}
            </div>
          </div>
          <div className={`fs-1 opacity-75 ${pol201Action === 'ALLOW' ? 'text-danger' : 'text-success'}`}>
            <i className={pol201Action === 'ALLOW' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-check-circle-fill'}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
