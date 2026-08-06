import React, { useState } from 'react';
import HostIsolationCard from '../components/HostIsolationCard.jsx';
import SopModal from '../components/SopModal.jsx';
import { getIsolatedHosts, isolateHost, restoreHost, updatePolicyAction, getSopLogs } from '../services/sopService.js';

export default function EmergencySopPage({ pol201Action, onPolicyUpdate }) {
  const [hosts, setHosts] = useState(getIsolatedHosts());
  const [sopLogs, setSopLogs] = useState(getSopLogs());
  const [modalConfig, setModalConfig] = useState({ show: false, targetIp: null, actionType: null });

  const handleOpenIsolateModal = (ip) => {
    setModalConfig({ show: true, targetIp: ip, actionType: 'HOST_ISOLATION' });
  };

  const handleOpenPolicyModal = () => {
    setModalConfig({ show: true, targetIp: null, actionType: 'POLICY_DENY' });
  };

  const handleConfirmModal = ({ operator, reason }) => {
    if (modalConfig.actionType === 'HOST_ISOLATION') {
      const updated = isolateHost(modalConfig.targetIp, operator);
      setHosts([...updated]);
    } else if (modalConfig.actionType === 'POLICY_DENY') {
      onPolicyUpdate('POL-201', 'DENY', operator);
    }
    setSopLogs([...getSopLogs()]);
    setModalConfig({ show: false, targetIp: null, actionType: null });
  };

  const handleRestore = (ip) => {
    const updated = restoreHost(ip);
    setHosts([...updated]);
    setSopLogs([...getSopLogs()]);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="text-danger m-0 fw-bold"><i className="bi bi-shield-slash-fill me-2"></i>[긴급] C2 유출 긴급 대응 SOP 제어반</h4>
          <span className="text-muted small">C2 유출 3대 단말 즉시 격리 및 POL-201 방화벽 차단 표준대응절차</span>
        </div>

        {pol201Action === 'ALLOW' ? (
          <button className="btn btn-danger btn-lg font-monospace fw-bold pulse-red-badge" onClick={handleOpenPolicyModal}>
            ⚡ POL-201 정책 즉시 DENY 변경 (SOP 실행)
          </button>
        ) : (
          <span className="badge bg-success fs-6 p-2"><i className="bi bi-check-circle-fill me-1"></i>POL-201 정책 DENY 차단 완료</span>
        )}
      </div>

      <div className="row g-4">
        {/* Host Isolation Section */}
        <div className="col-12 col-lg-7">
          <div className="cyber-card p-4 mb-4">
            <h5 className="text-white fw-bold mb-3"><i className="bi bi-pc-horizontal me-2 text-danger"></i>C2 위험 단말 네트워크 격리 제어</h5>
            {hosts.map((host) => (
              <HostIsolationCard
                key={host.ip}
                host={host}
                onIsolate={handleOpenIsolateModal}
                onRestore={handleRestore}
              />
            ))}
          </div>
        </div>

        {/* SOP Audit Trail Timeline */}
        <div className="col-12 col-lg-5">
          <div className="cyber-card p-4">
            <h5 className="text-cyan fw-bold mb-3"><i className="bi bi-journal-text me-2"></i>SOP 조치 이력 타임라인</h5>
            <div className="sop-timeline mt-3">
              {sopLogs.map((log) => (
                <div key={log.id} className={`sop-timeline-item ${log.type === 'POLICY_CHANGE' || log.type === 'HOST_ISOLATION' ? 'danger' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary font-monospace">{log.time}</span>
                    <span className="small text-info">{log.operator}</span>
                  </div>
                  <div className="fw-bold text-white mt-1">{log.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <SopModal
        show={modalConfig.show}
        targetIp={modalConfig.targetIp}
        actionType={modalConfig.actionType}
        onClose={() => setModalConfig({ show: false, targetIp: null, actionType: null })}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
}
