import React from 'react';

export default function PolicyManagerPage({ policies, onPolicyUpdate }) {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="text-cyan m-0 fw-bold"><i className="bi bi-sliders me-2"></i>방화벽 정책 레지스트리 관리자</h4>
          <span className="text-muted small">UTM 6대 정책 규칙 관리 및 실시간 Action 변경</span>
        </div>
      </div>

      <div className="cyber-card p-4">
        <div className="table-responsive">
          <table className="table table-cyber align-middle">
            <thead>
              <tr>
                <th>정책 ID</th>
                <th>정책명</th>
                <th>설명</th>
                <th>위험도</th>
                <th>발생 건수 (비율)</th>
                <th>현재 Action</th>
                <th>Action 변경 제어</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className={p.id === 'POL-201' && p.action === 'ALLOW' ? 'table-danger text-white' : ''}>
                  <td className="font-monospace fw-bold">{p.id}</td>
                  <td>{p.name}</td>
                  <td className="small text-muted">{p.desc}</td>
                  <td>
                    <span className={`badge ${p.risk === 'Critical' ? 'bg-danger' : p.risk === 'High' ? 'bg-warning text-dark' : 'bg-info'}`}>
                      {p.risk}
                    </span>
                  </td>
                  <td>{p.count.toLocaleString()}건 ({p.ratio})</td>
                  <td>
                    <span className={`badge ${p.action === 'ALLOW' ? 'bg-success' : p.action === 'DENY' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {p.action}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className={`btn ${p.action === 'ALLOW' ? 'btn-success active' : 'btn-outline-success'}`}
                        onClick={() => onPolicyUpdate(p.id, 'ALLOW')}
                      >
                        ALLOW
                      </button>
                      <button
                        className={`btn ${p.action === 'DENY' ? 'btn-warning active text-dark' : 'btn-outline-warning'}`}
                        onClick={() => onPolicyUpdate(p.id, 'DENY')}
                      >
                        DENY
                      </button>
                      <button
                        className={`btn ${p.action === 'DROP' ? 'btn-danger active' : 'btn-outline-danger'}`}
                        onClick={() => onPolicyUpdate(p.id, 'DROP')}
                      >
                        DROP
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
