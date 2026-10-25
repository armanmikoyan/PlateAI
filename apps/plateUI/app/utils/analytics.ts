declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean>;

type PageViewPayload = Readonly<{
  path: string;
  location: string;
  title: string;
  referrer: string;
}>;

type SnapPhotoMethod = 'click' | 'camera' | 'gallery' | 'drag';

type AnalysisEntry = 'new' | 'resume' | 'unlock';

type AnalysisFailure = 'sign_in_required' | 'server' | 'network' | 'unknown';

type LimitReason = 'plan' | 'plan_required' | 'pending' | 'daily' | 'rate_limit';

type ContactOutcome = 'success' | 'error';

type CtaLocation = 'hero' | 'nav' | 'snap_plan_required' | 'history_empty';

type OutboundLocation = 'product_hunt';

function pushCommand(...args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return;
  }

  if (params) {
    pushCommand('event', name, params);
    return;
  }

  pushCommand('event', name);
}

export function trackPageView({ path, location, title, referrer }: PageViewPayload): void {
  trackEvent('page_view', {
    page_path: path,
    page_location: location,
    page_title: title,
    page_referrer: referrer,
  });
}

export function trackCtaClick(location: CtaLocation, target: string): void {
  trackEvent('cta_click', { location, target });
}

export function trackSnapPhoto(method: SnapPhotoMethod): void {
  trackEvent('snap_photo', { method });
}

export function trackAnalysisStart(entry: AnalysisEntry): void {
  trackEvent('analysis_start', { entry });
}

export function trackAnalysisComplete(confidence: string, locked = false): void {
  trackEvent('analysis_complete', { confidence, locked });
}

export function trackAnalysisFailed(reason: AnalysisFailure): void {
  trackEvent('analysis_failed', { reason });
}

export function trackLimitReached(reason: LimitReason): void {
  trackEvent('limit_reached', { reason });
}

export function trackPlanSelect(plan: string): void {
  trackEvent('plan_select', { plan });
}

export function trackCheckoutStart(plan: string): void {
  trackEvent('checkout_start', { plan });
}

export function trackPurchase(plan: string): void {
  trackEvent('purchase', { plan });
}

export function trackManageSubscription(): void {
  trackEvent('manage_subscription');
}

export function trackMealOpen(status: string): void {
  trackEvent('meal_open', { status });
}

export function trackMealDelete(): void {
  trackEvent('meal_delete');
}

export function trackContactSubmit(outcome: ContactOutcome): void {
  trackEvent('contact_submit', { outcome });
}

export function trackFaqOpen(faqId: string): void {
  trackEvent('faq_open', { faq_id: faqId });
}

export function trackOutboundClick(location: OutboundLocation, url: string): void {
  trackEvent('outbound_click', { location, url });
}

export function trackLogin(method: 'google'): void {
  trackEvent('login', { method });
}

export function trackWebVital(metric: string, value: number, rating: string): void {
  trackEvent('web_vitals', {
    metric,
    value: Math.round(metric === 'CLS' ? value * 1000 : value),
    rating,
  });
}
