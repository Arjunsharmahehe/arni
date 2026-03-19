#!/usr/bin/env bun

import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const ROOT = process.cwd();
const ITEMS_DIR = path.join(ROOT, "registry", "items");
const GENERATED_REGISTRY_PATH = path.join(
  ROOT,
  "lib",
  "component-registry.generated.ts",
);
const GENERATED_PREVIEWS_PATH = path.join(
  ROOT,
  "components",
  "docs",
  "component-previews.generated.tsx",
);
const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json");
const ROOT_PACKAGE_JSON_PATH = path.join(ROOT, "package.json");

const DEFAULT_REGISTRY_NAME =
  process.env.REGISTRY_NAME ??
  process.env.NEXT_PUBLIC_REGISTRY_NAME ??
  "base-vega";
const DEFAULT_REGISTRY_ALIAS =
  process.env.REGISTRY_ALIAS ??
  process.env.NEXT_PUBLIC_REGISTRY_ALIAS ??
  "@vega";
const DEFAULT_HOMEPAGE =
  process.env.REGISTRY_HOMEPAGE ??
  process.env.NEXT_PUBLIC_REGISTRY_HOMEPAGE ??
  "http://localhost:3000";
const DEFAULT_STYLE = "base-vega";
const BACKTICK_TOKEN = "__REGISTRY_BACKTICK__";

const FRAMEWORK_DEPENDENCIES = new Set(["next", "react", "react-dom"]);
const BUILTIN_MODULES = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function stripExtension(filePath) {
  return filePath.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "");
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function parseCsv(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function replaceRegistryAliasToken(value) {
  return value.replaceAll("{{REGISTRY_ALIAS}}", DEFAULT_REGISTRY_ALIAS);
}

function resolveRegistryDependencies(registryDependencies) {
  return (registryDependencies ?? []).map((dependency) =>
    replaceRegistryAliasToken(dependency),
  );
}

function getDefaultWrapperPath(slug, sourcePath) {
  if (sourcePath.includes("/background/") || slug.includes("background")) {
    return `components/backgrounds/${slug}.tsx`;
  }

  if (
    sourcePath.includes("/reactive-svg/") ||
    slug.includes("wave") ||
    slug.includes("svg")
  ) {
    return `components/reactive-svg/${slug}.tsx`;
  }

  return `components/ui/${slug}.tsx`;
}

function getTargetPathFromWrapperPath(wrapperPath) {
  if (!wrapperPath) {
    return undefined;
  }

  return toPosix(wrapperPath);
}

function getDefaultFileType(wrapperPath, fallbackType = "registry:component") {
  if (!wrapperPath) {
    return fallbackType;
  }

  const normalized = toPosix(wrapperPath);

  if (normalized.startsWith("components/ui/")) {
    return "registry:ui";
  }

  return fallbackType;
}

function normalizePackageName(specifier) {
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return name ? `${scope}/${name}` : specifier;
  }

  return specifier.split("/")[0] ?? specifier;
}

function escapeTemplateLiteral(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectImportSpecifiers(sourceCode) {
  const fromRegex =
    /(?:import|export)\s+(?:[^;]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicRegex = /import\(\s*["']([^"']+)["']\s*\)/g;
  const specifiers = new Set();

  for (const regex of [fromRegex, dynamicRegex]) {
    let match = regex.exec(sourceCode);

    while (match) {
      specifiers.add(match[1]);
      match = regex.exec(sourceCode);
    }
  }

  return [...specifiers];
}

function detectExports(sourceCode) {
  const hasDefaultExport = /\bexport\s+default\b/.test(sourceCode);
  const hasNamedExport =
    /\bexport\s+(?:const|function|class|type|interface|enum|\{)\b/.test(
      sourceCode,
    );

  return { hasDefaultExport, hasNamedExport };
}

function buildWrapperSource(importPath, sourceCode) {
  const exportsState = detectExports(sourceCode);
  const lines = [];

  if (exportsState.hasNamedExport || !exportsState.hasDefaultExport) {
    lines.push(`export * from "${importPath}";`);
  }

  if (exportsState.hasDefaultExport) {
    lines.push(`export { default } from "${importPath}";`);
  }

  return `${lines.join("\n")}\n`;
}

function readArgMap(rawArgs) {
  const map = new Map();

  for (let index = 0; index < rawArgs.length; index += 1) {
    const value = rawArgs[index];

    if (!value.startsWith("--")) {
      continue;
    }

    const [key, inlineValue] = value.slice(2).split("=", 2);

    if (inlineValue !== undefined) {
      map.set(key, inlineValue);
      continue;
    }

    const nextValue = rawArgs[index + 1];

    if (!nextValue || nextValue.startsWith("--")) {
      map.set(key, "true");
      continue;
    }

    map.set(key, nextValue);
    index += 1;
  }

  return map;
}

function hasFlag(args, key) {
  const value = args.get(key);
  if (!value) {
    return false;
  }

  return value === "true" || value === "1";
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

async function prompt(question, fallback) {
  const rl = createInterface({ input, output });

  try {
    const suffix = fallback ? ` (${fallback})` : "";
    const answer = await rl.question(`${question}${suffix}: `);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}

async function loadWorkspacePackageNames() {
  const rootPackageJson = await readJson(ROOT_PACKAGE_JSON_PATH);
  const packageNames = new Set();

  for (const section of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ]) {
    const entries = rootPackageJson[section] ?? {};

    for (const packageName of Object.keys(entries)) {
      packageNames.add(packageName);
    }
  }

  return packageNames;
}

async function loadItems() {
  const fileNames = (await fs.readdir(ITEMS_DIR)).filter((fileName) =>
    fileName.endsWith(".json"),
  );

  const items = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(ITEMS_DIR, fileName);
      const item = await readJson(filePath);
      return { filePath, item };
    }),
  );

  items.sort((left, right) => left.item.name.localeCompare(right.item.name));

  return items;
}

function requireField(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

function validatePropDefs(propDefs, context, errors) {
  if (!Array.isArray(propDefs)) {
    errors.push(`${context} must be an array.`);
    return;
  }

  for (const [index, prop] of propDefs.entries()) {
    requireField(
      typeof prop?.name === "string" && prop.name.length > 0,
      `${context}[${index}].name is required.`,
      errors,
    );
    requireField(
      typeof prop?.type === "string" && prop.type.length > 0,
      `${context}[${index}].type is required.`,
      errors,
    );
    requireField(
      typeof prop?.description === "string" && prop.description.length > 0,
      `${context}[${index}].description is required.`,
      errors,
    );
  }
}

async function validateDocsMeta(item, itemLabel, warnings, errors) {
  const docs = item.meta?.docs;

  if (!docs) {
    return;
  }

  requireField(
    typeof docs.usagePath === "string" && docs.usagePath.length > 0,
    `${itemLabel}: meta.docs.usagePath is required.`,
    errors,
  );
  requireField(
    typeof docs.sourcePath === "string" && docs.sourcePath.length > 0,
    `${itemLabel}: meta.docs.sourcePath is required.`,
    errors,
  );
  requireField(
    typeof docs.previewPath === "string" && docs.previewPath.length > 0,
    `${itemLabel}: meta.docs.previewPath is required.`,
    errors,
  );
  requireField(
    typeof docs.previewExportName === "string" &&
      docs.previewExportName.length > 0,
    `${itemLabel}: meta.docs.previewExportName is required.`,
    errors,
  );

  if (docs.usagePath) {
    const usagePath = path.join(ROOT, docs.usagePath);
    requireField(
      await pathExists(usagePath),
      `${itemLabel}: usage file not found at ${docs.usagePath}.`,
      errors,
    );
  }

  if (docs.sourcePath) {
    const sourcePath = path.join(ROOT, docs.sourcePath);
    requireField(
      await pathExists(sourcePath),
      `${itemLabel}: source file not found at ${docs.sourcePath}.`,
      errors,
    );

    const hasSourceInFiles = (item.files ?? []).some(
      (file) => file.path === docs.sourcePath,
    );

    if (!hasSourceInFiles) {
      warnings.push(
        `${itemLabel}: docs sourcePath ${docs.sourcePath} is not listed in files[].`,
      );
    }
  }

  if (docs.previewPath && docs.previewExportName) {
    const previewPath = path.join(ROOT, docs.previewPath);
    const exists = await pathExists(previewPath);
    requireField(
      exists,
      `${itemLabel}: preview file not found at ${docs.previewPath}.`,
      errors,
    );

    if (exists) {
      const previewSource = await readText(previewPath);
      const exportName = escapeRegExp(docs.previewExportName);
      const exportRegex = new RegExp(
        `export\\s+(?:function|const|class)\\s+${exportName}\\b|export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`,
        "m",
      );

      requireField(
        exportRegex.test(previewSource),
        `${itemLabel}: preview export ${docs.previewExportName} was not found in ${docs.previewPath}.`,
        errors,
      );
    }
  }

  validatePropDefs(docs.props ?? [], `${itemLabel}: meta.docs.props`, errors);

  const subComponents = docs.subComponents ?? [];
  if (!Array.isArray(subComponents)) {
    errors.push(`${itemLabel}: meta.docs.subComponents must be an array.`);
    return;
  }

  for (const [index, subComponent] of subComponents.entries()) {
    requireField(
      typeof subComponent?.name === "string" && subComponent.name.length > 0,
      `${itemLabel}: meta.docs.subComponents[${index}].name is required.`,
      errors,
    );
    requireField(
      typeof subComponent?.description === "string" &&
        subComponent.description.length > 0,
      `${itemLabel}: meta.docs.subComponents[${index}].description is required.`,
      errors,
    );

    validatePropDefs(
      subComponent?.props ?? [],
      `${itemLabel}: meta.docs.subComponents[${index}].props`,
      errors,
    );
  }
}

async function validateItemDependencies({
  item,
  itemLabel,
  workspacePackageNames,
  warnings,
  errors,
}) {
  const registryDependencies = new Set(
    resolveRegistryDependencies(item.registryDependencies),
  );
  const declaredDependencies = new Set(
    [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].map(
      normalizePackageName,
    ),
  );

  for (const file of item.files ?? []) {
    const absoluteFilePath = path.join(ROOT, file.path);

    if (!(await pathExists(absoluteFilePath))) {
      continue;
    }

    const sourceCode = await readText(absoluteFilePath);
    const importSpecifiers = collectImportSpecifiers(sourceCode);

    for (const specifier of importSpecifiers) {
      if (specifier.startsWith(".")) {
        continue;
      }

      if (BUILTIN_MODULES.has(specifier) || specifier.startsWith("node:")) {
        continue;
      }

      if (specifier.startsWith("@/registry/base-vega/")) {
        const [, , , dependentItem] = specifier.split("/");

        if (dependentItem && dependentItem !== item.name) {
          const expectedAliasDependency = `${DEFAULT_REGISTRY_ALIAS}/${dependentItem}`;
          requireField(
            registryDependencies.has(dependentItem) ||
              registryDependencies.has(expectedAliasDependency),
            `${itemLabel}: missing registryDependencies entry for ${dependentItem} imported in ${file.path}. Use ${expectedAliasDependency}.`,
            errors,
          );
        }

        continue;
      }

      if (specifier.startsWith("@/components/")) {
        if (specifier.startsWith("@/components/ui/")) {
          continue;
        }

        errors.push(
          `${itemLabel}: file ${file.path} imports ${specifier}. Use @/registry/base-vega/... imports for local registry dependencies, or @/components/ui/... for shared UI primitives.`,
        );
        continue;
      }

      if (specifier.startsWith("@/")) {
        if (specifier !== "@/lib/utils") {
          warnings.push(
            `${itemLabel}: file ${file.path} imports internal alias ${specifier}. Verify this dependency exists in target projects.`,
          );
        }
        continue;
      }

      const packageName = normalizePackageName(specifier);

      if (FRAMEWORK_DEPENDENCIES.has(packageName)) {
        continue;
      }

      requireField(
        declaredDependencies.has(packageName),
        `${itemLabel}: missing dependencies entry for ${packageName} imported in ${file.path}.`,
        errors,
      );

      if (!workspacePackageNames.has(packageName)) {
        warnings.push(
          `${itemLabel}: dependency ${packageName} is not listed in root package.json dependencies/devDependencies.`,
        );
      }
    }
  }
}

function materializeRegistryItem(item) {
  return {
    ...item,
    registryDependencies: resolveRegistryDependencies(
      item.registryDependencies,
    ),
  };
}

async function validateItems(items) {
  const warnings = [];
  const errors = [];
  const workspacePackageNames = await loadWorkspacePackageNames();
  const seenNames = new Set();

  for (const { filePath, item } of items) {
    const itemLabel = toPosix(path.relative(ROOT, filePath));

    requireField(
      typeof item.name === "string" && item.name.length > 0,
      `${itemLabel}: name is required.`,
      errors,
    );
    requireField(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name ?? ""),
      `${itemLabel}: name must be kebab-case.`,
      errors,
    );
    requireField(
      typeof item.title === "string" && item.title.length > 0,
      `${itemLabel}: title is required.`,
      errors,
    );
    requireField(
      typeof item.description === "string" && item.description.length > 0,
      `${itemLabel}: description is required.`,
      errors,
    );
    requireField(
      typeof item.type === "string" && item.type.length > 0,
      `${itemLabel}: type is required.`,
      errors,
    );

    if (seenNames.has(item.name)) {
      errors.push(`${itemLabel}: duplicate item name ${item.name}.`);
    }
    seenNames.add(item.name);

    if (!Array.isArray(item.files) || item.files.length === 0) {
      errors.push(`${itemLabel}: files must contain at least one file entry.`);
    }

    const expectedFolderPrefix = `registry/${DEFAULT_STYLE}/${item.name}/`;

    for (const [index, file] of (item.files ?? []).entries()) {
      requireField(
        typeof file?.path === "string" && file.path.length > 0,
        `${itemLabel}: files[${index}].path is required.`,
        errors,
      );
      requireField(
        typeof file?.type === "string" && file.type.length > 0,
        `${itemLabel}: files[${index}].type is required.`,
        errors,
      );

      if (!file?.path) {
        continue;
      }

      if (!toPosix(file.path).startsWith(expectedFolderPrefix)) {
        errors.push(
          `${itemLabel}: file ${file.path} must live under ${expectedFolderPrefix} for self-contained registry items.`,
        );
      }

      if (file.target && typeof file.target !== "string") {
        errors.push(`${itemLabel}: files[${index}].target must be a string.`);
      }

      const absoluteFilePath = path.join(ROOT, file.path);
      requireField(
        await pathExists(absoluteFilePath),
        `${itemLabel}: file does not exist at ${file.path}.`,
        errors,
      );
    }

    if (item.dependencies && !Array.isArray(item.dependencies)) {
      errors.push(`${itemLabel}: dependencies must be an array.`);
    }

    if (
      item.registryDependencies &&
      !Array.isArray(item.registryDependencies)
    ) {
      errors.push(`${itemLabel}: registryDependencies must be an array.`);
    }

    if (item.categories && !Array.isArray(item.categories)) {
      errors.push(`${itemLabel}: categories must be an array.`);
    }

    await validateDocsMeta(item, itemLabel, warnings, errors);
    await validateItemDependencies({
      item,
      itemLabel,
      workspacePackageNames,
      warnings,
      errors,
    });
  }

  return { warnings, errors };
}

async function buildDocsComponents(items) {
  const result = [];

  for (const { item } of items) {
    const docs = item.meta?.docs;

    if (!docs) {
      continue;
    }

    const usagePath = path.join(ROOT, docs.usagePath);
    const sourcePath = docs.sourcePath ?? item.files?.[0]?.path;

    result.push({
      slug: item.name,
      name: item.title,
      description: item.description,
      categories: item.categories ?? [],
      sourcePath,
      previewPath: docs.previewPath,
      previewExportName:
        docs.previewExportName ?? `${toPascalCase(item.name)}Preview`,
      usage: await readText(usagePath),
      props: docs.props ?? [],
      subComponents: docs.subComponents ?? [],
    });
  }

  return result;
}

async function writeGeneratedRegistry(docsComponents) {
  const entries = docsComponents
    .map(
      (component) => `  {
    slug: ${JSON.stringify(component.slug)},
    name: ${JSON.stringify(component.name)},
    description: ${JSON.stringify(component.description)},
    categories: ${JSON.stringify(component.categories ?? [])},
    sourcePath: ${JSON.stringify(component.sourcePath)},
    usage: ${BACKTICK_TOKEN}${escapeTemplateLiteral(component.usage.trim())}${BACKTICK_TOKEN},
    props: ${JSON.stringify(component.props, null, 4).replace(/^/gm, "    ").trimStart()},
    subComponents: ${JSON.stringify(component.subComponents, null, 4).replace(/^/gm, "    ").trimStart()},
  }`,
    )
    .join(",\n");

  const fileContents = `import type { ComponentMeta } from "@/lib/component-registry-schema";

export const componentRegistry: ComponentMeta[] = [
${entries}
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((component) => component.slug === slug);
}
`;

  await writeText(
    GENERATED_REGISTRY_PATH,
    fileContents.replaceAll(BACKTICK_TOKEN, "`"),
  );
}

async function writeGeneratedPreviews(docsComponents) {
  const componentsWithPreviews = docsComponents.filter(
    (component) => component.previewPath,
  );

  const imports = componentsWithPreviews
    .map(
      (component) =>
        `import { ${component.previewExportName} } from "@/${stripExtension(component.previewPath)}";`,
    )
    .join("\n");

  const previewMap = componentsWithPreviews
    .map(
      (component) =>
        `  ${JSON.stringify(component.slug)}: ${component.previewExportName},`,
    )
    .join("\n");

  const fileContents = `${imports}

const previews: Record<string, React.ComponentType> = {
${previewMap}
};

export function ComponentPreviewRenderer({ slug }: { slug: string }) {
  const Preview = previews[slug];

  if (!Preview) {
    return null;
  }

  return <Preview />;
}
`;

  await writeText(GENERATED_PREVIEWS_PATH, fileContents);
}

async function writeRegistryJson(items) {
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: DEFAULT_REGISTRY_NAME,
    homepage: DEFAULT_HOMEPAGE,
    items: items.map(({ item }) => materializeRegistryItem(item)),
  };

  await writeText(REGISTRY_JSON_PATH, `${JSON.stringify(registry, null, 2)}\n`);
}

async function formatGeneratedFiles() {
  const targets = [
    toPosix(path.relative(ROOT, GENERATED_REGISTRY_PATH)),
    toPosix(path.relative(ROOT, GENERATED_PREVIEWS_PATH)),
    toPosix(path.relative(ROOT, REGISTRY_JSON_PATH)),
  ]
    .map((target) => `"${target}"`)
    .join(" ");

  await execAsync(`pnpm exec biome format --write ${targets}`, { cwd: ROOT });
}

async function generate() {
  const items = await loadItems();
  const validation = await validateItems(items);

  for (const warning of validation.warnings) {
    output.write(`Warning: ${warning}\n`);
  }

  if (validation.errors.length > 0) {
    const message = validation.errors.map((error) => `- ${error}`).join("\n");
    throw new Error(`Registry validation failed:\n${message}`);
  }

  const docsComponents = await buildDocsComponents(items);

  await writeGeneratedRegistry(docsComponents);
  await writeGeneratedPreviews(docsComponents);
  await writeRegistryJson(items);
  await formatGeneratedFiles();

  output.write(
    `Generated docs registry for ${docsComponents.length} components.\n`,
  );
}

function createSourceStub(componentName, title) {
  return `"use client";

export function ${componentName}() {
  return <div>${title}</div>;
}
`;
}

function createUsageStub(componentName, importPath) {
  return `import { ${componentName} } from "${importPath}";

<${componentName} />
`;
}

function createPreviewStub(previewExportName, componentName, importPath) {
  return `"use client";

import { ${componentName} } from "${importPath}";

export function ${previewExportName}() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <${componentName} />
    </div>
  );
}
`;
}

async function addComponent(args) {
  const slug = args.get("slug") ?? (await prompt("Component slug", undefined));

  if (!slug) {
    throw new Error("Missing component slug.");
  }

  const metadataPath = path.join(ITEMS_DIR, `${slug}.json`);

  if (await pathExists(metadataPath)) {
    throw new Error(`Registry item already exists for ${slug}.`);
  }

  const componentName =
    args.get("componentName") ?? toPascalCase(slug.replace(/-/g, " "));
  const title =
    args.get("title") ?? (await prompt("Component title", slugToTitle(slug)));
  const description =
    args.get("description") ??
    (await prompt("Component description", `Describe ${title}.`));
  const type =
    args.get("type") ??
    (await prompt("Registry item type", "registry:component"));
  const sourcePath =
    args.get("sourcePath") ??
    (await prompt(
      "Source path",
      `registry/${DEFAULT_STYLE}/${slug}/${slug}.tsx`,
    ));
  const defaultWrapperPath = getDefaultWrapperPath(slug, sourcePath);

  const skipWrapper = hasFlag(args, "no-wrapper");
  const wrapperPathInput = skipWrapper
    ? ""
    : (args.get("wrapperPath") ??
      (await prompt("Wrapper path (- to skip)", defaultWrapperPath)));
  const wrapperPath = wrapperPathInput === "-" ? "" : wrapperPathInput;

  const fileType =
    args.get("fileType") ??
    (await prompt(
      "Primary file type",
      getDefaultFileType(wrapperPath, "registry:component"),
    ));
  const usagePath =
    args.get("usagePath") ??
    (await prompt("Usage path", `registry/${DEFAULT_STYLE}/${slug}/usage.tsx`));
  const previewPath =
    args.get("previewPath") ??
    (await prompt(
      "Preview path",
      `registry/${DEFAULT_STYLE}/${slug}/preview.tsx`,
    ));
  const previewExportName =
    args.get("previewExportName") ??
    (await prompt("Preview export name", `${toPascalCase(slug)}Preview`));

  const dependencies = parseCsv(
    args.get("dependencies") ??
      (await prompt("Dependencies (comma separated)", "")),
  );
  const categories = parseCsv(
    args.get("categories") ??
      (await prompt("Categories (comma separated)", "")),
  );
  const registryDependencies = resolveRegistryDependencies(
    parseCsv(
      args.get("registryDependencies") ??
        (await prompt("Registry dependencies (comma separated)", "")),
    ),
  );

  const absoluteSourcePath = path.join(ROOT, sourcePath);
  const absoluteUsagePath = path.join(ROOT, usagePath);
  const absolutePreviewPath = path.join(ROOT, previewPath);

  if (!(await pathExists(absoluteSourcePath))) {
    await writeText(absoluteSourcePath, createSourceStub(componentName, title));
  }

  const sourceCode = await readText(absoluteSourcePath);
  const sourceImportPath = `@/${stripExtension(toPosix(sourcePath))}`;

  let wrapperImportPath = sourceImportPath;

  if (wrapperPath) {
    const absoluteWrapperPath = path.join(ROOT, wrapperPath);
    wrapperImportPath = `@/${stripExtension(toPosix(wrapperPath))}`;

    if (!(await pathExists(absoluteWrapperPath))) {
      const wrapperSource = buildWrapperSource(sourceImportPath, sourceCode);
      await writeText(absoluteWrapperPath, wrapperSource);
    }
  }

  if (!(await pathExists(absoluteUsagePath))) {
    await writeText(
      absoluteUsagePath,
      createUsageStub(componentName, wrapperImportPath),
    );
  }

  if (!(await pathExists(absolutePreviewPath))) {
    await writeText(
      absolutePreviewPath,
      createPreviewStub(previewExportName, componentName, wrapperImportPath),
    );
  }

  const fileTarget = getTargetPathFromWrapperPath(wrapperPath);

  const metadata = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: slug,
    type,
    title,
    description,
    dependencies,
    registryDependencies,
    categories,
    files: [
      {
        path: toPosix(sourcePath),
        type: fileType,
        ...(fileTarget ? { target: fileTarget } : {}),
      },
    ],
    meta: {
      docs: {
        previewPath: toPosix(previewPath),
        previewExportName,
        usagePath: toPosix(usagePath),
        sourcePath: toPosix(sourcePath),
        props: [],
        subComponents: [],
      },
    },
  };

  await writeText(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

  await generate();
  output.write(`Added registry item ${slug}.\n`);
}

async function updateComponent(args) {
  const slug = args.get("slug") ?? args.get("name");

  if (slug) {
    const metadataPath = path.join(ITEMS_DIR, `${slug}.json`);

    if (!(await pathExists(metadataPath))) {
      throw new Error(`Registry item not found for ${slug}.`);
    }
  }

  await generate();
}

async function checkComponentRegistry() {
  const items = await loadItems();
  const validation = await validateItems(items);

  for (const warning of validation.warnings) {
    output.write(`Warning: ${warning}\n`);
  }

  if (validation.errors.length > 0) {
    const message = validation.errors.map((error) => `- ${error}`).join("\n");
    throw new Error(`Registry validation failed:\n${message}`);
  }

  output.write("Registry validation passed.\n");
}

async function main() {
  const [, , command = "generate", ...rawArgs] = process.argv;
  const args = readArgMap(rawArgs);

  switch (command) {
    case "add":
      await addComponent(args);
      break;
    case "update":
    case "generate":
      await updateComponent(args);
      break;
    case "check":
      await checkComponentRegistry();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
