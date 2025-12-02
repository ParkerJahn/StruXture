/**
 * Performance monitoring utilities for Core Web Vitals
 * Use this to track and report performance metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Core Web Vitals thresholds
 */
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report metric to console (can be extended to send to analytics)
 */
export function reportMetric(metric: PerformanceMetric): void {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  
  // TODO: Send to your analytics service
  // Example: sendToGoogleAnalytics(metric);
  // Example: sendToFirebase(metric);
}

/**
 * Monitor First Contentful Paint (FCP)
 */
export function monitorFCP(): void {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const metric: PerformanceMetric = {
          name: 'FCP',
          value: entry.startTime,
          rating: getRating(entry.startTime, THRESHOLDS.FCP),
          timestamp: Date.now(),
        };
        reportMetric(metric);
      }
    }
  });
  
  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (error) {
    console.error('Error monitoring FCP:', error);
  }
}

/**
 * Monitor Largest Contentful Paint (LCP)
 */
export function monitorLCP(): void {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    const metric: PerformanceMetric = {
      name: 'LCP',
      value: lastEntry.startTime,
      rating: getRating(lastEntry.startTime, THRESHOLDS.LCP),
      timestamp: Date.now(),
    };
    reportMetric(metric);
  });
  
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.error('Error monitoring LCP:', error);
  }
}

/**
 * Monitor First Input Delay (FID)
 */
export function monitorFID(): void {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fidEntry = entry as PerformanceEventTiming;
      const value = fidEntry.processingStart - fidEntry.startTime;
      
      const metric: PerformanceMetric = {
        name: 'FID',
        value,
        rating: getRating(value, THRESHOLDS.FID),
        timestamp: Date.now(),
      };
      reportMetric(metric);
    }
  });
  
  try {
    observer.observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.error('Error monitoring FID:', error);
  }
}

/**
 * Monitor Cumulative Layout Shift (CLS)
 */
export function monitorCLS(): void {
  if (typeof window === 'undefined') return;
  
  let clsValue = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShift = entry as LayoutShift;
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    }
    
    const metric: PerformanceMetric = {
      name: 'CLS',
      value: clsValue,
      rating: getRating(clsValue, THRESHOLDS.CLS),
      timestamp: Date.now(),
    };
    reportMetric(metric);
  });
  
  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.error('Error monitoring CLS:', error);
  }
}

/**
 * Monitor Time to First Byte (TTFB)
 */
export function monitorTTFB(): void {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const navEntry = entry as PerformanceNavigationTiming;
      const value = navEntry.responseStart - navEntry.requestStart;
      
      const metric: PerformanceMetric = {
        name: 'TTFB',
        value,
        rating: getRating(value, THRESHOLDS.TTFB),
        timestamp: Date.now(),
      };
      reportMetric(metric);
    }
  });
  
  try {
    observer.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    console.error('Error monitoring TTFB:', error);
  }
}

/**
 * Initialize all performance monitoring
 * Call this in your root layout or _app file
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  // Only monitor in production or when explicitly enabled
  const shouldMonitor = process.env.NODE_ENV === 'production' || 
                       process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
  
  if (!shouldMonitor) return;
  
  monitorFCP();
  monitorLCP();
  monitorFID();
  monitorCLS();
  monitorTTFB();
  
  console.log('🎯 Performance monitoring initialized');
}

/**
 * Get current performance metrics summary
 */
export function getPerformanceSummary(): Record<string, number> {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }
  
  const timing = window.performance.timing;
  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    // Page load timing
    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    domInteractive: timing.domInteractive - timing.navigationStart,
    
    // Network timing
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    
    // Modern metrics (if available)
    ...(navigation && {
      transferSize: navigation.transferSize || 0,
      encodedBodySize: navigation.encodedBodySize || 0,
      decodedBodySize: navigation.decodedBodySize || 0,
    }),
  };
}

// Type definitions for TypeScript
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

