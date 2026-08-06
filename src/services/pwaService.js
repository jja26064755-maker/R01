/**
 * PWA Service Worker & Push Notification Handler
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('[SW] Registered successfully:', reg.scope))
        .catch((err) => console.warn('[SW] Registration failed:', err));
    });
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('[Notification] Permission granted.');
      }
    });
  }
}

export function triggerEmergencyPushNotification(title, body) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: 'https://img.icons8.com/color/192/shield.png',
        vibrate: [200, 100, 200, 100, 200],
        data: { url: '/sop' }
      });
    });
  }
}
