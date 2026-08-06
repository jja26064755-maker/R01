import React, { useState } from 'react';
import { parseCsvLogs } from '../services/logAnalyzer.js';

export default function CsvUploadPage() {
  const [parsedLogs, setParsedLogs] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const logs = parseCsvLogs(text);
      setParsedLogs(logs);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sampleCsv = `time,src_ip,dst_ip,src_port,dst_port,proto,bytes_sent,bytes_recv,policy,action
06:40:29,10.148.237.107,185.220.101.5,54321,9001,TCP,52140,120,POL-201,ALLOW
06:40:28,10.143.50.157,198.51.100.44,54322,4444,TCP,48900,80,POL-201,ALLOW
06:40:27,10.75.75.8,172.16.4.12,41000,80,TCP,64,0,POL-SCAN-BLOCK,DENY
06:40:26,192.168.1.105,10.0.0.5,33421,22,TCP,128,0,POL-AUTH-LIMIT,DENY
06:40:25,10.12.34.56,185.177.57.208,50112,443,TCP,1024,0,POL-DDOS-PROTECT,DROP`;

    setFileName('sample_utm_logs.csv');
    const logs = parseCsvLogs(sampleCsv);
    setParsedLogs(logs);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="text-cyan m-0 fw-bold"><i className="bi bi-file-earmark-spreadsheet me-2"></i>UTM 파일 파서 & CSV 데이터 분석기</h4>
          <span className="text-muted small">사용자 커스텀 방화벽 로그 CSV 파일 파싱 및 위협 실시간 분류</span>
        </div>

        <button className="btn btn-outline-info btn-sm" onClick={handleLoadSampleCsv}>
          <i className="bi bi-play-circle me-1"></i>샘플 CSV 로드 테스트
        </button>
      </div>

      <div className="cyber-card p-5 text-center mb-4 border-dashed">
        <i className="bi bi-cloud-upload fs-1 text-cyan"></i>
        <h5 className="text-white mt-2">UTM 로그 CSV 파일 업로드</h5>
        <p className="text-muted small">형식: time, src_ip, dst_ip, src_port, dst_port, proto, bytes_sent, bytes_recv, policy, action</p>
        <input type="file" accept=".csv" className="d-none" id="csvFileInput" onChange={handleFileUpload} />
        <label htmlFor="csvFileInput" className="btn btn-cyan btn-sm fw-bold px-4 py-2 mt-2">
          파일 선택하기
        </label>
        {fileName && <div className="text-success mt-2 font-monospace">업로드됨: {fileName}</div>}
      </div>

      {parsedLogs.length > 0 && (
        <div className="cyber-card p-4">
          <h6 className="text-white mb-3">파싱 완료: 총 {parsedLogs.length}건 분석 결과</h6>
          <div className="table-responsive">
            <table className="table table-cyber table-sm">
              <thead>
                <tr>
                  <th>시각</th>
                  <th>출발지 IP</th>
                  <th>목적지 IP</th>
                  <th>포트</th>
                  <th>발신 패킷</th>
                  <th>정책 ID</th>
                  <th>Action</th>
                  <th>AI 분류 위협</th>
                  <th>위험도</th>
                </tr>
              </thead>
              <tbody>
                {parsedLogs.map((log) => (
                  <tr key={log.id} className={log.risk === 'Critical' ? 'table-danger text-white' : ''}>
                    <td>{log.time}</td>
                    <td className="font-monospace">{log.srcIp}</td>
                    <td className="font-monospace">{log.dstIp}</td>
                    <td>{log.dstPort}</td>
                    <td>{log.sent.toLocaleString()} B</td>
                    <td><span className="badge bg-secondary">{log.policy}</span></td>
                    <td><span className="badge bg-dark">{log.action}</span></td>
                    <td><span className="badge bg-purple">{log.threat}</span></td>
                    <td>
                      <span className={`badge ${log.risk === 'Critical' ? 'bg-danger pulse-red-badge' : 'bg-warning text-dark'}`}>
                        {log.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
