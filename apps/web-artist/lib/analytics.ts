import { getRuntimeApiBaseUrl } from './config';

export type RuntimeAnalyticsEvent = 'runtime.page_view' | 'runtime.contact_submit' | 'runtime.resolve_failure';

type AnalyticsPayload = Record<string, unknown> | undefined;

export function emitRuntimeEvent(event: RuntimeAnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') {
    return;
  }

  const body = JSON.stringify({ event, payload });
  const endpoint = `${getRuntimeApiBaseUrl()}/runtime/events`;

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body
  }).catch(() => {
    // swallow analytics errors
  });
}
