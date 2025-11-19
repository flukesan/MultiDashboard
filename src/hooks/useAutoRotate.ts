import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboard-store';

/**
 * Hook to handle automatic dashboard rotation
 */
export function useAutoRotate() {
  const { autoRotate, nextDashboard, dashboards, stopAutoRotate } = useDashboardStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    // Only run if enabled and there are multiple dashboards
    if (!autoRotate.enabled || dashboards.length <= 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const startTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (!isPausedRef.current) {
          nextDashboard();
        }
        startTimer(); // Restart timer for continuous rotation
      }, autoRotate.interval * 1000);
    };

    startTimer();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoRotate.enabled, autoRotate.interval, dashboards.length, nextDashboard]);

  // Handle pause on hover
  useEffect(() => {
    if (!autoRotate.enabled || !autoRotate.pauseOnHover) {
      return;
    }

    const handleMouseEnter = () => {
      isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
      isPausedRef.current = false;
    };

    // Find the main dashboard container
    const dashboardElement = document.querySelector('[data-dashboard-container]');

    if (dashboardElement) {
      dashboardElement.addEventListener('mouseenter', handleMouseEnter);
      dashboardElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        dashboardElement.removeEventListener('mouseenter', handleMouseEnter);
        dashboardElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [autoRotate.enabled, autoRotate.pauseOnHover]);

  // Stop auto-rotate when user manually interacts with navigation
  useEffect(() => {
    const handleUserInteraction = () => {
      if (autoRotate.enabled) {
        // Optional: could auto-stop here, or just reset timer
        // For now, we'll let it continue
      }
    };

    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [autoRotate.enabled, stopAutoRotate]);
}
