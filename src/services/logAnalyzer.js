/**
 * UTM Log Parser & AI Threat Detection Analyzer Engine
 */

export function parseCsvLogs(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (row.length < 5) continue;

    const log = {
      id: `csv-${i}`,
      time: row[0] || new Date().toLocaleTimeString(),
      srcIp: row[1] || '0.0.0.0',
      dstIp: row[2] || '0.0.0.0',
      srcPort: parseInt(row[3]) || 0,
      dstPort: parseInt(row[4]) || 0,
      proto: row[5] || 'TCP',
      sent: parseInt(row[6]) || 0,
      recv: parseInt(row[7]) || 0,
      policy: row[8] || 'POL-101',
      action: row[9] || 'ALLOW'
    };

    // AI Anomaly Classification Rules
    const classified = classifyThreat(log);
    results.push(classified);
  }

  return results;
}

export function classifyThreat(log) {
  let threat = 'Normal';
  let risk = 'Low';

  // Rule 1: C2 Exfiltration (Tor 9001 / Metasploit 4444 / 8080 with high sent bytes ratio)
  if ([4444, 9001, 8080].includes(log.dstPort) && (log.sent > 20000 || log.policy === 'POL-201')) {
    threat = 'C2Exfiltration';
    risk = 'Critical';
  }
  // Rule 2: Port Scan (Reconnaissance)
  else if (log.policy === 'POL-SCAN-BLOCK' || (log.recv === 0 && log.sent < 200 && log.action === 'DENY')) {
    threat = 'PortScan';
    risk = 'High';
  }
  // Rule 3: Outbound DDoS
  else if (log.policy === 'POL-DDOS-PROTECT' || (log.action === 'DROP' && [80, 443].includes(log.dstPort))) {
    threat = 'OutboundDDoS';
    risk = 'High';
  }
  // Rule 4: Distributed Brute Force
  else if (log.policy === 'POL-AUTH-LIMIT' || ([22, 3389].includes(log.dstPort) && log.action === 'DENY')) {
    threat = 'BruteForce';
    risk = 'Medium';
  }

  return { ...log, threat, risk };
}
