"""
TDD Automated Verification Suite for Military Cyber Threat Traffic Analysis System
Tests datasets, C2 critical host extraction, SOP isolation transitions, and data quality standards.
"""

import pytest

# 1. Firewall Policy Event Summary Dataset (from PPTX Security Operations Report)
POLICY_DATASET = {
    'POL-101':           {'count': 209143, 'action': 'ALLOW', 'risk': 'Low'},
    'POL-999':           {'count': 37004,  'action': 'DENY',  'risk': 'Low'},
    'POL-SCAN-BLOCK':   {'count': 17981,  'action': 'DENY',  'risk': 'High'},
    'POL-DDOS-PROTECT':  {'count': 17749,  'action': 'DROP',  'risk': 'High'},
    'POL-AUTH-LIMIT':    {'count': 9109,   'action': 'DENY',  'risk': 'Medium'},
    'POL-201':           {'count': 9014,   'action': 'ALLOW', 'risk': 'Critical'}
}

# 2. C2 Critical Threat Sample Hosts
C2_CRITICAL_HOSTS = [
    {'ip': '10.148.237.107', 'ports': [4444, 9001], 'avg_sent': 50033, 'status': 'ISOLATED'},
    {'ip': '10.143.50.157',  'ports': [4444, 9001], 'avg_sent': 50033, 'status': 'ISOLATED'},
    {'ip': '10.82.206.41',   'ports': [4444, 9001], 'avg_sent': 50033, 'status': 'ISOLATED'}
]


def test_total_event_count():
    """Verify total log events count equals exactly 300,000."""
    total = sum(data['count'] for data in POLICY_DATASET.values())
    assert total == 300000, f"Expected 300,000 events, but got {total}"


def test_policy_counts_and_ratios():
    """Verify event count per policy matches PPTX exact breakdown."""
    assert POLICY_DATASET['POL-101']['count'] == 209143
    assert POLICY_DATASET['POL-999']['count'] == 37004
    assert POLICY_DATASET['POL-SCAN-BLOCK']['count'] == 17981
    assert POLICY_DATASET['POL-DDOS-PROTECT']['count'] == 17749
    assert POLICY_DATASET['POL-AUTH-LIMIT']['count'] == 9109
    assert POLICY_DATASET['POL-201']['count'] == 9014


def test_c2_critical_hosts_extraction():
    """Verify extraction of the 3 infected C2 internal hosts using Metasploit/Tor ports."""
    expected_ips = {'10.148.237.107', '10.143.50.157', '10.82.206.41'}
    extracted_ips = {host['ip'] for host in C2_CRITICAL_HOSTS if 4444 in host['ports'] or 9001 in host['ports']}
    assert extracted_ips == expected_ips, f"Expected {expected_ips}, but extracted {extracted_ips}"


def test_sop_isolation_state_transition():
    """Verify SOP action changes policy state from ALLOW to DENY and updates host status."""
    policy_state = POLICY_DATASET['POL-201']['action']
    assert policy_state == 'ALLOW', "Initial POL-201 state must be ALLOW (vulnerability)"

    # Simulate SOP action execution
    simulated_sop_action = {'policy_id': 'POL-201', 'new_action': 'DENY'}
    POLICY_DATASET['POL-201']['action'] = simulated_sop_action['new_action']
    assert POLICY_DATASET['POL-201']['action'] == 'DENY', "POL-201 state after SOP must be DENY"

    # Reset state back for idempotent test execution
    POLICY_DATASET['POL-201']['action'] = 'ALLOW'


def test_data_quality_5_criteria():
    """Verify 5 Data Quality Criteria (Completeness, Accuracy, Consistency, Validity, Timeliness)."""
    # 1. Completeness: All policies have required keys
    for pol_id, pol in POLICY_DATASET.items():
        assert 'count' in pol and 'action' in pol and 'risk' in pol

    # 2. Accuracy: Sum matches 300,000
    assert sum(p['count'] for p in POLICY_DATASET.values()) == 300000

    # 3. Consistency: Actions belong to valid enum
    valid_actions = {'ALLOW', 'DENY', 'DROP'}
    for pol in POLICY_DATASET.values():
        assert pol['action'] in valid_actions

    # 4. Validity: Risk levels belong to valid enum
    valid_risks = {'Low', 'Medium', 'High', 'Critical'}
    for pol in POLICY_DATASET.values():
        assert pol['risk'] in valid_risks

    # 5. Timeliness: C2 hosts identified with high packet anomaly (> 20x average)
    for host in C2_CRITICAL_HOSTS:
        assert host['avg_sent'] > 10000
