---
name: arni
description: Maintain and extend the Arni shadcn-compatible component registry in this repo. Use when adding, updating, validating, or publishing components, and when troubleshooting install paths, registry dependencies, alias config, or generated docs integration.
---

# Arni Registry Workflow

This skill is for working on the Arni component registry and docs system in this project.

Use it whenever the task involves:
- adding a new component
- moving or refactoring existing registry items
- updating docs preview/usage/source integration
- fixing `shadcn add` install behavior
- validating `registry/items/*.json`
- building registry artifacts in `public/r`

## Mental Model

There are three layers:

1. Source of truth (authored)
- `registry/items/*.json`
- `registry/base-vega/<slug>/*`

2. Generated docs/runtime metadata
- `lib/component-registry.generated.ts`
- `components/docs/component-previews.generated.tsx`
- `registry.json`

3. Built distributable artifacts
- `public/r/*.json` (from `shadcn build`)

Do not hand-edit generated files unless explicitly debugging generation output.

## Key Conventions

### Registry source layout
- Registry source files must live under `registry/base-vega/<slug>/...`.
- Registry source should import other local registry components via `@/registry/base-vega/...`.
- Avoid `@/components/...` imports inside registry source files.

### Consumer install targets
- `registry:ui` is used for UI components that install into `components/ui/...`.
- For custom install locations (e.g. `components/reactive-svg/...`, `components/backgrounds/...`), use explicit `target` in the `files` entry.

### Registry dependencies
- For local registry-to-registry dependencies, use namespaced aliases:
  - `"registryDependencies": ["{{REGISTRY_ALIAS}}/card-wave"]`
- Do not use bare `"card-wave"` unless intentionally targeting default upstream style registries.

## Commands

### Add a component
- Interactive:
  - `pnpm components:add`
- Non-interactive (preferred for agents):
  - `pnpm components:add -- --slug my-component --title "My Component" --description "..." --type registry:component --sourcePath registry/base-vega/my-component/my-component.tsx --usagePath registry/base-vega/my-component/usage.tsx --previewPath registry/base-vega/my-component/preview.tsx --wrapperPath components/ui/my-component.tsx`

What `components:add` does:
- creates `registry/items/<slug>.json`
- creates source/usage/preview stubs when missing
- creates a wrapper file unless `--no-wrapper`
- derives install `target` from wrapper path
- regenerates docs/registry outputs

### Regenerate metadata
- `pnpm components:update`
- `pnpm components:generate` (alias behavior in this repo)

### Validate authored metadata and imports
- `pnpm components:check`

### Build distributable shadcn registry output
- `pnpm registry:build`

## Required Workflow for Changes

When adding/updating components, do this in order:

1. Edit authored files
- registry item JSON
- registry source files
- usage/preview as needed

2. Regenerate
- `pnpm components:update`

3. Validate
- `pnpm components:check`

4. Build registry artifacts
- `pnpm registry:build`

5. Build app
- `pnpm build`

If any step fails, fix the authored files and repeat.

## Env Vars (Single Source for Naming/Domain)

Set these so alias/domain/name are not hardcoded across files.

Generator/build vars:
- `REGISTRY_NAME` (default `base-vega`)
- `REGISTRY_ALIAS` (default `@vega`)
- `REGISTRY_HOMEPAGE` (default `http://localhost:3000`)

Docs/install command display vars:
- `NEXT_PUBLIC_REGISTRY_ALIAS`
- `NEXT_PUBLIC_REGISTRY_HOMEPAGE`
- `NEXT_PUBLIC_REGISTRY_URL_TEMPLATE`

Recommended for consistency: set both `REGISTRY_ALIAS` and `NEXT_PUBLIC_REGISTRY_ALIAS` to the same value (e.g. `@arni`).

## Local Testing Playbook

In this repo:
1. `pnpm registry:build`
2. `pnpm dev`
3. Confirm:
   - `http://localhost:3000/r/registry.json`
   - `http://localhost:3000/r/<component>.json`

In a separate consumer app:
1. Set `components.json` registries alias, for example:
   - `"@arni": "http://localhost:3000/r/{name}.json"`
2. Install:
   - `pnpm dlx shadcn@latest add @arni/card-wave`
   - `pnpm dlx shadcn@latest add @arni/linear-card`
3. Verify files install to expected targets.

## Troubleshooting Quick Guide

### Symptom: dependency resolves to ui.shadcn.com
Cause:
- `registryDependencies` used bare item names.

Fix:
- Use namespaced dependency, e.g. `"{{REGISTRY_ALIAS}}/card-wave"`.

### Symptom: installed file lands in `components/<name>.tsx`
Cause:
- Missing `target` and non-`registry:ui` type.

Fix:
- For `components/ui/*`: use `registry:ui` and/or `target`.
- For custom folders: set `target` explicitly.

### Symptom: docs or preview map stale
Cause:
- Generated files not refreshed.

Fix:
- Run `pnpm components:update`.

### Symptom: validation error about missing files/imports
Cause:
- item JSON points to moved paths or invalid imports.

Fix:
- update `files[].path`, `meta.docs.sourcePath`, `meta.docs.previewPath`, and imports.

## Definition of Done Checklist

Before finishing a registry-related task, ensure:
- `pnpm components:update` passes
- `pnpm components:check` passes
- `pnpm registry:build` passes
- `pnpm build` passes
- install paths match intended target folders
- dependency installs use the configured registry alias (e.g. `@arni/...`)
