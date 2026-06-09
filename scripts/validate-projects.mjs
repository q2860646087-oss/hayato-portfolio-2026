import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "data", "projects.ts"), "utf8");
const errors = [];

const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

if (slugs.length === 0) {
  errors.push("No project slugs were found in data/projects.ts.");
}

for (const slug of new Set(duplicateSlugs)) {
  errors.push(`Duplicate project slug: ${slug}`);
}

for (const slug of slugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`Slug should use lowercase letters, numbers, and hyphens only: ${slug}`);
  }
}

const baseMatch = source.match(/projectImageBase\s*=\s*"([^"]+)"/);
const projectImageBase = baseMatch?.[1] ?? "";
const plainImagePaths = [...source.matchAll(/"((?:\/images\/|\/projects\/)[^"]+\.(?:jpg|jpeg|png|webp))"/g)].map(
  (match) => match[1],
);
const templateImagePaths = [...source.matchAll(/\$\{projectImageBase\}([^`]+\.(?:jpg|jpeg|png|webp))/g)].map(
  (match) => `${projectImageBase}${match[1]}`,
);
const imagePaths = [...new Set([...plainImagePaths, ...templateImagePaths])];

if (imagePaths.length === 0) {
  errors.push("No local image paths were found in data/projects.ts.");
}

for (const imagePath of imagePaths) {
  const localPath = join(process.cwd(), "public", imagePath);
  if (!existsSync(localPath)) {
    errors.push(`Missing image file: ${imagePath}`);
  }
}

const requiredFields = [
  "title",
  "summary",
  "year",
  "category",
  "tools",
  "keywords",
  "coverImage",
  "detailImages",
  "infoPoints",
  "workChapters",
  "brief",
  "designIdea",
  "projectType",
  "background",
  "goals",
  "process",
  "applications",
  "conclusion",
];

for (const field of requiredFields) {
  if (!source.includes(`${field}:`)) {
    errors.push(`Required project field appears to be missing: ${field}`);
  }
}

const requiredProjectFolders = {
  "children-fashion": ["cover.jpg", "moodboard.jpg", "process-01.jpg", "process-02.jpg", "final-01.jpg", "final-02.jpg"],
  "eyecare-ip": ["cover.jpg", "moodboard.jpg", "process-01.jpg", "process-02.jpg", "final-01.jpg", "final-02.jpg"],
  branding: ["cover.jpg", "moodboard.jpg", "process-01.jpg", "process-02.jpg", "final-01.jpg", "final-02.jpg"],
};

for (const [folder, fileNames] of Object.entries(requiredProjectFolders)) {
  for (const fileName of fileNames) {
    const imagePath = `/projects/${folder}/${fileName}`;
    if (!existsSync(join(process.cwd(), "public", imagePath))) {
      errors.push(`Missing standard placeholder: ${imagePath}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Content validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Content validation passed: ${slugs.length} projects, ${imagePaths.length} images.`);
