import React, { useState } from 'react';

export default function SopModal({ show, onClose, onConfirm, targetIp, actionType }) {
  const [operator, setOperator] = useState('CERT_Officer_01');
  const [reason, setReason] = useState('C2 Tor/Metasploit 비표준 포트 은밀 유출 패킷 차단 SOP 실행');

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ operator, reason });
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content cyber-card text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-danger">
              <i className="bi bi-shield-slash-fill me-2"></i>
              {actionType === 'POLICY_DENY' ? 'POL-201 긴급 정책 차단(DENY) 승인' : `단말 [${targetIp}] 긴급 격리 승인`}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-danger bg-danger bg-opacity-25 border-danger text-white small mb-3">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                본 조치는 Supabase DB 및 네트워크 보안 장비에 조치자 정보와 타임라인이 영구적으로 기록됩니다.
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">조치 담당자 ID</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">SOP 실행 사유</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>취소</button>
              <button type="submit" className="btn btn-danger btn-sm fw-bold px-3">
                ⚡ 승인 및 조치 실행
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
