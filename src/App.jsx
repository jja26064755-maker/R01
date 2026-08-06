import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ThreatAnalysisPage from './pages/ThreatAnalysisPage.jsx';
import EmergencySopPage from './pages/EmergencySopPage.jsx';
import PolicyManagerPage from './pages/PolicyManagerPage.jsx';
import CsvUploadPage from './pages/CsvUploadPage.jsx';
import { getPolicies, updatePolicyAction } from './services/sopService.js';
import { registerServiceWorker, requestNotificationPermission, triggerEmergencyPushNotification } from './services/pwaService.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [policies, setPolicies] = useState(getPolicies());
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const pol201 = policies.find(p => p.id === 'POL-201');
  const pol201Action = pol201 ? pol201.action : 'ALLOW';

  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handlePolicyUpdate = (policyId, newAction, operator = 'CERT_Officer_01') => {
    const updated = updatePolicyAction(policyId, newAction, operator);
    setPolicies([...updated]);

    if (policyId === 'POL-201' && newAction === 'DENY') {
      triggerEmergencyPushNotification(
        '🛡️ POL-201 방화벽 차단 전환 완료',
        'C2 데이터 유출 트래픽이 DENY 처리되었습니다.'
      );
    }
  };

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pol201Action={pol201Action}
        onInstallPwa={handleInstallPwa}
        canInstall={!!deferredPrompt}
      />

      <div className="container-fluid flex-grow-1 px-3 px-md-4 py-3">
        <div className="row g-3">
          {/* Sidebar Navigation */}
          <div className="col-12 col-md-3 col-xl-2">
            <div className="cyber-card p-3 sticky-top" style={{ top: '80px' }}>
              <div className="text-muted small uppercase fw-bold mb-2 px-2">관제 모듈 메뉴</div>

              <div className="nav flex-column gap-1">
                <a
                  className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  href="#dashboard"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>종합 대시보드</span>
                </a>

                <a
                  className={`sidebar-link ${activeTab === 'threats' ? 'active' : ''}`}
                  href="#threats"
                  onClick={() => setActiveTab('threats')}
                >
                  <i className="bi bi-shield-shaded"></i>
                  <span>4대 위협 심층분석</span>
                </a>

                <a
                  className={`sidebar-link ${activeTab === 'sop' ? 'active pulse-red-badge' : pol201Action === 'ALLOW' ? 'text-danger fw-bold' : ''}`}
                  href="#sop"
                  onClick={() => setActiveTab('sop')}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>C2 긴급 SOP 제어</span>
                </a>

                <a
                  className={`sidebar-link ${activeTab === 'policies' ? 'active' : ''}`}
                  href="#policies"
                  onClick={() => setActiveTab('policies')}
                >
                  <i className="bi bi-sliders"></i>
                  <span>방화벽 정책 관리</span>
                </a>

                <a
                  className={`sidebar-link ${activeTab === 'csv' ? 'active' : ''}`}
                  href="#csv"
                  onClick={() => setActiveTab('csv')}
                >
                  <i className="bi bi-file-earmark-spreadsheet"></i>
                  <span>CSV 로그 분석기</span>
                </a>
              </div>

              <hr className="border-secondary my-3" />
              <div className="small text-white-50 px-2">
                <div><i className="bi bi-hdd-network me-1"></i>Supabase Sync: <span className="text-success">Active</span></div>
                <div><i className="bi bi-phone me-1"></i>PWA Offline: <span className="text-info">Ready</span></div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-12 col-md-9 col-xl-10">
            {activeTab === 'dashboard' && (
              <DashboardPage
                policies={policies}
                pol201Action={pol201Action}
                onNavigateToSop={() => setActiveTab('sop')}
              />
            )}
            {activeTab === 'threats' && <ThreatAnalysisPage />}
            {activeTab === 'sop' && (
              <EmergencySopPage
                pol201Action={pol201Action}
                onPolicyUpdate={handlePolicyUpdate}
              />
            )}
            {activeTab === 'policies' && (
              <PolicyManagerPage
                policies={policies}
                onPolicyUpdate={handlePolicyUpdate}
              />
            )}
            {activeTab === 'csv' && <CsvUploadPage />}
          </div>
        </div>
      </div>

      <footer className="bg-dark border-top border-secondary py-3 text-center text-muted small mt-auto">
        군 사이버위협 트래픽 현황 분석 및 긴급 대응 PWA &copy; 2026 | Powered by Supabase, React, Bootstrap 5 & Vercel
      </footer>
    </div>
  );
}
