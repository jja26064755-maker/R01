import React from 'react';
import KpiCards from '../components/KpiCards.jsx';
import TrafficCharts from '../components/TrafficCharts.jsx';
import EmergencyBanner from '../components/EmergencyBanner.jsx';
import { PORT_SCAN_HOSTS, OUTBOUND_DDOS_TARGETS } from '../services/mockDataService.js';

export default function DashboardPage({ policies, pol201Action, onNavigateToSop }) {
  return (
    <div>
      <EmergencyBanner pol201Action={pol201Action} onNavigateToSop={onNavigateToSop} />
      <KpiCards pol201Action={pol201Action} />
      <TrafficCharts policies={policies} />

      {/* Overview Threat Highlights Row */}
      <div className="row g-3">
        {/* Port Scan Highlights */}
        <div className="col-12 col-lg-6">
          <div className="cyber-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-warning m-0"><i className="bi bi-radar me-2"></i>포트 스캔 정찰 주요 호스트 (5개)</h6>
              <span className="badge badge-pol-scan">17,981건 DENY</span>
            </div>
            <div className="table-responsive">
              <table className="table table-cyber table-sm mb-0">
                <thead>
                  <tr>
                    <th>출발지 IP</th>
                    <th>탐색 포트</th>
                    <th>접속 시도</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {PORT_SCAN_HOSTS.map((h, idx) => (
                    <tr key={idx}>
                      <td className="font-monospace text-warning">{h.ip}</td>
                      <td>~{h.scannedPorts}개</td>
                      <td>{h.targetCount}회</td>
                      <td><span className="badge bg-warning text-dark">{h.action}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DDoS Target Highlights */}
        <div className="col-12 col-lg-6">
          <div className="cyber-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-danger m-0"><i className="bi bi-diagram-3-fill me-2"></i>아웃바운드 DDoS 공격 대상 (외부 3개 IP)</h6>
              <span className="badge badge-pol-ddos">17,749건 DROP</span>
            </div>
            <div className="table-responsive">
              <table className="table table-cyber table-sm mb-0">
                <thead>
                  <tr>
                    <th>목적지 IP</th>
                    <th>공격 포트</th>
                    <th>감염 호스트 수</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {OUTBOUND_DDOS_TARGETS.map((t, idx) => (
                    <tr key={idx}>
                      <td className="font-monospace text-danger">{t.targetIp}</td>
                      <td>{t.ports}</td>
                      <td>{t.infectedHostCount}개 IP</td>
                      <td><span className="badge bg-danger">{t.action}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
