# [Spec] 군 사이버위협 트래픽 현황 분석 및 긴급 대응 PWA (Cyber Defense PWA)

## 1. 개요 (Overview)
본 프로젝트는 **군 정보보호체계 및 네트워크 보안** 강화를 위해 UTM(통합위협관리) 및 방화벽에서 수집되는 대규모 사이버위협 트래픽 로그(300,000건)를 AI 기반으로 분석하고, 비정상 행위 감지 및 **긴급 C2(Command & Control) 데이터 유출 트래픽 격리/차단 SOP(표준대응절차)**를 신속히 수행하는 **Progressive Web App (PWA)** 개발을 목표로 합니다.

- **프로젝트 명**: 군 사이버위협 트래픽 현황 분석 및 긴급 대응 시스템
- **주요 대상 사용자**: 부대 정보보호 담당자, 네트워크 운영 담당자, 보안관제자, 지휘관
- **핵심 목표**: 
  - 300,000건의 방화벽 이벤트 로그 실시간/배치 분석 시각화
  - 4대 보안 위협(포트 스캔, 분산 무차별 대입, 아웃바운드 DDoS, C2/데이터 유출) 식별
  - 보안 사각지대인 `POL-201` (C2 트래픽 허용 상태)에 대한 긴급 단말 격리 및 방화벽 정책 변경 SOP 연결
  - Supabase, GitHub, Vercel 기반의 모바일/데스크톱 대응 PWA 구축

---

## 2. 핵심 보안 위협 분석 요구사항 (Based on PPTX Data)

분석 대상 기간 (`2026-08-06 00:00:00 ~ 06:40:29 KST`, 총 300,000건 이벤트) 중 식별된 4대 위협 및 정책별 수치 요구사항:

### 2.1 위협 유형별 요구사항
1. **포트 스캔 (Port Scan / Reconnaissance)**
   - **이벤트 건수**: 17,981건 (6.0%)
   - **정책 ID / Action**: `POL-SCAN-BLOCK` / DENY (차단 완료)
   - **특징**: 내부 호스트 5대가 외부/타대역 ~1,000개 포트를 정찰. 저속/분산(Low-and-Slow) 기법 적용.
   - **요구 기능**: 스캔 발생 5개 내부 IP 추적 및 백신/EDR 점검 권고 리스트 제공.

2. **분산 무차별 대입 공격 (Distributed Brute Force)**
   - **이벤트 건수**: 9,109건 (3.0%)
   - **정책 ID / Action**: `POL-AUTH-LIMIT` / DENY (차단 완료)
   - **특징**: 9,107개 출발지 IP에서 SSH(22), RDP(3389) 포트로 1~2회 단발성 인증 시도 (Credential Stuffing).
   - **요구 기능**: IP별 인증 실패 집계 및 추가 성공(ALLOW) 이력 존재 여부 교차 검증.

3. **아웃바운드 DDoS 트래픽 (Outbound DDoS)**
   - **이벤트 건수**: 17,749건 (5.9%)
   - **정책 ID / Action**: `POL-DDOS-PROTECT` / DROP (차단 완료)
   - **특징**: 내부 IP 17,739개가 외부 특정 3개 IP(80, 443 포트)로 균일 속도 다량 접속 시도 (내부 봇넷 감염).
   - **요구 기능**: 감염 추정 내부 호스트 대역(10.x) 식별 및 대규모 감염 단말 통계 표시.

4. **[긴급] C2 / 데이터 유출 의심 트래픽 (C2 & Exfiltration - Critical Vulnerability)**
   - **이벤트 건수**: 9,014건 (3.0%)
   - **정책 ID / Action**: `POL-201` / **ALLOW (치명적 허용 상태!)**
   - **위험 호스트**: `10.148.237.107`, `10.143.50.157`, `10.82.206.41` (총 3대)
   - **사용 포트**: Port 4444 (Metasploit), Port 9001 (Tor), Port 8080
   - **특징**: 평균 대비 발신 패킷 29배 초과, 미미한 수신 패킷 (전형적인 은밀 데이터 유출 패턴).
   - **요구 기능**: **[긴급 대응 모듈]** 대시보드 내 최우선 경고, 해당 3개 IP 즉시 네트워크 격리 버튼, POL-201 정책 즉시 DENY 변경 SOP 처리 기능.

### 2.2 전체 트래픽 정책 분류 요구사항
- `POL-101`: 정상 업무 트래픽 (209,143건 / 69.7% / ALLOW)
- `POL-999`: 일반 기본 차단 (37,004건 / 12.3% / DENY)
- `POL-SCAN-BLOCK`: 포트 스캔 차단 (17,981건 / 6.0% / DENY)
- `POL-DDOS-PROTECT`: DDoS 차단 (17,749건 / 5.9% / DROP)
- `POL-AUTH-LIMIT`: 무차별 대입 차단 (9,109건 / 3.0% / DENY)
- `POL-201`: C2 유출 의심 허용 (9,014건 / 3.0% / **ALLOW -> 긴급 변경 대상**)

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 종합 보안관제 대시보드 (Dashboard)
- **주요 KPI 카드**: 전체 트래픽(300k), 정상 트래픽 비율(69.7%), 차단된 공격(27.2%), **긴급 대응 필요(3.0% / 9,014건)** 표시.
- **트래픽 분배 차트**: 프로토콜 분포(TCP/UDP 등), 6대 정책별 비중 차트, 시간대별 트래픽 추이.
- **경보 우선순위 뱃지**: Critical(POL-201), High(Port Scan/DDoS), Medium(Brute Force) 구분 표시.

### 3.2 4대 위협 심층 분석 (Threat Analysis Views)
- **유형별 필터링**: 포트스캔 / 무차별대입 / Outbound DDoS / C2 유출 건별 전용 상세 분석 탭.
- **연관성 분석(Correlation Analysis)**: 출발지 IP, 목적지 IP, 목적지 포트, 발생 시각, 사용 정책 간 연관 데이터 제공.
- **데이터 역추적(Traceability)**: 최초 탐지 시각부터 C2 발신 패킷 증가 시점까지 타임라인 표시.

### 3.3 [핵심] C2 긴급 대응 SOP (Emergency Response SOP Workflow)
- **긴급 경고 배너**: POL-201 트래픽 지속 발생 시 대시보드 상단 비상 경고 연출.
- **원클릭 단말 격리 (Network Isolation)**: `10.148.237.107`, `10.143.50.157`, `10.82.206.41` 단말 격리 실행 및 상태 업데이트.
- **방화벽 정책 긴급 변경**: POL-201 Action을 `ALLOW`에서 `DENY`로 즉시 변경 요청 및 승인 기록 저장.
- **조치 이력 및 샌드박스 조사 연계**: 격리 시각, 조치자 ID, 승인 이력을 Supabase DB에 영구 기록.

### 3.4 방화벽 정책 관리 및 CSV 데이터 업로드 (Policy & CSV Ingestion)
- **정책 목록 및 관리**: POL-101 ~ POL-999 정책 상태 조회, 수정, 차단 규칙 설정.
- **CSV 로그 파일 수집/분석**: 사용자가 커스텀 UTM 로그 CSV 파일 업로드 시 즉시 파싱 및 이상 징후 분석 결과 리포트 출력.

### 3.5 PWA (Progressive Web App) 요구사항
- **오프라인 지원**: Service Worker 기반 오프라인 셸 캐싱 및 네트워크 단절 시 기존 데이터 오프라인 조회.
- **앱 설치 (Web App Manifest)**: 모바일/데스크톱 홈 화면 추가(Add to Home Screen) 지원, 독립 실행형(Standalone) UI.
- **푸시 알림 (Notification Simulation)**: C2 유출 경보 발생 시 웹 푸시 알림 수신.

---

## 4. 데이터 품질 및 규정 준수 기준 (Data Quality Standard)
PPTX 가이드라인에 따른 5대 데이터 품질 요구사항 반영:
1. **완전성 (Completeness)**: 필수 로그(시간, 출발지/목적지 IP, 포트, Action, 장비 ID) 누락 0건 유지.
2. **정확성 (Accuracy)**: 실제 UTM 조치 결과(ALLOW/DENY/DROP)와 대시보드 상태 100% 일치.
3. **일관성 (Consistency)**: 시간 표준(KST/ISO-8601), IP 비식별화 표기 기준 통일.
4. **유효성 (Validity)**: IPv4 포맷, 1~65535 포트 범위, 표준 Action Enum 규격 준수.
5. **적시성 (Timeliness)**: NTP 시각 동기화(±30초 오차 감안 연관 분석) 및 실시간 대시보드 반영.

---

## 5. 기술 스택 및 아키텍처 사양 (Tech Stack Requirements)

- **Frontend**: React (Vite 기반), JavaScript/JSX
- **Styling UI**: Bootstrap 5 (Vanilla CSS + Bootstrap Icon / Custom Dark Cyber Theme)
- **Data Visualization**: Chart.js / Chart.js React Wrapper
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, REST API, Realtime Subscriptions)
- **PWA Integration**: Vite PWA Plugin / Service Worker, Web Manifest
- **CI/CD & Hosting**: GitHub Repository + Vercel Deployment

---

## 6. 검토 및 승인 절차 (Review & Next Steps)
- 본 `spec.md` 문서 작성이 완료되었으며, 사용자의 검토 및 승인을 기다립니다.
- **사용자 승인 후 진행할 다음 단계**: `plan.md` (시스템 아키텍처, DB 스키마, Bootstrap 5 UI 레이아웃 설계, 디렉토리 구조 기술 청사진 작성)
