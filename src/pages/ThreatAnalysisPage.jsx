import React, { useState } from 'react';
import { PORT_SCAN_HOSTS, BRUTE_FORCE_STATS, OUTBOUND_DDOS_TARGETS, C2_CRITICAL_HOSTS, SAMPLE_LOGS } from '../services/mockDataService.js';

export default function ThreatAnalysisPage() {
  const [activeTab, setActiveTab] = useState('c2');

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="text-cyan m-0 fw-bold"><i className="bi bi-shield-shaded me-2"></i>4대 사이버위협 심층 분석</h4>
          <span className="text-muted small">UTM 방화벽 수집 300,000건 이벤트 연관성 분석</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills cyber-card p-2 mb-4">
        <li className="nav-item">
          <button className={`nav-link text-nowrap ${activeTab === 'c2' ? 'active bg-danger fw-bold' : 'text-white'}`} onClick={() => setActiveTab('c2')}>
            🚨 C2 유출 의심 (9,014건)
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-nowrap ${activeTab === 'scan' ? 'active bg-warning text-dark fw-bold' : 'text-white'}`} onClick={() => setActiveTab('scan')}>
            📡 포트 스캔 (17,981건)
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-nowrap ${activeTab === 'brute' ? 'active bg-purple text-white fw-bold' : 'text-white'}`} onClick={() => setActiveTab('brute')}>
            🔐 분산 무차별대입 (9,109건)
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-nowrap ${activeTab === 'ddos' ? 'active bg-pink text-white fw-bold' : 'text-white'}`} onClick={() => setActiveTab('ddos')}>
            💥 아웃바운드 DDoS (17,749건)
          </button>
        </li>
      </ul>

      {/* Tab Contents */}
      {activeTab === 'c2' && (
        <div className="cyber-card p-4">
          <h5 className="text-danger fw-bold mb-3"><i className="bi bi-exclamation-triangle-fill me-2"></i>[긴급] C2 Command & Control / 데이터 유출 트래픽</h5>
          <p className="text-white-50 small">
            보안 사각지대 `POL-201` 정책에 의해 허용(ALLOW)되어 발신 패킷이 평균 대비 29배 폭증한 3개 호스트입니다.
          </p>
          <div className="table-responsive">
            <table className="table table-cyber">
              <thead>
                <tr>
                  <th>내부 출발지 IP</th>
                  <th>Tor (Port 9001)</th>
                  <th>Metasploit (Port 4444)</th>
                  <th>평균 발신 패킷</th>
                  <th>증가율</th>
                  <th>현재 상태</th>
                </tr>
              </thead>
              <tbody>
                {C2_CRITICAL_HOSTS.map((h, idx) => (
                  <tr key={idx} className="table-danger text-white">
                    <td className="font-monospace fw-bold">{h.ip}</td>
                    <td>{h.port9001}건</td>
                    <td>{h.port4444}건</td>
                    <td>{h.avgPackets.toLocaleString()} B</td>
                    <td><span className="badge bg-danger">{h.multiplier}</span></td>
                    <td><span className="badge bg-danger pulse-red-badge">{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'scan' && (
        <div className="cyber-card p-4">
          <h5 className="text-warning fw-bold mb-3"><i className="bi bi-radar me-2"></i>포트 스캔 (Reconnaissance) 저속 정찰 패턴</h5>
          <div className="table-responsive">
            <table className="table table-cyber">
              <thead>
                <tr>
                  <th>스캔 호스트 IP</th>
                  <th>탐색 대상 포트 수</th>
                  <th>시도 횟수</th>
                  <th>탐지 정책</th>
                  <th>조치 상태</th>
                </tr>
              </thead>
              <tbody>
                {PORT_SCAN_HOSTS.map((h, idx) => (
                  <tr key={idx}>
                    <td className="font-monospace text-warning">{h.ip}</td>
                    <td>~{h.scannedPorts}개</td>
                    <td>{h.targetCount}회</td>
                    <td><span className="badge badge-pol-scan">POL-SCAN-BLOCK</span></td>
                    <td><span className="badge bg-warning text-dark">{h.action}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'brute' && (
        <div className="cyber-card p-4">
          <h5 className="text-info fw-bold mb-3"><i className="bi bi-key-fill me-2"></i>분산 무차별 대입 공격 (Credential Stuffing)</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="p-3 bg-dark rounded border border-secondary">
                <div className="text-muted small">고유 출발지 IP 수</div>
                <div className="fs-4 text-white fw-bold">{BRUTE_FORCE_STATS.uniqueSourceIps.toLocaleString()}개</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-dark rounded border border-secondary">
                <div className="text-muted small">IP당 시도 횟수</div>
                <div className="fs-4 text-white fw-bold">{BRUTE_FORCE_STATS.attemptsPerIp} (임계치 우회)</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-dark rounded border border-secondary">
                <div className="text-muted small">공격 대상 포트</div>
                <div className="fs-4 text-white fw-bold">{BRUTE_FORCE_STATS.targetPorts.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ddos' && (
        <div className="cyber-card p-4">
          <h5 className="text-pink fw-bold mb-3"><i className="bi bi-lightning-charge-fill me-2"></i>아웃바운드 DDoS (내부 봇넷 감염)</h5>
          <div className="table-responsive">
            <table className="table table-cyber">
              <thead>
                <tr>
                  <th>공격 대상 외부 IP</th>
                  <th>총 발생 이벤트</th>
                  <th>관련 내부 감염 IP 수</th>
                  <th>공격 포트</th>
                  <th>적용 정책</th>
                </tr>
              </thead>
              <tbody>
                {OUTBOUND_DDOS_TARGETS.map((t, idx) => (
                  <tr key={idx}>
                    <td className="font-monospace text-danger">{t.targetIp}</td>
                    <td>{t.eventCount.toLocaleString()}건</td>
                    <td>{t.infectedHostCount.toLocaleString()}개 IP</td>
                    <td>{t.ports}</td>
                    <td><span className="badge badge-pol-ddos">{t.action}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Event Logs Table Sample */}
      <div className="cyber-card p-4 mt-4">
        <h6 className="text-cyan mb-3"><i className="bi bi-table me-2"></i>최신 로그 스트림 샘플 (Real-time View)</h6>
        <div className="table-responsive">
          <table className="table table-cyber table-sm">
            <thead>
              <tr>
                <th>시각</th>
                <th>출발지 IP</th>
                <th>목적지 IP</th>
                <th>포트</th>
                <th>정책 ID</th>
                <th>Action</th>
                <th>위협 구별</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LOGS.map((log) => (
                <tr key={log.id}>
                  <td>{log.time}</td>
                  <td className="font-monospace">{log.srcIp}</td>
                  <td className="font-monospace">{log.dstIp}</td>
                  <td>{log.dstPort}</td>
                  <td><span className={`badge badge-${log.policy.toLowerCase()}`}>{log.policy}</span></td>
                  <td>
                    <span className={`badge ${log.action === 'ALLOW' ? 'bg-success' : log.action === 'DENY' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td><span className="badge bg-secondary">{log.threat}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
