import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JobPlusTopbar } from "../components/shared/jobplus-topbar";

export function MarketingLayout() {
  const { t } = useTranslation();
  return (
    <div className="page-shell">
      <JobPlusTopbar />
      <Outlet />
      <footer className="footer">
        <div className="container space-between">
          <div>
            <strong>{t("common.appName")}</strong>
            <div className="helper">{t("dashboard.subtitle")}</div>
          </div>
          <div className="helper">{t("dashboard.headline")}</div>
        </div>
      </footer>
    </div>
  );
}
