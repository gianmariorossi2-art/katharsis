import posthog from 'posthog-js';

export const track = (event: string, properties?: Record<string, unknown>) => {
  posthog.capture(event, properties);
};
