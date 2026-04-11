import { useEffect, useState } from "react";
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
  const isBusy =
    navigation.state !== "idle" || isFetching > 0 || isMutating > 0 || manualLoadingCount > 0;

  useEffect(() => {
    if (!isBusy) {
      setIsVisible(false);
      return;
    }

    // Avoid flashing the loader for very quick transitions.
    const timer = window.setTimeout(() => setIsVisible(true), 120);
    return () => window.clearTimeout(timer);
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
