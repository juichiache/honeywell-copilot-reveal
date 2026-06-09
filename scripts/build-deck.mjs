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
