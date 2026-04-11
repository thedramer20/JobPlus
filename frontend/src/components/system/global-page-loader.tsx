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
  const timerRef = useRef<number>();

  // Only show loader for actual navigation, not for background queries
  const isNavigating = navigation.state !== "idle";
  const hasActiveQueries = isFetching > 0 || isMutating > 0 || manualLoadingCount > 0;
  const isBusy = isNavigating || hasActiveQueries;

  useEffect(() => {
    if (!isBusy) {
      // Hide immediately when not busy
      setIsVisible(false);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      return;
    }

    // Only show loader after a very short delay (50ms) to avoid flashing
    // This makes the app feel more responsive
    if (!timerRef.current) {
      timerRef.current = window.setTimeout(() => {
        setIsVisible(true);
        timerRef.current = undefined;
      }, 50);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [isBusy]);

  return (
    <div className={`jp-global-loader ${isVisible ? "is-visible" : ""}`} aria-hidden={!isVisible}>
      <div className="jp-global-loader-backdrop" />
      <div className="jp-global-loader-spinner" role="status" aria-live="polite" aria-label="Loading content">
        <span className="jp-global-loader-ring" />
      </div>
    </div>
  );
}
