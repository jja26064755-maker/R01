import React, { useEffect, useRef } from 'react';

export default function TrafficCharts({ policies }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.Chart || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const existingChart = window.Chart.getChart(chartRef.current);
    if (existingChart) existingChart.destroy();

    new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: policies.map(p => `${p.id} (${p.name})`),
        datasets: [{
          data: policies.map(p => p.count),
          backgroundColor: [
            '#0284c7', // POL-101 (Cyan)
            '#64748b', // POL-999 (Slate)
            '#f59e0b', // POL-SCAN-BLOCK (Amber)
            '#ec4899', // POL-DDOS-PROTECT (Pink)
            '#a855f7', // POL-AUTH-LIMIT (Purple)
            '#ef4444'  // POL-201 (Red)
          ],
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#f8fafc', font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw.toLocaleString()}건`
            }
          }
        }
      }
    });
  }, [policies]);

  return (
    <div className="row g-3 mb-4">
      {/* Policy Distribution Chart */}
      <div className="col-12 col-lg-6">
        <div className="cyber-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="text-info m-0"><i className="bi bi-pie-chart-fill me-2"></i>방화벽 정책별 이벤트 분포 (총 300,000건)</h6>
            <span className="badge bg-secondary">실시간 집계</span>
          </div>
          <div style={{ height: '260px', position: 'relative' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Traffic Trend Overview */}
      <div className="col-12 col-lg-6">
        <div className="cyber-card p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="text-cyan m-0"><i className="bi bi-graph-up me-2"></i>시간대별 트래픽 및 주요 공격 패턴 추이</h6>
            <span className="badge bg-dark border border-secondary text-muted">00:00 - 06:40 KST</span>
          </div>

          <div className="table-responsive">
            <table className="table table-cyber table-sm mb-0">
              <thead>
                <tr>
                  <th>시간대</th>
                  <th>위협 유형</th>
                  <th>이벤트 건수</th>
                  <th>적용 정책</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>00:00 ~ 01:00</td>
                  <td>Port Scan (Recon)</td>
                  <td>3,240건</td>
                  <td><span className="badge badge-pol-scan">POL-SCAN-BLOCK</span></td>
                  <td><span className="text-warning">DENY</span></td>
                </tr>
                <tr>
                  <td>01:00 ~ 03:00</td>
                  <td>Distributed Brute Force</td>
                  <td>9,109건</td>
                  <td><span className="badge badge-pol-auth">POL-AUTH-LIMIT</span></td>
                  <td><span className="text-warning">DENY</span></td>
                </tr>
                <tr>
                  <td>03:00 ~ 05:00</td>
                  <td>Outbound DDoS</td>
                  <td>17,749건</td>
                  <td><span className="badge badge-pol-ddos">POL-DDOS-PROTECT</span></td>
                  <td><span className="text-danger">DROP</span></td>
                </tr>
                <tr className="table-danger text-white">
                  <td>05:00 ~ 06:40</td>
                  <td>C2 Data Exfiltration</td>
                  <td>9,014건</td>
                  <td><span className="badge badge-pol-201">POL-201</span></td>
                  <td><span className="text-danger fw-bold">ALLOW 🚨</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
