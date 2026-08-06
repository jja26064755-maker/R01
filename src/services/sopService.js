/**
 * Emergency C2 SOP Isolation & Firewall Policy Management Service
 */

import { INITIAL_POLICIES, C2_CRITICAL_HOSTS } from './mockDataService.js';

let currentPolicies = [...INITIAL_POLICIES];
let currentIsolatedHosts = [...C2_CRITICAL_HOSTS];
let sopLogs = [
  { id: '1', time: '2026-08-06 00:05:12', type: 'HOST_ISOLATION', target: '10.148.237.107', detail: 'C2 Metasploit/Tor 패킷 감지로 네트워크 격리', operator: 'CERT_Officer_01' },
  { id: '2', time: '2026-08-06 00:05:15', type: 'HOST_ISOLATION', target: '10.143.50.157', detail: 'C2 Metasploit/Tor 패킷 감지로 네트워크 격리', operator: 'CERT_Officer_01' },
  { id: '3', time: '2026-08-06 00:05:18', type: 'HOST_ISOLATION', target: '10.82.206.41', detail: 'C2 Metasploit/Tor 패킷 감지로 네트워크 격리', operator: 'CERT_Officer_01' }
];

export function getPolicies() {
  return currentPolicies;
}

export function updatePolicyAction(policyId, newAction, operator = 'CERT_Officer_01') {
  const policy = currentPolicies.find(p => p.id === policyId);
  if (policy) {
    const oldAction = policy.action;
    policy.action = newAction;
    
    sopLogs.unshift({
      id: `sop-${Date.now()}`,
      time: new Date().toLocaleString('ko-KR'),
      type: 'POLICY_CHANGE',
      target: policyId,
      detail: `정책 [${policy.name}] Action 변경: ${oldAction} -> ${newAction}`,
      operator
    });
  }
  return [...currentPolicies];
}

export function getIsolatedHosts() {
  return currentIsolatedHosts;
}

export function isolateHost(ip, operator = 'CERT_Officer_01') {
  const host = currentIsolatedHosts.find(h => h.ip === ip);
  if (host) {
    host.status = 'ISOLATED';
  } else {
    currentIsolatedHosts.push({
      ip,
      name: `HOST-${ip.split('.').pop()}`,
      port4444: 900,
      port9001: 900,
      avgPackets: 50000,
      multiplier: '29배',
      status: 'ISOLATED'
    });
  }

  sopLogs.unshift({
    id: `sop-${Date.now()}`,
    time: new Date().toLocaleString('ko-KR'),
    type: 'HOST_ISOLATION',
    target: ip,
    detail: `단말 [${ip}] 긴급 네트워크 격리 조치 수행`,
    operator
  });

  return [...currentIsolatedHosts];
}

export function restoreHost(ip, operator = 'CERT_Officer_01') {
  const host = currentIsolatedHosts.find(h => h.ip === ip);
  if (host) {
    host.status = 'RESTORED';
    sopLogs.unshift({
      id: `sop-${Date.now()}`,
      time: new Date().toLocaleString('ko-KR'),
      type: 'HOST_RESTORE',
      target: ip,
      detail: `단말 [${ip}] 격리 해제 및 네트워크 정상 복구`,
      operator
    });
  }
  return [...currentIsolatedHosts];
}

export function getSopLogs() {
  return sopLogs;
}
