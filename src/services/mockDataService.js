/**
 * 2팀_군_사이버위협_트래픽현황.pptx 기반 300,000건 데이터셋 및 Mock 데이터 서비스
 */

export const SUMMARY_STATS = {
  totalEvents: 300000,
  timeRange: '2026-08-06 00:00:00 ~ 06:40:29 (KST)',
  normalCount: 209143,
  normalRatio: '69.7%',
  blockedCount: 81843, // 37004 + 17981 + 17749 + 9109
  blockedRatio: '27.3%',
  criticalCount: 9014,
  criticalRatio: '3.0%',
  threatTypesCount: 4
};

export const INITIAL_POLICIES = [
  { id: 'POL-101', name: '정상 업무 트래픽', action: 'ALLOW', count: 209143, ratio: '69.7%', risk: 'Low', desc: '정상 업무 트래픽' },
  { id: 'POL-999', name: '일반 차단 (기본 정책)', action: 'DENY', count: 37004, ratio: '12.3%', risk: 'Low', desc: '기본 차단 정책' },
  { id: 'POL-SCAN-BLOCK', name: '포트 스캔 차단', action: 'DENY', count: 17981, ratio: '6.0%', risk: 'High', desc: '포트 정찰 탐지' },
  { id: 'POL-DDOS-PROTECT', name: '아웃바운드 DDoS 차단', action: 'DROP', count: 17749, ratio: '5.9%', risk: 'High', desc: '내부 봇넷 DDoS 차단' },
  { id: 'POL-AUTH-LIMIT', name: '분산 무차별 대입 차단', action: 'DENY', count: 9109, ratio: '3.0%', risk: 'Medium', desc: 'SSH/RDP 무차별 대입' },
  { id: 'POL-201', name: 'C2 의심 / 데이터 유출', action: 'ALLOW', count: 9014, ratio: '3.0%', risk: 'Critical', desc: 'Tor/Metasploit 비표준 포트 유출 (긴급 차단 대상!)' }
];

export const C2_CRITICAL_HOSTS = [
  { ip: '10.148.237.107', name: 'HQ-HOST-107', port4444: 998, port9001: 1026, avgPackets: 50033, multiplier: '29배', status: 'ISOLATED' },
  { ip: '10.143.50.157',  name: 'HQ-HOST-157', port4444: 991, port9001: 1008, avgPackets: 50033, multiplier: '29배', status: 'ISOLATED' },
  { ip: '10.82.206.41',   name: 'HQ-HOST-041', port4444: 942, port9001: 967,  avgPackets: 50033, multiplier: '29배', status: 'ISOLATED' }
];

export const PORT_SCAN_HOSTS = [
  { ip: '10.75.75.8',     scannedPorts: 1000, targetCount: 3653, action: 'DENY', duration: '00:00:17 ~ 06:40:28' },
  { ip: '10.68.43.221',   scannedPorts: 1000, targetCount: 3686, action: 'DENY', duration: '00:00:02 ~ 06:40:26' },
  { ip: '10.68.134.198',  scannedPorts: 1000, targetCount: 3587, action: 'DENY', duration: '00:00:08 ~ 06:40:28' },
  { ip: '10.223.142.253', scannedPorts: 1000, targetCount: 3585, action: 'DENY', duration: '00:00:00 ~ 06:40:24' },
  { ip: '10.166.245.157', scannedPorts: 1000, targetCount: 3470, action: 'DENY', duration: '00:00:01 ~ 06:40:14' }
];

export const BRUTE_FORCE_STATS = {
  uniqueSourceIps: 9107,
  totalEvents: 9109,
  targetPorts: ['SSH (22)', 'RDP (3389)'],
  attemptsPerIp: '1 ~ 2회',
  action: 'DENY (POL-AUTH-LIMIT)'
};

export const OUTBOUND_DDOS_TARGETS = [
  { targetIp: '185.177.57.208', eventCount: 6010, infectedHostCount: 6010, ports: '80, 443', action: 'DROP' },
  { targetIp: '135.59.194.71',  eventCount: 5877, infectedHostCount: 5877, ports: '80, 443', action: 'DROP' },
  { targetIp: '51.183.92.240',  eventCount: 5860, infectedHostCount: 5860, ports: '80, 443', action: 'DROP' }
];

export const SAMPLE_LOGS = [
  { id: '1', time: '06:40:28', srcIp: '10.148.237.107', dstIp: '185.220.101.5', srcPort: 54321, dstPort: 9001, proto: 'TCP', sent: 52140, recv: 120, policy: 'POL-201', action: 'ALLOW', threat: 'C2Exfiltration', risk: 'Critical' },
  { id: '2', time: '06:40:25', srcIp: '10.143.50.157', dstIp: '198.51.100.44', srcPort: 54322, dstPort: 4444, proto: 'TCP', sent: 48900, recv: 80, policy: 'POL-201', action: 'ALLOW', threat: 'C2Exfiltration', risk: 'Critical' },
  { id: '3', time: '06:40:22', srcIp: '10.82.206.41', dstIp: '203.0.113.88', srcPort: 54323, dstPort: 8080, proto: 'TCP', sent: 49050, recv: 200, policy: 'POL-201', action: 'ALLOW', threat: 'C2Exfiltration', risk: 'Critical' },
  { id: '4', time: '06:40:17', srcIp: '10.75.75.8', dstIp: '172.16.4.12', srcPort: 41000, dstPort: 80, proto: 'TCP', sent: 64, recv: 0, policy: 'POL-SCAN-BLOCK', action: 'DENY', threat: 'PortScan', risk: 'High' },
  { id: '5', time: '06:40:15', srcIp: '192.168.1.105', dstIp: '10.0.0.5', srcPort: 33421, dstPort: 22, proto: 'TCP', sent: 128, recv: 0, policy: 'POL-AUTH-LIMIT', action: 'DENY', threat: 'BruteForce', risk: 'Medium' },
  { id: '6', time: '06:40:10', srcIp: '10.12.34.56', dstIp: '185.177.57.208', srcPort: 50112, dstPort: 443, proto: 'TCP', sent: 1024, recv: 0, policy: 'POL-DDOS-PROTECT', action: 'DROP', threat: 'OutboundDDoS', risk: 'High' },
  { id: '7', time: '06:40:05', srcIp: '10.10.1.15', dstIp: '10.10.2.20', srcPort: 59012, dstPort: 443, proto: 'TCP', sent: 1520, recv: 4500, policy: 'POL-101', action: 'ALLOW', threat: 'Normal', risk: 'Low' }
];
