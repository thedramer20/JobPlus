import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GlobalPageLoader } from "./global-page-loader";
import { getUiInsights, recordPageView } from "../../lib/ui-intelligence";
import { usePreferences } from "../../context/PreferencesContext";

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

  return (
    <>
      <GlobalPageLoader />
      <Outlet />
    </>
  );
}
