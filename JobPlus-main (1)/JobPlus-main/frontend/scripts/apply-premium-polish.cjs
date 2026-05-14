const fs = require("fs");
const path = require("path");

const files = [
  {
    file: "src/pages/profile-page.tsx",
    replacements: [
      { from: '<article className="surface jp-profile-header">', to: '<article className="surface jp-profile-header jp-reveal-up">' },
      { from: '<article id="about-section" className="surface jp-profile-card">', to: '<article id="about-section" className="surface jp-profile-card jp-reveal-up">' },
      { from: '<article id="activity-section" className="surface jp-profile-card">', to: '<article id="activity-section" className="surface jp-profile-card jp-reveal-up">' },
      { from: 'return <article id={sectionId} className="surface jp-profile-card">', to: 'return <article id={sectionId} className="surface jp-profile-card jp-reveal-up">' }
    ]
  },
  {
    file: "src/pages/settings-page.tsx",
    replacements: [
      { from: '<section className="jp-settings-page">', to: '<section className="jp-settings-page jp-reveal-up">' },
      { from: '<section className="jp-settings-section surface stack">', to: '<section className="jp-settings-section surface stack jp-reveal-up">' },
      { from: '<section className="jp-settings-section surface">', to: '<section className="jp-settings-section surface jp-reveal-up">' }
    ]
  },
  {
    file: "src/pages/job-details-page.tsx",
    replacements: [
      { from: '<div className="jp-job-hero surface">', to: '<div className="jp-job-hero surface jp-reveal-up">' },
      { from: '<div className="surface jp-job-section">', to: '<div className="surface jp-job-section jp-reveal-up">' },
      { from: '<div className="surface jp-apply-section">', to: '<div className="surface jp-apply-section jp-reveal-up">' },
      { from: '<div className="surface jp-recruiter-section">', to: '<div className="surface jp-recruiter-section jp-reveal-up">' },
      { from: '<div className="surface jp-snapshot-section">', to: '<div className="surface jp-snapshot-section jp-reveal-up">' },
      { from: '<div className="surface jp-leverage-section">', to: '<div className="surface jp-leverage-section jp-reveal-up">' },
      { from: '<div className="surface jp-details-summary">', to: '<div className="surface jp-details-summary jp-reveal-up">' },
      { from: '<div className="jp-related-jobs">', to: '<div className="jp-related-jobs jp-reveal-stagger">' }
    ]
  },
  {
    file: "src/pages/apply-page.tsx",
    replacements: [
      { from: '<div className="surface" style={{ padding: "2rem" }}>', to: '<div className="surface jp-reveal-up" style={{ padding: "2rem" }}>' },
      { from: '<aside className="surface jp-detail-sidebar">', to: '<aside className="surface jp-detail-sidebar jp-reveal-up">' },
      { from: '<section className="surface jp-application-lock">', to: '<section className="surface jp-application-lock jp-reveal">' }
    ]
  },
  {
    file: "src/pages/companies-page-new.tsx",
    replacements: [
      { from: '<section className="jp-companies-hero">', to: '<section className="jp-companies-hero jp-reveal-up">' },
      { from: '<section className="jp-featured-companies">', to: '<section className="jp-featured-companies jp-reveal-stagger">' },
      { from: '<section className="jp-companies-insights">', to: '<section className="jp-companies-insights jp-reveal-stagger">' },
      { from: '<section className="jp-companies-main">', to: '<section className="jp-companies-main jp-reveal-stagger">' },
      { from: '<Link key={company.id} to={`/companies/${company.id}`} className="jp-company-card">', to: '<Link key={company.id} to={`/companies/${company.id}`} className="jp-company-card jp-reveal">' }
    ]
  },
  {
    file: "src/pages/network-page-premium.tsx",
    replacements: [
      { from: '<header className="jp-network-header">', to: '<header className="jp-network-header jp-reveal-up">' },
      { from: '<div className="jp-decision-guidance">', to: '<div className="jp-decision-guidance jp-reveal-up">' },
      { from: '<div className="jp-recruiter-pipeline">', to: '<div className="jp-recruiter-pipeline jp-reveal-stagger">' },
      { from: '<div className="jp-suggested-connections">', to: '<div className="jp-suggested-connections jp-reveal-stagger">' },
      { from: '<div key={recruiter.id} className={`jp-recruiter-card ${selectedRecruiter?.id === recruiter.id ? "is-selected" : ""} ${recruiter.priority === "high" ? "is-high-priority" : ""}`}', to: '<div key={recruiter.id} className={`jp-recruiter-card jp-reveal ${selectedRecruiter?.id === recruiter.id ? "is-selected" : ""} ${recruiter.priority === "high" ? "is-high-priority" : ""}`}' },
      { from: '<div key={connection.id} className="jp-connection-card">', to: '<div key={connection.id} className="jp-connection-card jp-reveal">' }
    ]
  }
];

const root = path.resolve(__dirname, "..");

let changed = 0;
let errors = 0;

for (const { file, replacements } of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing: ${file}`);
    errors++;
    continue;
  }
  let content = fs.readFileSync(fullPath, "utf-8");
  let localChanged = 0;
  for (const { from, to } of replacements) {
    if (!content.includes(from)) {
      console.warn(`  Skip (not found): ${from.slice(0, 60)}... in ${file}`);
      continue;
    }
    const count = content.split(from).length - 1;
    if (count > 1) {
      console.warn(`  Multiple matches (${count}) for: ${from.slice(0, 60)}... in ${file}`);
    }
    content = content.replaceAll(from, to);
    localChanged += count;
  }
  if (localChanged > 0) {
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`✅ ${file} — ${localChanged} replacements`);
    changed++;
  } else {
    console.log(`⏭️  ${file} — no replacements`);
  }
}

console.log(`\nDone. ${changed} files updated, ${errors} errors.`);
