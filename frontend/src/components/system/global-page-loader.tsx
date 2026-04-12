import { useEffect, useState, useRef } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useNavigation } from "react-router-dom";
import { getGlobalLoadingCount, subscribeGlobalLoading } from "../../lib/loading-store";

function useManualLoadingCount() {
  const [count, setCount] = useState(() => getGlobalLoadingCount());

  useEffect(() => subscribeGlobalLoading(() => setCount(getGlobalLoadingCount())), []);

  return count;
}

export function GlobalPageLoader() {
  const navigation = useNavigation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const manualLoadingCount = useManualLoadingCount();
  const [isVisible, setIsVisible] = useState(false);
  const showTimerRef = useRef<number>();
  const hideTimerRef = useRef<number>();
  const maxTimerRef = useRef<number>();
  const visibleSinceRef = useRef<number>(0);
  const suppressedUntilIdleRef = useRef(false);

  const showDelayMs = 120;
  const minVisibleMs = 300;
  const maxVisibleMs = 1000;

  // Render skeletons and page sections for query loads; keep global loader route-focused.
  const isNavigating = navigation.state !== "idle";
  const hasActiveQueries = isFetching > 0 || isMutating > 0 || manualLoadingCount > 0;
  const isBusy = isNavigating || hasActiveQueries;

  useEffect(() => {
    if (!isBusy) {
      suppressedUntilIdleRef.current = false;
      if (showTimerRef.current) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = undefined;
      }
      if (maxTimerRef.current) {
        window.clearTimeout(maxTimerRef.current);
        maxTimerRef.current = undefined;
      }
      if (!isVisible) {
        return;
      }
      const elapsed = Date.now() - visibleSinceRef.current;
      const remaining = Math.max(0, minVisibleMs - elapsed);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        hideTimerRef.current = undefined;
      }, remaining);
      return;
    }

    if (suppressedUntilIdleRef.current) {
      return;
    }

    if (!showTimerRef.current && !isVisible) {
      showTimerRef.current = window.setTimeout(() => {
        setIsVisible(true);
        visibleSinceRef.current = Date.now();
        showTimerRef.current = undefined;
      }, showDelayMs);
    }

    if (!maxTimerRef.current) {
      maxTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        suppressedUntilIdleRef.current = true;
        maxTimerRef.current = undefined;
      }, maxVisibleMs);
    }

    return undefined;
  }, [isBusy]);

  useEffect(
    () => () => {
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (maxTimerRef.current) window.clearTimeout(maxTimerRef.current);
    },
    []
  );

  return (
    <div className={`jp-global-loader ${isVisible ? "is-visible" : ""}`} aria-hidden={!isVisible}>
      <div className="jp-global-loader-spinner" role="status" aria-live="polite" aria-label="Loading content">
        <span className="jp-global-loader-ring" />
      </div>
    </div>
  );
}
