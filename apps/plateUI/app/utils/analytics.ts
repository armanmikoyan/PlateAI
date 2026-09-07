declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== 'production') return;
  gtag('event', name, params);
}

export function trackSnapPhoto(method: 'click' | 'camera' | 'gallery' | 'drag') {
  trackEvent('snap_photo', { method });
}

export function trackAnalysisComplete(confidence: string) {
  trackEvent('analysis_complete', { confidence });
}

export function trackCheckoutStart(plan: string) {
  trackEvent('checkout_start', { plan });
}

export function trackLogin(method: 'google') {
  trackEvent('login', { method });
}
