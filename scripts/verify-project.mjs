import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const fail = message => {
  throw new Error(message);
};

const index = read("index.html");
const manifestText = read("manifest.json");
const serviceWorker = read("sw.js");
const readme = read("README.md");
const changelog = read("CHANGELOG.md");

for (const file of ["manifest.json", "firebase.json", ".firebaserc", "normalized_stencil.json"]) {
  JSON.parse(read(file));
}

new vm.Script(serviceWorker, { filename: "sw.js" });

const inlineScripts = [...index.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
for (const [scriptIndex, match] of inlineScripts.entries()) {
  const source = match[1].trim();
  if (!source) continue;

  const openingTag = match[0].slice(0, match[0].indexOf(">") + 1);
  if (/type=["']application\/json["']/i.test(openingTag)) {
    JSON.parse(source);
  } else {
    new vm.Script(source, { filename: `index.html:inline-${scriptIndex + 1}` });
  }
}

const namedFunctions = [...index.matchAll(/^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)]
  .map(match => match[1]);
const duplicateFunctions = [...new Set(namedFunctions.filter((name, index) => namedFunctions.indexOf(name) !== index))];
if (duplicateFunctions.length) {
  fail(`Duplicate named function declarations: ${duplicateFunctions.join(", ")}`);
}

const matchVersion = (label, text, pattern) => {
  const match = text.match(pattern);
  if (!match) fail(`Could not find the ${label} version.`);
  return match[1];
};

const versions = new Map([
  ["index footer", matchVersion("index footer", index, /PDP v(\d+\.\d+\.\d+)/)],
  ["service-worker cache", matchVersion("service-worker cache", serviceWorker, /pdp-v(\d+\.\d+\.\d+)/)],
  ["README", matchVersion("README", readme, /Current version: v(\d+\.\d+\.\d+)/)],
  ["changelog", matchVersion("changelog", changelog, /^## \[(\d+\.\d+\.\d+)\]/m)]
]);

for (const [asset, version] of index.matchAll(/(?:icon192|icon512)\.png\?v=(\d+\.\d+\.\d+)/g)) {
  versions.set(`index asset ${asset}`, version);
}

const manifest = JSON.parse(manifestText);
const manifestUrls = [
  ["manifest start_url", manifest.start_url],
  ...manifest.icons.map((icon, iconIndex) => [`manifest icon ${iconIndex + 1}`, icon.src])
];
for (const [label, url] of manifestUrls) {
  versions.set(label, matchVersion(label, url, /[?&]v=(\d+\.\d+\.\d+)/));
}

const uniqueVersions = new Set(versions.values());
if (uniqueVersions.size !== 1) {
  const details = [...versions].map(([label, version]) => `  ${label}: ${version}`).join("\n");
  fail(`Version markers do not match:\n${details}`);
}

const localAssets = new Set([
  ...[...index.matchAll(/<(?:link|script)\b[^>]+(?:href|src)=["']([^"']+)["']/gi)].map(match => match[1]),
  ...manifest.icons.map(icon => icon.src),
  ...[...serviceWorker.matchAll(/^\s*["'](\.\/[^"']+)["'],?\s*$/gm)].map(match => match[1])
]);

for (const assetUrl of localAssets) {
  if (/^(?:https?:|data:)/i.test(assetUrl)) continue;

  const relativePath = assetUrl
    .replace(/^[./]+/, "")
    .split(/[?#]/, 1)[0];
  if (!relativePath || relativePath === ".") continue;
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`Referenced local asset does not exist: ${assetUrl}`);
  }
}

const version = [...uniqueVersions][0];
console.log(`PDP v${version} verified successfully.`);
console.log(`Checked ${inlineScripts.length} script blocks, ${namedFunctions.length} named functions, and ${localAssets.size} local asset references.`);
