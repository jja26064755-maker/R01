# [Plan] 군 사이버위협 트래픽 현황 분석 및 긴급 대응 PWA 기술 설계서

## 1. 시스템 아키텍처 (System Architecture)

본 시스템은 **Vite + React** 기반의 SPA(Single Page Application)에 PWA 기능을 결합하고, **Supabase (PostgreSQL & Realtime)**를 백엔드로 활용하며, **Bootstrap 5 (Dark Cyber Security Theme)**로 구축합니다.

```
[ UTM Firewall / Log Input (CSV or Seed) ]
                  │
                  ▼
   [ Client Data Analyzer / Parser ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [ Supabase DB ]     [ Local PWA State / IndexDB Cache ]
 (Logs/Policies/SOP)        │
        │                   ▼
        └─────────► [ React UI (Bootstrap 5) ]
                     ├── Dashboard (Chart.js)
                     ├── 4대 위협 분석 (Filterable Tables)
                     ├── [긴급] C2 SOP 제어반 (Isolation RPC)
                     └── PWA Service Worker (Notification/Offline)
```

---

## 2. DB 스키마 설계 (Supabase PostgreSQL Schema)

### 2.1 테이블 명세 (`supabase/schema.sql`)

#### 1) `traffic_logs` (방화벽 로그 수집/분석 데이터)
| 컬럼명 | 데이터 타입 | 제약 조건 / 설명 |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `timestamp` | `timestamptz` | 로그 발생 시각 |
| `src_ip` | `varchar(45)` | 출발지 IP |
| `dst_ip` | `varchar(45)` | 목적지 IP |
| `src_port` | `integer` | 출발지 포트 |
| `dst_port` | `integer` | 목적지 포트 |
| `protocol` | `varchar(10)` | TCP / UDP / ICMP |
| `bytes_sent` | `bigint` | 송신 패킷 크기 (Bytes) |
| `bytes_recv` | `bigint` | 수신 패킷 크기 (Bytes) |
| `policy_id` | `varchar(30)` | POL-101, POL-201, POL-SCAN-BLOCK 등 |
| `action` | `varchar(10)` | ALLOW / DENY / DROP |
| `threat_type` | `varchar(30)` | Normal, PortScan, BruteForce, OutboundDDoS, C2Exfiltration |
| `risk_level` | `varchar(10)` | Low, Medium, High, Critical |

#### 2) `policies` (방화벽 정책 레지스트리)
| 컬럼명 | 데이터 타입 | 제약 조건 / 설명 |
|---|---|---|
| `policy_id` | `varchar(30)` | PK (예: `POL-201`) |
| `policy_name` | `varchar(100)` | 정책명 |
| `description` | `text` | 정책 상세 설명 |
| `action` | `varchar(10)` | ALLOW / DENY / DROP |
| `risk_level` | `varchar(10)` | Critical, High, Medium, Low |
| `event_count` | `integer` | 해당 정책 발생 총 건수 |
| `updated_at` | `timestamptz` | 최종 수정 일시 |

#### 3) `isolated_hosts` (긴급 격리 단말 관리)
| 컬럼명 | 데이터 타입 | 제약 조건 / 설명 |
|---|---|---|
| `id` | `uuid` | PK |
| `ip_address` | `varchar(45)` | Unique, 격리 대상 IP |
| `host_name` | `varchar(100)` | 식별 단말 명칭 |
| `threat_reason` | `text` | 격리 사유 (예: POL-201 C2 Tor/Metasploit 패킷 유출) |
| `status` | `varchar(20)` | ISOLATED / RESTORED |
| `isolated_at` | `timestamptz` | 격리 조치 일시 |
| `isolated_by` | `varchar(50)` | 조치자 ID/담당자 |

#### 4) `sop_action_logs` (SOP 긴급 조치 수행 이력)
| 컬럼명 | 데이터 타입 | 제약 조건 / 설명 |
|---|---|---|
| `id` | `uuid` | PK |
| `action_type` | `varchar(30)` | HOST_ISOLATION / POLICY_CHANGE |
| `target_ip` | `varchar(45)` | 대상 IP |
| `policy_id` | `varchar(30)` | 변경 정책 ID |
| `old_status` | `varchar(20)` | 변경 전 상태 (예: ALLOW) |
| `new_status` | `varchar(20)` | 변경 후 상태 (예: DENY) |
| `operator` | `varchar(50)` | 조치자 |
| `created_at` | `timestamptz` | 조치 일시 |

---

## 3. Bootstrap 5 기반 UI 레이아웃 설계 (Cyber Dark Theme)

### 3.1 컬러 팔레트 & 디자인 시스템
- **Background**: `#0f172a` (Slate 900 - 사이버 묵직한 다크 배경)
- **Card Container**: `#1e293b` (Slate 800 - 반투명 패널 룩)
- **Primary Cyber Accent**: `#0284c7` (Neon Cyan/Blue)
- **Critical / Emergency Alert**: `#ef4444` (Crimson Red - 긴급 C2 경보)
- **Warning**: `#f59e0b` (Amber Orange - 포트스캔/DDoS)
- **Success / Isolated**: `#10b981` (Emerald Green)

### 3.2 화면 구조 (Wireframe)
1. **상단 긴급 링커 (Header Navbar)**
   - 브랜드 로고: `🛡️ 군 사이버위협 트래픽 현황 PWA`
   - **POL-201 긴급 비상 알림 텍스쳐**: C2 유출 허용 상태 3개 단말 실시간 깜빡임 경고 뱃지
   - PWA 설치 버튼 & 오프라인 동기화 상태 표시등
2. **메인 레이아웃 (Sidebar Nav + Main Content Area)**
   - **대시보드 (`/dashboard`)**: 4개 KPI 요약 카드 + 300,000건 이벤트 비율 도넛 차트 + 시간대별 트래픽 추이 그래프
   - **4대 위협 분석 (`/threats`)**:
     - 탭 1: 포트 스캔 (17,981건 / POL-SCAN-BLOCK)
     - 탭 2: 분산 무차별 대입 (9,109건 / POL-AUTH-LIMIT)
     - 탭 3: Outbound DDoS (17,749건 / POL-DDOS-PROTECT)
     - 탭 4: C2 유출 의심 (9,014건 / POL-201 - Critical)
   - **[긴급] C2 SOP 제어반 (`/sop`)**:
     - `10.148.237.107`, `10.143.50.157`, `10.82.206.41` 단말별 격리 버튼 및 실시간 상태 카드
     - `POL-201` 정책 `ALLOW -> DENY` 승인 및 즉시 차단 실행 버튼
     - SOP 조치 타임라인 이력 로그
   - **방화벽 정책 관리자 (`/policies`)**: 6개 정책 CRUD 및 Action 상태 전환
   - **CSV 분석기 (`/csv-upload`)**: 실시간 UTM 로그 파일 드래그&드롭 파싱 및 비정상 탐지 시각화

---

## 4. 디렉토리 구조 (Directory Structure)

```
app/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                  # Dark Cyber Theme Overrides & Animations
│   ├── components/
│   │   ├── Navbar.jsx             # Top Navbar with Emergency Ticker & PWA Install
│   │   ├── Sidebar.jsx            # Navigation Sidebar / Bottom Nav for Mobile
│   │   ├── EmergencyBanner.jsx    # Critical POL-201 Alert Banner
│   │   ├── KpiCards.jsx           # 300,000 Traffic Analytics KPI Summary Cards
│   │   ├── TrafficCharts.jsx      # Chart.js Integration (Donut & Line Charts)
│   │   ├── ThreatTable.jsx        # Data Table with Filter & Sorting
│   │   ├── HostIsolationCard.jsx  # Individual C2 Host Isolation Control Card
│   │   └── SopModal.jsx           # SOP Action Confirmation Modal
│   ├── pages/
│   │   ├── DashboardPage.jsx      # Overview Analytics Dashboard
│   │   ├── ThreatAnalysisPage.jsx # 4 Threat Scenarios Detailed Analysis
│   │   ├── EmergencySopPage.jsx   # C2 Isolation & Policy SOP Action Page
│   │   ├── PolicyManagerPage.jsx  # Firewall Policy Management Page
│   │   └── CsvUploadPage.jsx      # Custom Log Upload & Parser Page
│   ├── services/
│   │   ├── supabaseClient.js      # Supabase Client Initialization
│   │   ├── mockDataService.js     # 300,000 Log Dataset Summary & Seed Loader
│   │   ├── sopService.js          # Host Isolation & Policy Update Logic
│   │   └── pwaService.js          # Service Worker & Push Notification Handler
│   └── utils/
│       └── formatters.js          # IP, Port, Timestamp, Byte Size Formatters
├── supabase/
│   └── schema.sql                 # PostgreSQL DDL & Seed Insert Script
└── tests/
    └── test_log_analyzer.py       # TDD Validation Scripts (pytest for Log Rules)
```

---

## 5. PWA (Progressive Web App) 오프라인 및 알림 전략

1. **Service Worker (`vite-plugin-pwa`)**:
   - UI 셸 및 정적 자산(CSS, JS, Fonts, Chart libraries) Pre-cache.
   - Supabase 네트워크 단절 시 IndexDB / LocalStorage에 대시보드 통계 및 격리 상태 임시 저장.
2. **웹 푸시 알림 (Web Push Notification)**:
   - `POL-201` 패킷 증가 감지 시 브라우저 및 OS 수준의 긴급 알림 팝업 발송 (`[경고] C2 데이터 유출 트래픽 감지 - 즉시 격리 필요`).
3. **PWA 설치성 (Installability)**:
   - `manifest.json` 내 `display: standalone`, `theme_color: #0f172a` 설정으로 모바일/PC 홈 화면 앱 추가 지원.

---

## 6. TDD (pytest) 검증 전략

- **파이썬 pytest 기반 검증 모듈 (`tests/test_log_analyzer.py`)**:
  1. 300,000건 데이터의 정책별 건수 정확성 검증 (`POL-101: 209,143`, `POL-201: 9,014` 등)
  2. C2 의심 3개 호스트(`10.148.237.107`, `10.143.50.157`, `10.82.206.41`) 자동 추출 규칙 검증
  3. `POL-201` 정책 변경 (`ALLOW -> DENY`) 상태 전이 유효성 검증
  4. 데이터 품질 5대 기준 (완전성, 정확성, 일관성, 유효성, 적시성) 자동 통과 검증

---

## 7. 검토 및 승인 절차 (Review & Next Steps)
- 본 `plan.md` 설계 문서가 완성되었습니다.
- **사용자 승인 후 진행할 다음 단계**: `tasks.md` (15~30분 단위 구현 단위 작업 및 TDD pytest 검증 단계 작성)
