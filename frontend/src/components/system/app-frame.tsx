import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GlobalPageLoader } from "./global-page-loader";
import { getUiInsights, recordPageView } from "../../lib/ui-intelligence";
import { usePreferences } from "../../context/PreferencesContext";
import { useScrollReveal } from "../../lib/use-scroll-reveal";

export function AppFrame() {
  const location = useLocation();
  const { uiPersonality } = usePreferences();

  useEffect(() => {
    recordPageView(location.pathname);
    const insights = getUiInsights();
    document.documentElement.setAttribute("data-ui-intent", insights.dominantIntent);
    document.documentElement.setAttribute("data-day-segment", insights.daySegment);
    document.documentElement.setAttribute("data-ui-personality", uiPersonality);
  }, [location.pathname, uiPersonality]);

  // Re-run scroll reveal on every route change so newly mounted elements animate
  useScrollReveal(location.pathname);

  return (
    <>
      <GlobalPageLoader />
      <Outlet />
    </>
  );
}
