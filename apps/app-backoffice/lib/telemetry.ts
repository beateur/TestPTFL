type EventPayload = Record<string, unknown> | undefined;

export function trackEvent(event: string, payload?: EventPayload) {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[telemetry]', event, payload ?? {});
    return;
  }

  window.dispatchEvent(
    new CustomEvent('lumina:telemetry', {
      detail: {
        event,
        payload,
        timestamp: Date.now()
      }
    })
  );
}

