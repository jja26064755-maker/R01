-- ==========================================================================
-- Supabase PostgreSQL Schema DDL & Initial Seeds
-- 군 사이버위협 트래픽 현황 분석 및 긴급 대응 PWA
-- ==========================================================================

-- 1. Create Traffic Logs Table
CREATE TABLE IF NOT EXISTS public.traffic_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    src_ip VARCHAR(45) NOT NULL,
    dst_ip VARCHAR(45) NOT NULL,
    src_port INTEGER NOT NULL,
    dst_port INTEGER NOT NULL,
    protocol VARCHAR(10) NOT NULL DEFAULT 'TCP',
    bytes_sent BIGINT DEFAULT 0,
    bytes_recv BIGINT DEFAULT 0,
    policy_id VARCHAR(30) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('ALLOW', 'DENY', 'DROP')),
    threat_type VARCHAR(30) NOT NULL CHECK (threat_type IN ('Normal', 'PortScan', 'BruteForce', 'OutboundDDoS', 'C2Exfiltration')),
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical'))
);

CREATE INDEX IF NOT EXISTS idx_traffic_policy ON public.traffic_logs(policy_id);
CREATE INDEX IF NOT EXISTS idx_traffic_src_ip ON public.traffic_logs(src_ip);
CREATE INDEX IF NOT EXISTS idx_traffic_threat ON public.traffic_logs(threat_type);

-- 2. Create Firewall Policies Registry Table
CREATE TABLE IF NOT EXISTS public.policies (
    policy_id VARCHAR(30) PRIMARY KEY,
    policy_name VARCHAR(100) NOT NULL,
    description TEXT,
    action VARCHAR(10) NOT NULL CHECK (action IN ('ALLOW', 'DENY', 'DROP')),
    risk_level VARCHAR(10) NOT NULL,
    event_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Isolated Hosts Management Table
CREATE TABLE IF NOT EXISTS public.isolated_hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    host_name VARCHAR(100) NOT NULL,
    threat_reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ISOLATED' CHECK (status IN ('ISOLATED', 'RESTORED')),
    isolated_at TIMESTAMPTZ DEFAULT NOW(),
    isolated_by VARCHAR(50) DEFAULT 'CERT_Officer_01'
);

-- 4. Create SOP Action Logs Table
CREATE TABLE IF NOT EXISTS public.sop_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN ('HOST_ISOLATION', 'POLICY_CHANGE', 'HOST_RESTORE')),
    target_ip VARCHAR(45),
    policy_id VARCHAR(30),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    operator VARCHAR(50) DEFAULT 'CERT_Officer_01',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seed Firewall Policies Registry Data (Matching PPTX 300,000 Stats)
INSERT INTO public.policies (policy_id, policy_name, description, action, risk_level, event_count)
VALUES
('POL-101', '정상 업무 트래픽', '내부 부대 정상 업무 웹 및 데이터 통신 허용', 'ALLOW', 'Low', 209143),
('POL-999', '일반 차단 (기본 정책)', '미등록 외부 포트 및 차단 대상 기본 트래픽', 'DENY', 'Low', 37004),
('POL-SCAN-BLOCK', '포트 스캔 차단', '정찰 행위 5개 호스트 다수 포트 탐색 트래픽 차단', 'DENY', 'High', 17981),
('POL-DDOS-PROTECT', '아웃바운드 DDoS 차단', '내부 17,739개 감염 호스트 외부 봇넷 공격 차단', 'DROP', 'High', 17749),
('POL-AUTH-LIMIT', '분산 무차별 대입 차단', 'SSH(22)/RDP(3389) 단발성 무차별 대입 시도 차단', 'DENY', 'Medium', 9109),
('POL-201', 'C2 의심 / 데이터 유출', 'Tor/Metasploit 비표준 포트 유출 트래픽 (긴급 변경 필요)', 'ALLOW', 'Critical', 9014)
ON CONFLICT (policy_id) DO UPDATE 
SET event_count = EXCLUDED.event_count, action = EXCLUDED.action;

-- 6. Initial Isolated Hosts Seeds (C2 Critical 3 Hosts)
INSERT INTO public.isolated_hosts (ip_address, host_name, threat_reason, status)
VALUES
('10.148.237.107', 'HQ-HOST-107', 'POL-201 Port 4444/9001 Metasploit/Tor 유출 패킷 탐지', 'ISOLATED'),
('10.143.50.157',  'HQ-HOST-157', 'POL-201 Port 4444/9001 Metasploit/Tor 유출 패킷 탐지', 'ISOLATED'),
('10.82.206.41',   'HQ-HOST-041', 'POL-201 Port 4444/9001 Metasploit/Tor 유출 패킷 탐지', 'ISOLATED')
ON CONFLICT (ip_address) DO NOTHING;
