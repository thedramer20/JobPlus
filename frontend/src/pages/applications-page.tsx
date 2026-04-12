import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "../components/shared/application-card";
import { EmptyState } from "../components/shared/empty-state";
import { SkeletonList } from "../components/shared/skeleton-list";
import { listMyApplications } from "../services/applications-service";

export function ApplicationsPage() {
  const { t } = useTranslation();
  const { data: applications = [], isLoading, isError } = useQuery({ queryKey: ["applications", "me"], queryFn: listMyApplications });

  return (
    <div className="stack jp-applications-page">
      <div className="space-between">
        <div>
          <div className="eyebrow jp-applications-eyebrow">{t("applicationsPage.eyebrow")}</div>
          <h2 className="headline jp-applications-title" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
            {t("applicationsPage.title")}
          </h2>
        </div>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <span className="tag">{t("applicationsPage.tags.all")}</span>
          <span className="tag">{t("applicationsPage.tags.pending")}</span>
          <span className="tag">{t("applicationsPage.tags.reviewed")}</span>
          <span className="tag">{t("applicationsPage.tags.accepted")}</span>
        </div>
      </div>
      {isLoading ? <SkeletonList count={3} /> : null}
      {isError ? <EmptyState title={t("applicationsPage.loadErrorTitle")} description={t("applicationsPage.loadErrorDesc")} /> : null}
      {!isLoading && !isError ? (
        <div className="grid grid-2">
          {applications.length ? applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          )) : <EmptyState title={t("applicationsPage.emptyTitle")} description={t("applicationsPage.emptyDesc")} />}
        </div>
      ) : null}
    </div>
  );
}
