export const docsSetup = {
  componentsJsonExample: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  // rest of the file
  // ...
  },
  "registries": {
    "@arni": "https://arniui.vercel.app/r/{name}.json"
  }
}`,
  componentsJsonHtml: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#8DDB8C">  "$schema"</span><span style="color:#ADBAC7">: </span><span style="color:#96D0FF">"https://ui.shadcn.com/schema.json"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#768390">  // rest of the file</span></span>
<span class="line"><span style="color:#768390">  // ...</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#96D0FF">  "registries"</span><span style="color:#ADBAC7">: {</span></span>
<span class="line"><span style="color:#8DDB8C">    "@arni"</span><span style="color:#ADBAC7">: </span><span style="color:#96D0FF">"https://arniui.vercel.app/r/{name}.json"</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>`,
  installTabs: [
    {
      label: "npx",
      title: "Install from registry",
      code: "npx shadcn@latest add @arni/hero-background",
      highlightedHtml:
        '<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>',
    },
    {
      label: "pnpm dlx",
      title: "Install from registry",
      code: "pnpm dlx shadcn@latest add @arni/hero-background",
      highlightedHtml:
        '<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>',
    },
    {
      label: "bunx",
      title: "Install from registry",
      code: "bunx --bun shadcn@latest add @arni/hero-background",
      highlightedHtml:
        '<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>',
    },
  ],
};
