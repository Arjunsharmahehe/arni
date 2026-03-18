# Arni — Component Registry

A shadcn-compatible component registry for publishing and distributing UI components.

This repo contains:

- A growing collection of reusable components (hero backgrounds, diff viewers, cards, etc.)
- Automated registry generation and docs integration
- A local registry workflow compatible with `shadcn add`

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev
```

Visit `http://localhost:3000/docs` to browse the component documentation.

## Registry Commands

### Add a New Component

```bash
# Interactive (recommended for first-time setup)
pnpm components:add

# Non-interactive (for agents/automation)
pnpm components:add -- \
  --slug my-component \
  --title "My Component" \
  --description "What it does" \
  --type registry:component \
  --sourcePath registry/base-vega/my-component/my-component.tsx \
  --usagePath registry/base-vega/my-component/usage.tsx \
  --previewPath registry/base-vega/my-component/preview.tsx \
  --wrapperPath components/ui/my-component.tsx
```

### Regenerate Metadata

```bash
pnpm components:update
```

### Validate Registry Items

```bash
pnpm components:check
```

### Build Distributable Registry

```bash
pnpm registry:build
```

This generates `public/r/*.json` — the files that power `shadcn add`.

## Project Structure

```
├── .agents/skills/arni/     # Agent skill for registry workflow
├── components/               # App components (docs, examples, wrappers)
├── lib/                     # Generated registry metadata
├── public/r/                 # Built shadcn registry artifacts
├── registry/
│   ├── base-vega/           # Source files for each component
│   └── items/               # Registry item metadata (JSON)
├── scripts/                 # Generator CLI scripts
└── app/                    # Next.js app (docs, previews)
```

## Environment Variables

Set these to customize registry naming and URLs:

| Variable | Description | Default |
|----------|-------------|---------|
| `REGISTRY_NAME` | Registry name in `registry.json` | `base-vega` |
| `REGISTRY_ALIAS` | Install alias (e.g. `@arni`) | `@vega` |
| `REGISTRY_HOMEPAGE` | Registry homepage URL | `http://localhost:3000` |

For docs/install command display, use the `NEXT_PUBLIC_` variants:

- `NEXT_PUBLIC_REGISTRY_ALIAS`
- `NEXT_PUBLIC_REGISTRY_HOMEPAGE`

## Using the Registry Locally

1. Build and run the registry:

```bash
pnpm registry:build
pnpm dev
```

2. In a separate project, add your registry alias to `components.json`:

```json
{
  "registries": {
    "@arni": "http://localhost:3000/r/{name}.json"
  }
}
```

3. Install components:

```bash
pnpm dlx shadcn@latest add @arni/card-wave
pnpm dlx shadcn@latest add @arni/linear-card
```

## Adding Components

See the [Agent Skill](./.agents/skills/arni/SKILL.md) for detailed workflow instructions.

Quick workflow:

1. Create component source in `registry/base-vega/<component-name>/`
2. Run `pnpm components:add` or manually create the JSON item
3. Add preview and usage files
4. Run `pnpm components:update` to regenerate metadata
5. Validate with `pnpm components:check`
6. Build with `pnpm registry:build`

## License

MIT
