'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackWebVital } from '@/app/utils/analytics';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    trackWebVital(metric.name, metric.value, metric.rating ?? 'unknown');
  });

  return null;
}
