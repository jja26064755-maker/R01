import React from 'react';

export default function EmergencyBanner({ pol201Action, onNavigateToSop }) {
  const isEmergency = pol201Action === 'ALLOW';

  return (
    <div className={`p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between ${isEmergency ? 'cyber-card-alert bg-danger bg-opacity-25 text-white' : 'bg-success bg-opacity-25 text-white border border-success'}`}>
      <div className="d-flex align-items-center gap-3">
        <span className={isEmergency ? 'pulse-red-badge me-2' : 'badge bg-success me-2'}>
          {isEmergency ? '🚨 긴급 비상 (POL-201)' : '🛡️ 정상 조치 완료'}
        </span>
        <div>
          <strong className="fs-6">
            {isEmergency
              ? '보안 사각지대 발생: POL-201 정책이 [ALLOW] 상태로 C2 데이터 유출 트래픽이 통과 중입니다!'
              : 'POL-201 정책이 [DENY]로 전환되어 C2 트래픽이 성공적으로 차단되고 있습니다.'}
          </strong>
          <div className="small text-white-50 mt-1">
            {isEmergency
              ? '위험 호스트: 10.148.237.107, 10.143.50.157, 10.82.206.41 (Tor 9001 / Metasploit 4444)'
              : '3대 위험 호스트 네트워크 격리 조치 및 방화벽 정책 변경 완료.'}
          </div>
        </div>
      </div>
      {isEmergency && (
        <button className="btn btn-danger btn-sm text-nowrap fw-bold px-3 py-2 shadow" onClick={onNavigateToSop}>
          ⚡ 긴급 SOP 실행하기
        </button>
      )}
    </div>
  );
}
