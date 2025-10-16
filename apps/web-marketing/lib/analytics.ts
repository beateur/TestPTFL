export type LandingAnalyticsEvent =
  | 'landing.pricing.cta_click'
  | 'landing.testimonial.play'
  | 'landing.lead.submit_success'
  | 'landing.lead.submit_error'
  | 'landing.section.view';

type AnalyticsPayload = Record<string, unknown> | undefined;

interface AnalyticsEventEnvelope {
  name: LandingAnalyticsEvent;
  payload?: AnalyticsPayload;
  timestamp: number;
}

declare global {
  interface Window {
    dataLayer?: AnalyticsEventEnvelope[];
  }
}

export function trackEvent(name: LandingAnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') {
    return;
  }

  const event: AnalyticsEventEnvelope = {
    name,
    payload,
    timestamp: Date.now()
  };

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push(event);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event);
  }
}

export function trackSectionView(section: string) {
  trackEvent('landing.section.view', { section });
}
