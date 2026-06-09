import fs from "node:fs/promises";
import path from "node:path";

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

const listHtml = (items = []) => {
  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

const quoteHtml = (quotes = []) => {
  if (!quotes.length) return "";
  return quotes
    .map(
      (quote) => `<blockquote class="small" style="border-left:4px solid #8aa8ff;padding-left:1rem;">${escapeHtml(quote)}</blockquote>`
    )
    .join("");
};

const splitBulletsHtml = (splitBullets) => {
  if (!splitBullets) return "";
  return `
    <div class="split small">
      <div class="card">
        <h4>${escapeHtml(splitBullets.leftTitle || "Left")}</h4>
        ${listHtml(splitBullets.left || [])}
      </div>
      <div class="card">
        <h4>${escapeHtml(splitBullets.rightTitle || "Right")}</h4>
        ${listHtml(splitBullets.right || [])}
      </div>
    </div>
  `;
};

const beforeAfterHtml = (beforeAfter) => {
  if (!beforeAfter) return "";
  return `
    <div class="split small">
      <div class="card">
        <h4>Before</h4>
        ${listHtml(beforeAfter.before || [])}
      </div>
      <div class="card">
        <h4>After</h4>
        ${listHtml(beforeAfter.after || [])}
      </div>
    </div>
  `;
};

const visualHtmlForSlide = (slide, index) => {
  if (slide.visual) {
    return `<img class="diagram" src="${escapeHtml(slide.visual)}" alt="${escapeHtml(slide.title || "Slide visual")}" />`;
  }
  if (index === 1) {
    return `<img class="diagram" src="assets/current-way-diagram.svg" alt="Fragmented workflow diagram" />`;
  }
  return "";
};

const buildSlide = (slide, index) => {
  const parts = [];
  const hasVisual = Boolean(slide.visual || index === 1);
  const className = hasVisual ? ' class="has-visual"' : "";
  if (slide.kicker) parts.push(`<div class="kicker">${escapeHtml(slide.kicker)}</div>`);
  if (slide.title) parts.push(`<h2>${escapeHtml(slide.title)}</h2>`);
  if (slide.subtitle) parts.push(`<p>${escapeHtml(slide.subtitle)}</p>`);
  if (slide.keyMessage) parts.push(`<p><strong>Key message:</strong> ${escapeHtml(slide.keyMessage)}</p>`);
  parts.push(quoteHtml(slide.quotes));
  parts.push(listHtml(slide.bullets));
  parts.push(beforeAfterHtml(slide.beforeAfter));
  parts.push(splitBulletsHtml(slide.splitBullets));
  parts.push(visualHtmlForSlide(slide, index));
  if (slide.speakerNote) parts.push(`<p class="small"><em>Speaker note: ${escapeHtml(slide.speakerNote)}</em></p>`);
  if (slide.bottomLine) parts.push(`<div class="bottom-line"><strong>Bottom line:</strong> ${escapeHtml(slide.bottomLine)}</div>`);
  return `<section${className}>${parts.filter(Boolean).join("\n")}</section>`;
};

const run = async () => {
  const [template, rawSlides] = await Promise.all([
    fs.readFile(templatePath, "utf8"),
    fs.readFile(slideDataPath, "utf8")
  ]);

  const slides = JSON.parse(rawSlides);
  const slideSections = slides.map((slide, index) => buildSlide(slide, index)).join("\n");
  const html = template.replace("%%SLIDES%%", slideSections);

  await fs.writeFile(outputPath, html, "utf8");
  console.log(`Built ${slides.length} slides -> ${outputPath}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
