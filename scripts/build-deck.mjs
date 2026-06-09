import fs from "node:fs/promises";
import path from "node:path";
import { icons } from "./icons.mjs";

const root = process.cwd();
const templatePath = path.join(root, "src", "template.html");
const slideDataPath = path.join(root, "data", "slides.json");
const outputPath = path.join(root, "index.html");

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const chipsHtml = (points = []) => {
  if (!points.length) return "";
  return `<div class="chips">${points
    .map((p) => `<div class="chip">${escapeHtml(p)}</div>`)
    .join("")}</div>`;
};

const quoteHtml = (quotes = []) => {
  if (!quotes.length) return "";
  return `<div class="quotes">${quotes
    .map((q) => `<blockquote class="pull-quote">${escapeHtml(q)}</blockquote>`)
    .join("")}</div>`;
};

const splitHtml = (split) => {
  if (!split) return "";
  return `
    <div class="split">
      <div class="card">
        <h4>${escapeHtml(split.leftTitle || "")}</h4>
        ${chipsHtml(split.left || [])}
      </div>
      <div class="card">
        <h4>${escapeHtml(split.rightTitle || "")}</h4>
        ${chipsHtml(split.right || [])}
      </div>
    </div>
  `;
};

const beforeAfterHtml = (ba) => {
  if (!ba) return "";
  return `
    <div class="split ba-split">
      <div class="card before"><h4>Before</h4>${chipsHtml(ba.before || [])}</div>
      <div class="card after"><h4>After</h4>${chipsHtml(ba.after || [])}</div>
    </div>
  `;
};

const statsHtml = (stats = [], source = "") => {
  if (!stats.length) return "";
  const empIdx = stats.findIndex((s) => s.emphasis);
  const topStats = empIdx > 0 ? stats.slice(0, empIdx) : stats.filter((s) => !s.emphasis).slice(0, 3);
  const empStat = empIdx >= 0 ? stats[empIdx] : null;
  const bottomStats = empIdx >= 0 ? stats.slice(empIdx + 1) : [];

  const statCard = (s, cls = "") => `
    <div class="stat-card${cls}">
      <div class="stat-value">${escapeHtml(s.value)}</div>
      <div class="stat-label">${escapeHtml(s.label)}</div>
      ${s.detail ? `<div class="stat-detail">${escapeHtml(s.detail)}</div>` : ""}
    </div>`;

  return `<div class="stats-block">
    ${topStats.length ? `<div class="stats-row">${topStats.map((s) => statCard(s)).join("")}</div>` : ""}
    ${empStat ? statCard(empStat, " stat-emphasis") : ""}
    ${bottomStats.length ? `<div class="stats-row">${bottomStats.map((s) => statCard(s)).join("")}</div>` : ""}
    ${source ? `<div class="stats-source">\u25ba ${escapeHtml(source)}</div>` : ""}
  </div>`;
};

const heroHtml = (slide) => {
  if (slide.visual) {
    return `<img class="hero-svg" src="${escapeHtml(slide.visual)}" alt="${escapeHtml(slide.title || "Slide visual")}" />`;
  }
  if (slide.icon && icons[slide.icon]) {
    return `<div class="hero-icon">${icons[slide.icon]}</div>`;
  }
  if (slide.bigStat) {
    return `<div class="hero-stat"><div class="stat-value">${escapeHtml(slide.bigStat.value)}</div><div class="stat-label">${escapeHtml(slide.bigStat.label)}</div></div>`;
  }
  return "";
};

const lessonsHtml = (lessons = []) => {
  if (!lessons.length) return "";
  const rows = lessons
    .map(
      (r) => `<tr>
        <td>${escapeHtml(r.learned)}</td>
        <td>${escapeHtml(r.change)}</td>
        <td>${escapeHtml(r.example)}</td>
      </tr>`
    )
    .join("");
  return `
    <table class="lessons-table">
      <thead><tr>
        <th>What we learned</th>
        <th>What we should change</th>
        <th>Example</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
};

const buildSlide = (slide) => {
  const parts = [];
  const layout = slide.layout || (slide.visual ? "visual" : slide.icon ? "icon" : "text");
  const classes = ["slide", `layout-${layout}`];
  if (slide.titleOnly) classes.push("title-slide");

  if (slide.kicker) parts.push(`<div class="kicker">${escapeHtml(slide.kicker)}</div>`);
  if (slide.title) parts.push(`<h2>${escapeHtml(slide.title)}</h2>`);
  if (slide.subtitle) parts.push(`<p class="subtitle">${escapeHtml(slide.subtitle)}</p>`);

  const hero = heroHtml(slide);
  if (hero) parts.push(hero);

  if (slide.tagline) parts.push(`<p class="tagline">${escapeHtml(slide.tagline)}</p>`);
  parts.push(chipsHtml(slide.points));
  parts.push(beforeAfterHtml(slide.beforeAfter));
  parts.push(splitHtml(slide.split));
  parts.push(quoteHtml(slide.quotes));
  parts.push(statsHtml(slide.stats || [], slide.source || ""));

  if (slide.bottomLine) parts.push(`<div class="bottom-line"><strong>Bottom line:</strong> ${escapeHtml(slide.bottomLine)}</div>`);

  return `<section class="${classes.join(" ")}">${parts.filter(Boolean).join("\n")}</section>`;
};

const run = async () => {
  const [template, rawSlides] = await Promise.all([
    fs.readFile(templatePath, "utf8"),
    fs.readFile(slideDataPath, "utf8")
  ]);

  const slides = JSON.parse(rawSlides);
  const slideSections = slides.map(buildSlide).join("\n");
  const html = template.replace("%%SLIDES%%", slideSections);

  await fs.writeFile(outputPath, html, "utf8");
  console.log(`Built ${slides.length} slides -> ${outputPath}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
