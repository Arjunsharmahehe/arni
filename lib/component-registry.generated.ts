import type { ComponentMeta } from "@/lib/component-registry-schema";

export const componentRegistry: ComponentMeta[] = [
  {
    slug: "card-wave",
    name: "Card Wave",
    description:
      "A tastefull svg with interactive hover effects to make the boring cards interesting",
    categories: ["svg", "motion"],
    sourcePath: "registry/base-vega/card-wave/card-wave.tsx",
    sourceCode: `import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type MouseEventHandler, useRef } from "react";

const BASE_W = 223;
const BASE_DX = -20;
const BASE_DY = 4;
const BASE_H = 32;
const MAX_H = 100;
const VB_W = 420;
const VB_H = 260;

function expWave(dist: number) {
  const d = Math.abs(dist) / 45;
  const rate = dist > 0 ? 0.75 : 2.6;
  return Math.exp(-d * rate);
}

function buildOutline(x: number, y: number, h: number, s: number) {
  return [
    \`M \${x + 212.875 * s} \${y + h + 108}\`,
    \`C \${x + 210.875 * s} \${y + h + 107} \${x + 166.375 * s} \${y + h + 84.8} \${x + 4.375 * s} \${y + h + 4}\`,
    \`C \${x + 4.375 * s} \${y + h + 4} \${x + 1.375 * s} \${y + h + 2.245} \${x + 0.875 * s} \${y + h + 0.122}\`,
    \`C \${x + 0.375 * s} \${y + h - 2} \${x + 0.375 * s} \${y + 6.5} \${x + 0.875 * s} \${y + 4.5}\`,
    \`C \${x + 1.375 * s} \${y + 2.5} \${x + 3.875 * s} \${y + 0.5} \${x + 5.375 * s} \${y + 0.5}\`,
    \`H \${x + 7.875 * s}\`,
    \`C \${x + 8.375 * s} \${y + 0.5} \${x + 220.875 * s} \${y + 106} \${x + 220.875 * s} \${y + 108}\`,
    \`C \${x + 220.875 * s} \${y + 110} \${x + 222.375 * s} \${y + h + 103.5} \${x + 221.375 * s} \${y + h + 105}\`,
    \`C \${x + 220.375 * s} \${y + h + 106.5} \${x + 220.075 * s} \${y + h + 106.95} \${x + 217.875 * s} \${y + h + 108}\`,
    \`C \${x + 215.675 * s} \${y + h + 109.05} \${x + 212.875 * s} \${y + h + 108} \${x + 212.875 * s} \${y + h + 108} Z\`,
  ].join(" ");
}

function buildInner(x: number, y: number, h: number, s: number) {
  return [
    \`M \${x + 7.375 * s} \${y + 6.5}\`,
    \`C \${x + 7.375 * s} \${y + 6.5} \${x + 132.013 * s} \${y + 68.667} \${x + 211.875 * s} \${y + 108.5}\`,
    \`C \${x + 211.875 * s} \${y + 108.5} \${x + 215.375 * s} \${y + 110.5} \${x + 215.375 * s} \${y + 112.5}\`,
    \`C \${x + 215.375 * s} \${y + 114.5} \${x + 215.375 * s} \${y + h + 103.5} \${x + 215.375 * s} \${y + h + 103.5}\`,
  ].join(" ");
}

type CardProps = {
  index: number;
  mouseX: MotionValue<number>;
  startX: number;
  startY: number;
  s: number;
  dx: number;
};

const Card = ({ index, mouseX, startX, startY, s, dx }: CardProps) => {
  const x = startX + index * dx;
  const cardCenterX = x + (BASE_W * s) / 2;

  const height = useTransform(mouseX, (val) => {
    const dist = cardCenterX - val;
    return BASE_H + expWave(dist) * MAX_H;
  });

  const outlinePath = useTransform(height, (h) => {
    const y = startY + index * BASE_DY - h;
    return buildOutline(x, y, h, s);
  });

  const innerPath = useTransform(height, (h) => {
    const y = startY + index * BASE_DY - h;
    return buildInner(x, y, h, s);
  });

  const strokeColor = useTransform(mouseX, (val) => {
    const intensity = expWave(cardCenterX - val);
    const v = Math.round(40 + intensity * 215);
    return \`rgb(\${v},\${v},\${v})\`;
  });

  const innerStroke = useTransform(mouseX, (val) => {
    const intensity = expWave(cardCenterX - val);
    const v = Math.round(20 + intensity * 30);
    return \`rgb(\${v},\${v},\${v})\`;
  });

  return (
    <g>
      <motion.path
        d={outlinePath}
        fill="#0a0a0a"
        stroke={strokeColor}
        strokeWidth="0.5"
      />
      <motion.path
        d={innerPath}
        fill="none"
        stroke={innerStroke}
        strokeWidth="1"
      />
    </g>
  );
};

export default function CardWave({
  cardWidth = 223,
  defaultHoverIndex = 6,
  numCards = 18,
  startX: _startX = undefined,
  startY: _startY = undefined,
}: {
  cardWidth?: number;
  defaultHoverIndex?: number;
  numCards?: number;
  startX?: number | undefined;
  startY?: number | undefined;
}) {
  const containerRef = useRef<SVGSVGElement | null>(null);

  const s = cardWidth / BASE_W;
  const dx = BASE_DX * s;
  const startX = _startX ?? Math.round(VB_W * 0.75 - cardWidth);
  const startY = _startY ?? Math.round(VB_H * 0.71);
  const defaultX = startX + defaultHoverIndex * dx + (BASE_W * s) / 2;
  const mouseX = useMotionValue(defaultX);
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 50 });

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = (event) => {
    const element = containerRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();

    const scaleX = VB_W / rect.width;
    mouseX.set((event.clientX - rect.left) * scaleX);
  };

  const handleMouseLeave = () => {
    mouseX.set(defaultX);
  };

  return (
    <svg
      ref={containerRef}
      viewBox={\`0 0 \${VB_W} \${VB_H}\`}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
      focusable="false"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: numCards }, (_, index) => ({
        id: \`card-\${index}\`,
        index,
      })).map((card) => (
        <Card
          key={card.id}
          index={card.index}
          mouseX={smoothMouseX}
          startX={startX}
          startY={startY}
          s={s}
          dx={dx}
        />
      ))}
    </svg>
  );
}`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/card-wave",
      pnpm: "pnpm dlx shadcn@latest add @arni/card-wave",
      bun: "bunx --bun shadcn@latest add @arni/card-wave",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> CardWave </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/card-wave/card-wave"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCard,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardBody,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardHeader,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardHeading,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardSubheading,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardSVGContainer,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/linear-card/linear-card"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#6CB6FF"> isLast</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">>FIG 0.2&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardSVGContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">CardWave</span><span style="color:#6CB6FF"> cardWidth</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">140</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> defaultHoverIndex</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">5</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardSVGContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">>Designed for speed&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      Reduces noise and restores momentum.</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#ADBAC7">>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> MotionValue,</span></span>
<span class="line"><span style="color:#ADBAC7">  motion,</span></span>
<span class="line"><span style="color:#ADBAC7">  useMotionValue,</span></span>
<span class="line"><span style="color:#ADBAC7">  useSpring,</span></span>
<span class="line"><span style="color:#ADBAC7">  useTransform,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "motion/react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { </span><span style="color:#F47067">type</span><span style="color:#ADBAC7"> MouseEventHandler, useRef } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> BASE_W</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 223</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> BASE_DX</span><span style="color:#F47067"> =</span><span style="color:#F47067"> -</span><span style="color:#6CB6FF">20</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> BASE_DY</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 4</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> BASE_H</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 32</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> MAX_H</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 100</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> VB_W</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 420</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> VB_H</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 260</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> expWave</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">dist</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> d</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">abs</span><span style="color:#ADBAC7">(dist) </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 45</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> rate</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> dist </span><span style="color:#F47067">></span><span style="color:#6CB6FF"> 0</span><span style="color:#F47067"> ?</span><span style="color:#6CB6FF"> 0.75</span><span style="color:#F47067"> :</span><span style="color:#6CB6FF"> 2.6</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">exp</span><span style="color:#ADBAC7">(</span><span style="color:#F47067">-</span><span style="color:#ADBAC7">d </span><span style="color:#F47067">*</span><span style="color:#ADBAC7"> rate);</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> buildOutline</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">x</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">y</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">h</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">s</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#96D0FF">    \`M \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 212.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 210.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 107</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 166.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 84.8</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 4.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 4</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 4.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 4</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 1.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 2.245</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.122</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> -</span><span style="color:#6CB6FF"> 2</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 6.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 4.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 1.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 2.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 3.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 5.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`H \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 7.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 8.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 0.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 220.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 106</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 220.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 220.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 110</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 222.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 103.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 221.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 105</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 220.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 106.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 220.075</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 106.95</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 217.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.675</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 109.05</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 212.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 212.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108</span><span style="color:#96D0FF">} Z\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  ].</span><span style="color:#DCBDFB">join</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">" "</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> buildInner</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">x</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">y</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">h</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">s</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#96D0FF">    \`M \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 7.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 6.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 7.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 6.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 132.013</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 68.667</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 211.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 211.875</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 108.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 110.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 112.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">    \`C \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 114.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 103.5</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">x</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 215.375</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">y</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> h</span><span style="color:#F47067"> +</span><span style="color:#6CB6FF"> 103.5</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  ].</span><span style="color:#DCBDFB">join</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">" "</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> CardProps</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  index</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mouseX</span><span style="color:#F47067">:</span><span style="color:#F69D50"> MotionValue</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">number</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#F69D50">  startX</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  startY</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  s</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  dx</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#DCBDFB"> Card</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({ </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">mouseX</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">startX</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">startY</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">s</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">dx</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">:</span><span style="color:#F69D50"> CardProps</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> x</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> startX </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">*</span><span style="color:#ADBAC7"> dx;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> cardCenterX</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> x </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> (</span><span style="color:#6CB6FF">BASE_W</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s) </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> height</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useTransform</span><span style="color:#ADBAC7">(mouseX, (</span><span style="color:#F69D50">val</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> dist</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> cardCenterX </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> val;</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#6CB6FF"> BASE_H</span><span style="color:#F47067"> +</span><span style="color:#DCBDFB"> expWave</span><span style="color:#ADBAC7">(dist) </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> MAX_H</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> outlinePath</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useTransform</span><span style="color:#ADBAC7">(height, (</span><span style="color:#F69D50">h</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> y</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> startY </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> BASE_DY</span><span style="color:#F47067"> -</span><span style="color:#ADBAC7"> h;</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#DCBDFB"> buildOutline</span><span style="color:#ADBAC7">(x, y, h, s);</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> innerPath</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useTransform</span><span style="color:#ADBAC7">(height, (</span><span style="color:#F69D50">h</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> y</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> startY </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> BASE_DY</span><span style="color:#F47067"> -</span><span style="color:#ADBAC7"> h;</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#DCBDFB"> buildInner</span><span style="color:#ADBAC7">(x, y, h, s);</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> strokeColor</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useTransform</span><span style="color:#ADBAC7">(mouseX, (</span><span style="color:#F69D50">val</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> intensity</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> expWave</span><span style="color:#ADBAC7">(cardCenterX </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> val);</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> v</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">round</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">40</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> intensity </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> 215</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#96D0FF"> \`rgb(\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">},\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">},\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">})\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> innerStroke</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useTransform</span><span style="color:#ADBAC7">(mouseX, (</span><span style="color:#F69D50">val</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> intensity</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> expWave</span><span style="color:#ADBAC7">(cardCenterX </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> val);</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> v</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">round</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">20</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> intensity </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> 30</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#96D0FF"> \`rgb(\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">},\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">},\${</span><span style="color:#ADBAC7">v</span><span style="color:#96D0FF">})\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">g</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">motion.path</span></span>
<span class="line"><span style="color:#6CB6FF">        d</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">outlinePath</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        fill</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"#0a0a0a"</span></span>
<span class="line"><span style="color:#6CB6FF">        stroke</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">strokeColor</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        strokeWidth</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"0.5"</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">motion.path</span></span>
<span class="line"><span style="color:#6CB6FF">        d</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">innerPath</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        fill</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"none"</span></span>
<span class="line"><span style="color:#6CB6FF">        stroke</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">innerStroke</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        strokeWidth</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"1"</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">g</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> default</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> CardWave</span><span style="color:#F69D50">({</span></span>
<span class="line"><span style="color:#F69D50">  cardWidth </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 223</span><span style="color:#F69D50">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultHoverIndex </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 6</span><span style="color:#F69D50">,</span></span>
<span class="line"><span style="color:#F69D50">  numCards </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 18</span><span style="color:#F69D50">,</span></span>
<span class="line"><span style="color:#F69D50">  startX: _startX </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F69D50">,</span></span>
<span class="line"><span style="color:#F69D50">  startY: _startY </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F69D50">,</span></span>
<span class="line"><span style="color:#F69D50">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> {</span></span>
<span class="line"><span style="color:#F69D50">  cardWidth</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#F69D50">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultHoverIndex</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#F69D50">;</span></span>
<span class="line"><span style="color:#F69D50">  numCards</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#F69D50">;</span></span>
<span class="line"><span style="color:#F69D50">  startX</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F69D50">;</span></span>
<span class="line"><span style="color:#F69D50">  startY</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F69D50">;</span></span>
<span class="line"><span style="color:#F69D50">}) </span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> containerRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">SVGSVGElement</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> null</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> s</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> cardWidth </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> BASE_W</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> dx</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> BASE_DX</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> startX</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> _startX </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">round</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">VB_W</span><span style="color:#F47067"> *</span><span style="color:#6CB6FF"> 0.75</span><span style="color:#F47067"> -</span><span style="color:#ADBAC7"> cardWidth);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> startY</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> _startY </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">round</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">VB_H</span><span style="color:#F47067"> *</span><span style="color:#6CB6FF"> 0.71</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> defaultX</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> startX </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> defaultHoverIndex </span><span style="color:#F47067">*</span><span style="color:#ADBAC7"> dx </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> (</span><span style="color:#6CB6FF">BASE_W</span><span style="color:#F47067"> *</span><span style="color:#ADBAC7"> s) </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> mouseX</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useMotionValue</span><span style="color:#ADBAC7">(defaultX);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> smoothMouseX</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useSpring</span><span style="color:#ADBAC7">(mouseX, { stiffness: </span><span style="color:#6CB6FF">150</span><span style="color:#ADBAC7">, damping: </span><span style="color:#6CB6FF">50</span><span style="color:#ADBAC7"> });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#DCBDFB"> handleMouseMove</span><span style="color:#F47067">:</span><span style="color:#F69D50"> MouseEventHandler</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">SVGSVGElement</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> (</span><span style="color:#F69D50">event</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> element</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> containerRef.current;</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">element) </span><span style="color:#F47067">return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> rect</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> element.</span><span style="color:#DCBDFB">getBoundingClientRect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> scaleX</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> VB_W</span><span style="color:#F47067"> /</span><span style="color:#ADBAC7"> rect.width;</span></span>
<span class="line"><span style="color:#ADBAC7">    mouseX.</span><span style="color:#DCBDFB">set</span><span style="color:#ADBAC7">((event.clientX </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> rect.left) </span><span style="color:#F47067">*</span><span style="color:#ADBAC7"> scaleX);</span></span>
<span class="line"><span style="color:#ADBAC7">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#DCBDFB"> handleMouseLeave</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">    mouseX.</span><span style="color:#DCBDFB">set</span><span style="color:#ADBAC7">(defaultX);</span></span>
<span class="line"><span style="color:#ADBAC7">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">svg</span></span>
<span class="line"><span style="color:#6CB6FF">      ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">containerRef</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      viewBox</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`0 0 \${</span><span style="color:#6CB6FF">VB_W</span><span style="color:#96D0FF">} \${</span><span style="color:#6CB6FF">VB_H</span><span style="color:#96D0FF">}\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ width: </span><span style="color:#96D0FF">"100%"</span><span style="color:#ADBAC7">, height: </span><span style="color:#96D0FF">"100%"</span><span style="color:#ADBAC7">, display: </span><span style="color:#96D0FF">"block"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      aria-hidden</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"true"</span></span>
<span class="line"><span style="color:#6CB6FF">      focusable</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"false"</span></span>
<span class="line"><span style="color:#6CB6FF">      onMouseMove</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">handleMouseMove</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      onMouseLeave</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">handleMouseLeave</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">Array.</span><span style="color:#DCBDFB">from</span><span style="color:#ADBAC7">({ length: numCards }, (</span><span style="color:#F69D50">_</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">        id: </span><span style="color:#96D0FF">\`card-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        index,</span></span>
<span class="line"><span style="color:#ADBAC7">      })).</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">card</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">Card</span></span>
<span class="line"><span style="color:#6CB6FF">          key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">card.id</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          index</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">card.index</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          mouseX</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">smoothMouseX</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          startX</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">startX</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          startY</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">startY</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          s</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">s</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          dx</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">dx</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        /></span></span>
<span class="line"><span style="color:#ADBAC7">      ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">svg</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/card-wave</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/card-wave</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/card-wave</span></span></code></pre>`,
      },
    },
    usage: `import CardWave from "@/registry/base-vega/card-wave/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/registry/base-vega/linear-card/linear-card";

<LinearCard isLast>
  <LinearCardHeader>FIG 0.2</LinearCardHeader>
  <LinearCardSVGContainer>
    <CardWave cardWidth={140} defaultHoverIndex={5} />
  </LinearCardSVGContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>;`,
    props: [
      {
        name: "cardWidth",
        default: "223",
        type: "number",
        description: "The width of the card",
      },
      {
        name: "defaultHoverIndex",
        default: "6",
        type: "number",
        description: "The index of the wave to hover by default",
      },
      {
        name: "numCards",
        default: "18  ",
        type: "number",
        description: "The number of cards to have in the card wave",
      },
      {
        name: "startX",
        default: "undefined",
        type: "number | undefined",
        description: "The starting x position of the wave",
      },
      {
        name: "startY",
        default: "undefined",
        type: "number | undefined",
        description: "The starting y position of the wave",
      },
    ],
    subComponents: [],
  },
  {
    slug: "diff-viewer",
    name: "Diff Viewer",
    description:
      "A lightweight compound diff code block for landing pages with responsive before/after panels, inherited inline marks, and customizable syntax highlighting rules.",
    categories: ["code", "marketing"],
    sourcePath: "registry/base-vega/diff-viewer/diff-viewer.tsx",
    sourceCode: `"use client";

import { File } from "lucide-react";
import {
  Children,
  type CSSProperties,
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  use,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";

type LineType = "add" | "del" | "context";
type DiffPattern = string | RegExp;

export interface DiffHighlightRule {
  name: string;
  pattern: DiffPattern;
  flags?: string;
  className?: string;
  style?: CSSProperties;
}

interface DiffToken {
  className?: string;
  style?: CSSProperties;
  name?: string;
  start: number;
  value: string;
}

const EMPTY_MARKS: string[] = [];

interface DiffSegment {
  className?: string;
  marked: boolean;
  start: number;
  style?: CSSProperties;
  value: string;
}

const DiffLineContext = createContext<LineType>("context");

export const DEFAULT_DIFF_HIGHLIGHT_RULES: DiffHighlightRule[] = [
  {
    name: "comment",
    pattern: String.raw\`//[^\\n]*\`,
    style: { color: "#737373" },
  },
  {
    name: "string",
    pattern: "\\"(?:[^\\"\\\\]|\\\\.)*\\"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`",
    style: { color: "#fbbf24" },
  },
  {
    name: "keyword",
    pattern: String.raw\`\\b(?:import|from|export|default|return|const|let|var|function|class|new|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|extends|implements|interface|type|as|in|of|true|false|null|undefined)\\b\`,
    style: { color: "#38bdf8" },
  },
  {
    name: "type",
    pattern: String.raw\`\\b[A-Z][A-Za-z0-9_$]*\\b\`,
    style: { color: "#5eead4" },
  },
  {
    name: "number",
    pattern: String.raw\`\\b\\d+(?:\\.\\d+)?\\b\`,
    style: { color: "#a3e635" },
  },
  {
    name: "function",
    pattern: String.raw\`\\b[a-zA-Z_$][\\w$]*(?=\\s*\\()\`,
    style: { color: "#fb7185" },
  },
  {
    name: "operator",
    pattern: String.raw\`===|!==|=>|<=|>=|&&|\\|\\||[=<>+\\-*/%!?.,:]\`,
    style: { color: "#d4d4d8" },
  },
];

const DiffHighlightRulesContext = createContext<DiffHighlightRule[]>(
  DEFAULT_DIFF_HIGHLIGHT_RULES,
);

function getStickyFlags(flags: string) {
  return Array.from(new Set(\`\${flags.replace(/[gy]/g, "")}y\`.split(""))).join(
    "",
  );
}

function toStickyPattern(pattern: DiffPattern, flags?: string) {
  if (pattern instanceof RegExp) {
    return new RegExp(pattern.source, getStickyFlags(pattern.flags));
  }

  return new RegExp(pattern, getStickyFlags(flags ?? ""));
}

function tokenizeCode(code: string, rules: DiffHighlightRule[]) {
  const matchers = rules.map((rule) => ({
    ...rule,
    matcher: toStickyPattern(rule.pattern, rule.flags),
  }));

  const tokens: DiffToken[] = [];
  let index = 0;

  while (index < code.length) {
    let nextToken: DiffToken | null = null;

    for (const rule of matchers) {
      rule.matcher.lastIndex = index;
      const match = rule.matcher.exec(code);
      const value = match?.[0];

      if (!value) {
        continue;
      }

      nextToken = {
        className: rule.className,
        name: rule.name,
        start: index,
        style: rule.style,
        value,
      };
      break;
    }

    if (!nextToken) {
      let end = index + 1;

      while (end < code.length) {
        let matched = false;

        for (const rule of matchers) {
          rule.matcher.lastIndex = end;

          if (rule.matcher.exec(code)?.[0]) {
            matched = true;
            break;
          }
        }

        if (matched) {
          break;
        }

        end += 1;
      }

      nextToken = {
        start: index,
        value: code.slice(index, end),
      };
    }

    tokens.push(nextToken);
    index += nextToken.value.length;
  }

  return tokens;
}

function buildMarkMap(code: string, marks: string[]) {
  const map = new Array(code.length).fill(false);

  for (const mark of marks) {
    if (!mark) {
      continue;
    }

    let from = 0;

    while (from < code.length) {
      const index = code.indexOf(mark, from);

      if (index < 0) {
        break;
      }

      for (let cursor = index; cursor < index + mark.length; cursor += 1) {
        map[cursor] = true;
      }

      from = index + 1;
    }
  }

  return map;
}

function buildCodeSegments(
  code: string,
  rules: DiffHighlightRule[],
  marks: string[],
) {
  const tokens = tokenizeCode(code, rules);
  const markMap = buildMarkMap(code, marks);
  const segments: DiffSegment[] = [];

  for (const token of tokens) {
    let index = 0;

    while (index < token.value.length) {
      const marked = markMap[token.start + index] ?? false;
      let cursor = index + 1;

      while (
        cursor < token.value.length &&
        (markMap[token.start + cursor] ?? false) === marked
      ) {
        cursor += 1;
      }

      segments.push({
        className: token.className,
        marked,
        start: token.start + index,
        style: token.style,
        value: token.value.slice(index, cursor),
      });

      index = cursor;
    }
  }

  return segments;
}

interface DiffViewerProps {
  children: ReactNode;
  className?: string;
  filename?: string;
  panes?: 1 | 2;
  highlightRules?: DiffHighlightRule[];
}

function DiffViewer({
  children,
  className,
  filename,
  panes = 2,
  highlightRules = DEFAULT_DIFF_HIGHLIGHT_RULES,
}: DiffViewerProps) {
  return (
    <DiffHighlightRulesContext value={highlightRules}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 font-mono text-[13px] leading-6 shadow-2xl",
          className,
        )}
      >
        {filename && (
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-4">
            <File className="size-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-500">{filename}</span>
          </div>
        )}

        <div
          className={\`grid grid-cols-1 divide-y divide-neutral-800 \${panes === 1 ? "" : "md:grid-cols-2"} md:divide-x md:divide-y-0\`}
        >
          {children}
        </div>
      </div>
    </DiffHighlightRulesContext>
  );
}

interface DiffPanelProps {
  children: ReactNode;
  className?: string;
  side: "before" | "after";
}

function DiffPanel({ children, className, side }: DiffPanelProps) {
  return (
    <div data-side={side} className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  );
}

const LINE_STYLES = {
  add: {
    bg: "bg-emerald-500/8",
    bar: "border-l-emerald-500",
    numColor: "text-emerald-600/50",
    sign: "+",
    signColor: "text-emerald-500",
  },
  context: {
    bg: "",
    bar: "border-l-transparent",
    numColor: "text-neutral-700",
    sign: " ",
    signColor: "text-transparent",
  },
  del: {
    bg: "bg-red-500/8",
    bar: "border-l-red-500",
    numColor: "text-red-500/50",
    sign: "-",
    signColor: "text-red-500",
  },
} as const;

interface DiffLineProps {
  children: ReactNode;
  className?: string;
  disableHighlighting?: boolean;
  highlightRules?: DiffHighlightRule[];
  number?: number;
  type?: LineType;
}

function getTokenStyle(style?: CSSProperties) {
  if (!style) {
    return undefined;
  }

  const nextStyle: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || key === "color") {
      continue;
    }

    nextStyle[key] = value;
  }

  if (style.color) {
    nextStyle["--diff-token-color"] = String(style.color);
    nextStyle.color = "var(--diff-mark-text-color, var(--diff-token-color))";
  }

  return nextStyle as CSSProperties;
}

function highlightTextContent(
  text: string,
  rules: DiffHighlightRule[],
  keyPrefix: string,
  withinMark: boolean,
) {
  if (withinMark || text.length === 0) {
    return text;
  }

  return tokenizeCode(text, rules).map((token) => (
    <span
      key={\`\${keyPrefix}-\${token.start}-\${token.value}\`}
      className={token.className}
      style={getTokenStyle(token.style)}
    >
      {token.value}
    </span>
  ));
}

function shouldSkipHighlighting(props: Record<string, unknown>) {
  return (
    props["data-diff-highlight"] === "off" ||
    props["data-diff-highlight"] === false
  );
}

function highlightNode(
  node: ReactNode,
  rules: DiffHighlightRule[],
  keyPrefix: string,
  withinMark = false,
): ReactNode {
  if (typeof node === "string") {
    return highlightTextContent(node, rules, keyPrefix, withinMark);
  }

  if (typeof node === "number") {
    return highlightTextContent(String(node), rules, keyPrefix, withinMark);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) =>
      highlightNode(child, rules, \`\${keyPrefix}-\${index}\`, withinMark),
    );
  }

  if (!isValidElement(node)) {
    return node;
  }

  const props = node.props as Record<string, unknown>;

  if (shouldSkipHighlighting(props)) {
    return node;
  }

  if (!("children" in props)) {
    return node;
  }

  const nextChildren = Children.map(
    props.children as ReactNode,
    (child, index) =>
      highlightNode(
        child,
        rules,
        \`\${keyPrefix}-\${index}\`,
        withinMark || node.type === DiffMark,
      ),
  );

  return cloneElement(node, undefined, nextChildren);
}

function DiffLine({
  children,
  className,
  disableHighlighting = false,
  highlightRules,
  number: lineNumber,
  type = "context",
}: DiffLineProps) {
  const style = LINE_STYLES[type];
  const inheritedRules = use(DiffHighlightRulesContext);
  const rules = highlightRules ?? inheritedRules;
  const highlightedChildren = useMemo(
    () =>
      disableHighlighting
        ? children
        : Children.map(children, (child, index) =>
            highlightNode(
              child,
              rules,
              \`diff-line-\${lineNumber ?? "x"}-\${index}\`,
            ),
          ),
    [children, disableHighlighting, lineNumber, rules],
  );

  return (
    <DiffLineContext value={type}>
      <div
        className={cn(
          "flex items-baseline border-l-[3px] pr-4",
          style.bg,
          style.bar,
          className,
        )}
      >
        {lineNumber !== undefined && (
          <span
            className={cn(
              "w-8 shrink-0 select-none text-right text-[11px]",
              style.numColor,
            )}
          >
            {lineNumber}
          </span>
        )}

        <span
          className={cn(
            "w-5 shrink-0 select-none text-center text-xs",
            style.signColor,
          )}
        >
          {style.sign}
        </span>

        <span className="whitespace-pre text-neutral-300">
          {highlightedChildren}
        </span>
      </div>
    </DiffLineContext>
  );
}

interface DiffCodeProps {
  className?: string;
  code: string;
  marks?: string[];
  rules?: DiffHighlightRule[];
}

function DiffCode({
  className,
  code,
  marks = EMPTY_MARKS,
  rules = DEFAULT_DIFF_HIGHLIGHT_RULES,
}: DiffCodeProps) {
  const segments = useMemo(
    () => buildCodeSegments(code, rules, marks),
    [code, marks, rules],
  );

  return (
    <span className={className}>
      {segments.map((segment) => {
        const content = (
          <span className={segment.className} style={segment.style}>
            {segment.value}
          </span>
        );

        const key = \`\${segment.start}-\${segment.value}-\${segment.marked ? "mark" : "plain"}\`;

        if (!segment.marked) {
          return <span key={key}>{content}</span>;
        }

        return <DiffMark key={key}>{content}</DiffMark>;
      })}
    </span>
  );
}

interface DiffMarkProps {
  children: ReactNode;
  markClassName?: string;
  className?: string;
}

function DiffMark({ children, className, markClassName }: DiffMarkProps) {
  const lineType = use(DiffLineContext);

  const markBg =
    lineType === "add"
      ? "bg-emerald-500/25"
      : lineType === "del"
        ? "bg-red-500/25"
        : "bg-neutral-500/25";

  return (
    <span className={cn("rounded-sm px-0.5", markBg, markClassName)}>
      <span className={className}>{children}</span>
    </span>
  );
}

DiffPanel.displayName = "DiffPanel";

export {
  DiffViewer,
  DiffPanel,
  DiffLine,
  DiffCode,
  DiffMark,
  buildCodeSegments,
  tokenizeCode,
};
export type {
  DiffViewerProps,
  DiffPanelProps,
  DiffLineProps,
  DiffCodeProps,
  DiffMarkProps,
  LineType,
};`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/diff-viewer",
      pnpm: "pnpm dlx shadcn@latest add @arni/diff-viewer",
      bun: "bunx --bun shadcn@latest add @arni/diff-viewer",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffLine,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffMark,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffPanel,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffViewer,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/diff-viewer/diff-viewer"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> highlightRules</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"keyword"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern:</span><span style="color:#96D0FF"> /</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">(?:import</span><span style="color:#F47067">|</span><span style="color:#96D0FF">from</span><span style="color:#F47067">|</span><span style="color:#96D0FF">export</span><span style="color:#F47067">|</span><span style="color:#96D0FF">function</span><span style="color:#F47067">|</span><span style="color:#96D0FF">const</span><span style="color:#F47067">|</span><span style="color:#96D0FF">return)</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">/</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#38bdf8"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"string"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern:</span><span style="color:#96D0FF"> /"(?:</span><span style="color:#6CB6FF">[</span><span style="color:#F47067">^</span><span style="color:#6CB6FF">"</span><span style="color:#8DDB8C;font-weight:bold">\\\\</span><span style="color:#6CB6FF">]</span><span style="color:#F47067">|</span><span style="color:#8DDB8C;font-weight:bold">\\\\</span><span style="color:#6CB6FF">.</span><span style="color:#96D0FF">)</span><span style="color:#F47067">*</span><span style="color:#96D0FF">"</span><span style="color:#F47067">|</span><span style="color:#96D0FF">'(?:</span><span style="color:#6CB6FF">[</span><span style="color:#F47067">^</span><span style="color:#6CB6FF">'</span><span style="color:#8DDB8C;font-weight:bold">\\\\</span><span style="color:#6CB6FF">]</span><span style="color:#F47067">|</span><span style="color:#8DDB8C;font-weight:bold">\\\\</span><span style="color:#6CB6FF">.</span><span style="color:#96D0FF">)</span><span style="color:#F47067">*</span><span style="color:#96D0FF">'/</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#fbbf24"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">DiffViewer</span><span style="color:#6CB6FF"> filename</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"app/home-screen.tsx"</span><span style="color:#6CB6FF"> highlightRules</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">highlightRules</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">DiffPanel</span><span style="color:#6CB6FF"> side</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"before"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#6CB6FF"> type</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"del"</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">1</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">"import { "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-red-200"</span><span style="color:#ADBAC7">>useVehicleState&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">" } "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">\`from "@/hooks/useVehicleState";\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#6CB6FF"> type</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"del"</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">2</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">\` const { \`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-red-200"</span><span style="color:#ADBAC7">>selectedVehicle&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">" } = "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-red-200"</span><span style="color:#ADBAC7">>useVehicleState&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">>();</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">DiffPanel</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">DiffPanel</span><span style="color:#6CB6FF"> side</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"after"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#6CB6FF"> type</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"add"</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">1</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">"import { "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-emerald-200"</span><span style="color:#ADBAC7">>useVehicleStates&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">" } "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      "@/hooks/useVehicleStates";</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#6CB6FF"> type</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"add"</span><span style="color:#6CB6FF"> number</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">2</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">\`const { \`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-emerald-200"</span><span style="color:#ADBAC7">>activeVehicle&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#96D0FF">" } = "</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-emerald-200"</span><span style="color:#ADBAC7">>useVehicleStates&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">>();</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffLine</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">DiffPanel</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">DiffViewer</span><span style="color:#ADBAC7">>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { File } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "lucide-react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  Children,</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> CSSProperties,</span></span>
<span class="line"><span style="color:#ADBAC7">  cloneElement,</span></span>
<span class="line"><span style="color:#ADBAC7">  createContext,</span></span>
<span class="line"><span style="color:#ADBAC7">  isValidElement,</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> ReactNode,</span></span>
<span class="line"><span style="color:#ADBAC7">  use,</span></span>
<span class="line"><span style="color:#ADBAC7">  useMemo,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { cn } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/lib/utils"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> LineType</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "add"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "del"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "context"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> DiffPattern</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> string</span><span style="color:#F47067"> |</span><span style="color:#F69D50"> RegExp</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> interface</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  name</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  pattern</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffPattern</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  flags</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  style</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> CSSProperties</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffToken</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  style</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> CSSProperties</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  name</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  start</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  value</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> EMPTY_MARKS</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffSegment</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  marked</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  start</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  style</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> CSSProperties</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  value</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DiffLineContext</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> createContext</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">LineType</span><span style="color:#ADBAC7">>(</span><span style="color:#96D0FF">"context"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#6CB6FF"> DEFAULT_DIFF_HIGHLIGHT_RULES</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"comment"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`//[^</span><span style="color:#F47067">\\n</span><span style="color:#96D0FF">]*\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#737373"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"string"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: </span><span style="color:#96D0FF">"</span><span style="color:#F47067">\\"</span><span style="color:#96D0FF">(?:[^</span><span style="color:#F47067">\\"\\\\</span><span style="color:#96D0FF">]|</span><span style="color:#F47067">\\\\</span><span style="color:#96D0FF">.)*</span><span style="color:#F47067">\\"</span><span style="color:#96D0FF">|'(?:[^'</span><span style="color:#F47067">\\\\</span><span style="color:#96D0FF">]|</span><span style="color:#F47067">\\\\</span><span style="color:#96D0FF">.)*'|\`(?:[^\`</span><span style="color:#F47067">\\\\</span><span style="color:#96D0FF">]|</span><span style="color:#F47067">\\\\</span><span style="color:#96D0FF">.)*\`"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#fbbf24"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"keyword"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">(?:import|from|export|default|return|const|let|var|function|class|new|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|extends|implements|interface|type|as|in|of|true|false|null|undefined)</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#38bdf8"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"type"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">[A-Z][A-Za-z0-9_$]*</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#5eead4"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"number"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`</span><span style="color:#F47067">\\b\\d</span><span style="color:#96D0FF">+(?:</span><span style="color:#F47067">\\.\\d</span><span style="color:#96D0FF">+)?</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#a3e635"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"function"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`</span><span style="color:#F47067">\\b</span><span style="color:#96D0FF">[a-zA-Z_$][</span><span style="color:#F47067">\\w</span><span style="color:#96D0FF">$]*(?=</span><span style="color:#F47067">\\s</span><span style="color:#96D0FF">*</span><span style="color:#F47067">\\(</span><span style="color:#96D0FF">)\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#fb7185"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    name: </span><span style="color:#96D0FF">"operator"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    pattern: String.</span><span style="color:#DCBDFB">raw</span><span style="color:#96D0FF">\`===|!==|=>|&#x3C;=|>=|&#x26;&#x26;|</span><span style="color:#F47067">\\|\\|</span><span style="color:#96D0FF">|[=&#x3C;>+</span><span style="color:#F47067">\\-</span><span style="color:#96D0FF">*/%!?.,:]\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    style: { color: </span><span style="color:#96D0FF">"#d4d4d8"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DiffHighlightRulesContext</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> createContext</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">DiffHighlightRule</span><span style="color:#ADBAC7">[]>(</span></span>
<span class="line"><span style="color:#6CB6FF">  DEFAULT_DIFF_HIGHLIGHT_RULES</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> getStickyFlags</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">flags</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> Array.</span><span style="color:#DCBDFB">from</span><span style="color:#ADBAC7">(</span><span style="color:#F47067">new</span><span style="color:#DCBDFB"> Set</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">flags</span><span style="color:#96D0FF">.</span><span style="color:#DCBDFB">replace</span><span style="color:#96D0FF">(</span><span style="color:#96D0FF">/</span><span style="color:#6CB6FF">[gy]</span><span style="color:#96D0FF">/</span><span style="color:#F47067">g</span><span style="color:#96D0FF">, </span><span style="color:#96D0FF">""</span><span style="color:#96D0FF">)</span><span style="color:#96D0FF">}y\`</span><span style="color:#ADBAC7">.</span><span style="color:#DCBDFB">split</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">""</span><span style="color:#ADBAC7">))).</span><span style="color:#DCBDFB">join</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">    ""</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> toStickyPattern</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">pattern</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffPattern</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">flags</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (pattern </span><span style="color:#F47067">instanceof</span><span style="color:#F69D50"> RegExp</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#F47067"> new</span><span style="color:#DCBDFB"> RegExp</span><span style="color:#ADBAC7">(pattern.source, </span><span style="color:#DCBDFB">getStickyFlags</span><span style="color:#ADBAC7">(pattern.flags));</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#F47067"> new</span><span style="color:#DCBDFB"> RegExp</span><span style="color:#ADBAC7">(pattern, </span><span style="color:#DCBDFB">getStickyFlags</span><span style="color:#ADBAC7">(flags </span><span style="color:#F47067">??</span><span style="color:#96D0FF"> ""</span><span style="color:#ADBAC7">));</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> tokenizeCode</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">code</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">rules</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[]) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> matchers</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> rules.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">rule</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#F47067">    ...</span><span style="color:#ADBAC7">rule,</span></span>
<span class="line"><span style="color:#ADBAC7">    matcher: </span><span style="color:#DCBDFB">toStickyPattern</span><span style="color:#ADBAC7">(rule.pattern, rule.flags),</span></span>
<span class="line"><span style="color:#ADBAC7">  }));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> tokens</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffToken</span><span style="color:#ADBAC7">[] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> [];</span></span>
<span class="line"><span style="color:#F47067">  let</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  while</span><span style="color:#ADBAC7"> (index </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> code.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    let</span><span style="color:#ADBAC7"> nextToken</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffToken</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> null</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">const</span><span style="color:#6CB6FF"> rule</span><span style="color:#F47067"> of</span><span style="color:#ADBAC7"> matchers) {</span></span>
<span class="line"><span style="color:#ADBAC7">      rule.matcher.lastIndex </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> index;</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> match</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> rule.matcher.</span><span style="color:#DCBDFB">exec</span><span style="color:#ADBAC7">(code);</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> match?.[</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">value) {</span></span>
<span class="line"><span style="color:#F47067">        continue</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      nextToken </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">        className: rule.className,</span></span>
<span class="line"><span style="color:#ADBAC7">        name: rule.name,</span></span>
<span class="line"><span style="color:#ADBAC7">        start: index,</span></span>
<span class="line"><span style="color:#ADBAC7">        style: rule.style,</span></span>
<span class="line"><span style="color:#ADBAC7">        value,</span></span>
<span class="line"><span style="color:#ADBAC7">      };</span></span>
<span class="line"><span style="color:#F47067">      break</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">nextToken) {</span></span>
<span class="line"><span style="color:#F47067">      let</span><span style="color:#ADBAC7"> end </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      while</span><span style="color:#ADBAC7"> (end </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> code.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">        let</span><span style="color:#ADBAC7"> matched </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">        for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">const</span><span style="color:#6CB6FF"> rule</span><span style="color:#F47067"> of</span><span style="color:#ADBAC7"> matchers) {</span></span>
<span class="line"><span style="color:#ADBAC7">          rule.matcher.lastIndex </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> end;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">          if</span><span style="color:#ADBAC7"> (rule.matcher.</span><span style="color:#DCBDFB">exec</span><span style="color:#ADBAC7">(code)?.[</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">]) {</span></span>
<span class="line"><span style="color:#ADBAC7">            matched </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> true</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">            break</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">          }</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">        if</span><span style="color:#ADBAC7"> (matched) {</span></span>
<span class="line"><span style="color:#F47067">          break</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        end </span><span style="color:#F47067">+=</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      nextToken </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">        start: index,</span></span>
<span class="line"><span style="color:#ADBAC7">        value: code.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(index, end),</span></span>
<span class="line"><span style="color:#ADBAC7">      };</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    tokens.</span><span style="color:#DCBDFB">push</span><span style="color:#ADBAC7">(nextToken);</span></span>
<span class="line"><span style="color:#ADBAC7">    index </span><span style="color:#F47067">+=</span><span style="color:#ADBAC7"> nextToken.value.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> tokens;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> buildMarkMap</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">code</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">marks</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[]) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> map</span><span style="color:#F47067"> =</span><span style="color:#F47067"> new</span><span style="color:#DCBDFB"> Array</span><span style="color:#ADBAC7">(code.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">).</span><span style="color:#DCBDFB">fill</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">false</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">const</span><span style="color:#6CB6FF"> mark</span><span style="color:#F47067"> of</span><span style="color:#ADBAC7"> marks) {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">mark) {</span></span>
<span class="line"><span style="color:#F47067">      continue</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    let</span><span style="color:#ADBAC7"> from </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    while</span><span style="color:#ADBAC7"> (from </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> code.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> index</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> code.</span><span style="color:#DCBDFB">indexOf</span><span style="color:#ADBAC7">(mark, from);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      if</span><span style="color:#ADBAC7"> (index </span><span style="color:#F47067">&#x3C;</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">        break</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">let</span><span style="color:#ADBAC7"> cursor </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> index; cursor </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> mark.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">; cursor </span><span style="color:#F47067">+=</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#ADBAC7">        map[cursor] </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> true</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      from </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> map;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> buildCodeSegments</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#F69D50">  code</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  rules</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[],</span></span>
<span class="line"><span style="color:#F69D50">  marks</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[],</span></span>
<span class="line"><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> tokens</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> tokenizeCode</span><span style="color:#ADBAC7">(code, rules);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> markMap</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> buildMarkMap</span><span style="color:#ADBAC7">(code, marks);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> segments</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffSegment</span><span style="color:#ADBAC7">[] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> [];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">const</span><span style="color:#6CB6FF"> token</span><span style="color:#F47067"> of</span><span style="color:#ADBAC7"> tokens) {</span></span>
<span class="line"><span style="color:#F47067">    let</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    while</span><span style="color:#ADBAC7"> (index </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> token.value.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> marked</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> markMap[token.start </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> index] </span><span style="color:#F47067">??</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">      let</span><span style="color:#ADBAC7"> cursor </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> index </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      while</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">        cursor </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> token.value.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> &#x26;&#x26;</span></span>
<span class="line"><span style="color:#ADBAC7">        (markMap[token.start </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> cursor] </span><span style="color:#F47067">??</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">===</span><span style="color:#ADBAC7"> marked</span></span>
<span class="line"><span style="color:#ADBAC7">      ) {</span></span>
<span class="line"><span style="color:#ADBAC7">        cursor </span><span style="color:#F47067">+=</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      segments.</span><span style="color:#DCBDFB">push</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#ADBAC7">        className: token.className,</span></span>
<span class="line"><span style="color:#ADBAC7">        marked,</span></span>
<span class="line"><span style="color:#ADBAC7">        start: token.start </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> index,</span></span>
<span class="line"><span style="color:#ADBAC7">        style: token.style,</span></span>
<span class="line"><span style="color:#ADBAC7">        value: token.value.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(index, cursor),</span></span>
<span class="line"><span style="color:#ADBAC7">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      index </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> cursor;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> segments;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffViewerProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  filename</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  panes</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> 1</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  highlightRules</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> DiffViewer</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  filename</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  panes</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  highlightRules</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> DEFAULT_DIFF_HIGHLIGHT_RULES</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffViewerProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffHighlightRulesContext</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">highlightRules</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 font-mono text-[13px] leading-6 shadow-2xl"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          className,</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">filename </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-4"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">File</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3.5 text-neutral-500"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-xs text-neutral-500"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">filename</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">          className</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`grid grid-cols-1 divide-y divide-neutral-800 \${</span><span style="color:#ADBAC7">panes</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 1</span><span style="color:#F47067"> ?</span><span style="color:#96D0FF"> ""</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "md:grid-cols-2"} md:divide-x md:divide-y-0\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        ></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffHighlightRulesContext</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffPanelProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  side</span><span style="color:#F47067">:</span><span style="color:#96D0FF"> "before"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "after"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> DiffPanel</span><span style="color:#ADBAC7">({ </span><span style="color:#F69D50">children</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">className</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">side</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffPanelProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> data-side</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">side</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"overflow-x-auto"</span><span style="color:#ADBAC7">, className)</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> LINE_STYLES</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  add: {</span></span>
<span class="line"><span style="color:#ADBAC7">    bg: </span><span style="color:#96D0FF">"bg-emerald-500/8"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    bar: </span><span style="color:#96D0FF">"border-l-emerald-500"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    numColor: </span><span style="color:#96D0FF">"text-emerald-600/50"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    sign: </span><span style="color:#96D0FF">"+"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    signColor: </span><span style="color:#96D0FF">"text-emerald-500"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  context: {</span></span>
<span class="line"><span style="color:#ADBAC7">    bg: </span><span style="color:#96D0FF">""</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    bar: </span><span style="color:#96D0FF">"border-l-transparent"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    numColor: </span><span style="color:#96D0FF">"text-neutral-700"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    sign: </span><span style="color:#96D0FF">" "</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    signColor: </span><span style="color:#96D0FF">"text-transparent"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  del: {</span></span>
<span class="line"><span style="color:#ADBAC7">    bg: </span><span style="color:#96D0FF">"bg-red-500/8"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    bar: </span><span style="color:#96D0FF">"border-l-red-500"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    numColor: </span><span style="color:#96D0FF">"text-red-500/50"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    sign: </span><span style="color:#96D0FF">"-"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    signColor: </span><span style="color:#96D0FF">"text-red-500"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">as</span><span style="color:#F47067"> const</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffLineProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  disableHighlighting</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  highlightRules</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#F69D50">  number</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  type</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> LineType</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> getTokenStyle</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">style</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> CSSProperties</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">style) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#6CB6FF"> undefined</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> nextStyle</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#F47067"> |</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  for</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">key</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">value</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">of</span><span style="color:#ADBAC7"> Object.</span><span style="color:#DCBDFB">entries</span><span style="color:#ADBAC7">(style)) {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (value </span><span style="color:#F47067">===</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F47067"> ||</span><span style="color:#ADBAC7"> key </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "color"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      continue</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    nextStyle[key] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> value;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (style.color) {</span></span>
<span class="line"><span style="color:#ADBAC7">    nextStyle[</span><span style="color:#96D0FF">"--diff-token-color"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> String</span><span style="color:#ADBAC7">(style.color);</span></span>
<span class="line"><span style="color:#ADBAC7">    nextStyle.color </span><span style="color:#F47067">=</span><span style="color:#96D0FF"> "var(--diff-mark-text-color, var(--diff-token-color))"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> nextStyle </span><span style="color:#F47067">as</span><span style="color:#F69D50"> CSSProperties</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> highlightTextContent</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#F69D50">  text</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  rules</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[],</span></span>
<span class="line"><span style="color:#F69D50">  keyPrefix</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  withinMark</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (withinMark </span><span style="color:#F47067">||</span><span style="color:#ADBAC7"> text.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> text;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#DCBDFB"> tokenizeCode</span><span style="color:#ADBAC7">(text, rules).</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">token</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">      key</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">keyPrefix</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">token</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">start</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">token</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">value</span><span style="color:#96D0FF">}\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">token.className</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      style</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">getTokenStyle</span><span style="color:#ADBAC7">(token.style)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">token.value</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  ));</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> shouldSkipHighlighting</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">props</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">unknown</span><span style="color:#ADBAC7">>) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    props[</span><span style="color:#96D0FF">"data-diff-highlight"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "off"</span><span style="color:#F47067"> ||</span></span>
<span class="line"><span style="color:#ADBAC7">    props[</span><span style="color:#96D0FF">"data-diff-highlight"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">===</span><span style="color:#6CB6FF"> false</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> highlightNode</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#F69D50">  node</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  rules</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[],</span></span>
<span class="line"><span style="color:#F69D50">  keyPrefix</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  withinMark</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">)</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">typeof</span><span style="color:#ADBAC7"> node </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "string"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#DCBDFB"> highlightTextContent</span><span style="color:#ADBAC7">(node, rules, keyPrefix, withinMark);</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">typeof</span><span style="color:#ADBAC7"> node </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "number"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#DCBDFB"> highlightTextContent</span><span style="color:#ADBAC7">(</span><span style="color:#DCBDFB">String</span><span style="color:#ADBAC7">(node), rules, keyPrefix, withinMark);</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (Array.</span><span style="color:#DCBDFB">isArray</span><span style="color:#ADBAC7">(node)) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> node.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">child</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span></span>
<span class="line"><span style="color:#DCBDFB">      highlightNode</span><span style="color:#ADBAC7">(child, rules, </span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">keyPrefix</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">, withinMark),</span></span>
<span class="line"><span style="color:#ADBAC7">    );</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#DCBDFB">isValidElement</span><span style="color:#ADBAC7">(node)) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> node;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> props</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> node.props </span><span style="color:#F47067">as</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">unknown</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#DCBDFB">shouldSkipHighlighting</span><span style="color:#ADBAC7">(props)) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> node;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"children"</span><span style="color:#F47067"> in</span><span style="color:#ADBAC7"> props)) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> node;</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> nextChildren</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Children.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">    props.children </span><span style="color:#F47067">as</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    (</span><span style="color:#F69D50">child</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span></span>
<span class="line"><span style="color:#DCBDFB">      highlightNode</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">        child,</span></span>
<span class="line"><span style="color:#ADBAC7">        rules,</span></span>
<span class="line"><span style="color:#96D0FF">        \`\${</span><span style="color:#ADBAC7">keyPrefix</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        withinMark </span><span style="color:#F47067">||</span><span style="color:#ADBAC7"> node.type </span><span style="color:#F47067">===</span><span style="color:#ADBAC7"> DiffMark,</span></span>
<span class="line"><span style="color:#ADBAC7">      ),</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#DCBDFB"> cloneElement</span><span style="color:#ADBAC7">(node, </span><span style="color:#6CB6FF">undefined</span><span style="color:#ADBAC7">, nextChildren);</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> DiffLine</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  disableHighlighting</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  highlightRules</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  number</span><span style="color:#ADBAC7">: </span><span style="color:#F69D50">lineNumber</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  type</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "context"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffLineProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> style</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> LINE_STYLES</span><span style="color:#ADBAC7">[type];</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> inheritedRules</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> use</span><span style="color:#ADBAC7">(DiffHighlightRulesContext);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> rules</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> highlightRules </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> inheritedRules;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> highlightedChildren</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useMemo</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">    () </span><span style="color:#F47067">=></span></span>
<span class="line"><span style="color:#ADBAC7">      disableHighlighting</span></span>
<span class="line"><span style="color:#F47067">        ?</span><span style="color:#ADBAC7"> children</span></span>
<span class="line"><span style="color:#F47067">        :</span><span style="color:#ADBAC7"> Children.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">(children, (</span><span style="color:#F69D50">child</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span></span>
<span class="line"><span style="color:#DCBDFB">            highlightNode</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">              child,</span></span>
<span class="line"><span style="color:#ADBAC7">              rules,</span></span>
<span class="line"><span style="color:#96D0FF">              \`diff-line-\${</span><span style="color:#ADBAC7">lineNumber</span><span style="color:#F47067"> ??</span><span style="color:#96D0FF"> "x"}-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">            ),</span></span>
<span class="line"><span style="color:#ADBAC7">          ),</span></span>
<span class="line"><span style="color:#ADBAC7">    [children, disableHighlighting, lineNumber, rules],</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">DiffLineContext</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">type</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "flex items-baseline border-l-[3px] pr-4"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          style.bg,</span></span>
<span class="line"><span style="color:#ADBAC7">          style.bar,</span></span>
<span class="line"><span style="color:#ADBAC7">          className,</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">lineNumber </span><span style="color:#F47067">!==</span><span style="color:#6CB6FF"> undefined</span><span style="color:#F47067"> &#x26;&#x26;</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">            className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">              "w-8 shrink-0 select-none text-right text-[11px]"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              style.numColor,</span></span>
<span class="line"><span style="color:#ADBAC7">            )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          ></span></span>
<span class="line"><span style="color:#F47067">            {</span><span style="color:#ADBAC7">lineNumber</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">          className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">            "w-5 shrink-0 select-none text-center text-xs"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">            style.signColor,</span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        ></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">style.sign</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"whitespace-pre text-neutral-300"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">highlightedChildren</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">DiffLineContext</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffCodeProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  code</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  marks</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#F69D50">  rules</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> DiffHighlightRule</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> DiffCode</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  code</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  marks</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> EMPTY_MARKS</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  rules</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> DEFAULT_DIFF_HIGHLIGHT_RULES</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffCodeProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> segments</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useMemo</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">    () </span><span style="color:#F47067">=></span><span style="color:#DCBDFB"> buildCodeSegments</span><span style="color:#ADBAC7">(code, rules, marks),</span></span>
<span class="line"><span style="color:#ADBAC7">    [code, marks, rules],</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">className</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">segments.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">segment</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">        const</span><span style="color:#DCBDFB"> content</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">segment.className</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">segment.style</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">            {</span><span style="color:#ADBAC7">segment.value</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">        const</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> \`\${</span><span style="color:#ADBAC7">segment</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">start</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">segment</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">value</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">segment</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">marked</span><span style="color:#F47067"> ?</span><span style="color:#96D0FF"> "mark"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "plain"}\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">        if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">segment.marked) {</span></span>
<span class="line"><span style="color:#F47067">          return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">key</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">content</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">        return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">key</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">content</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">DiffMark</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">      })</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> DiffMarkProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  markClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> DiffMark</span><span style="color:#ADBAC7">({ </span><span style="color:#F69D50">children</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">className</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">markClassName</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">:</span><span style="color:#F69D50"> DiffMarkProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> lineType</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> use</span><span style="color:#ADBAC7">(DiffLineContext);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> markBg</span><span style="color:#F47067"> =</span></span>
<span class="line"><span style="color:#ADBAC7">    lineType </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "add"</span></span>
<span class="line"><span style="color:#F47067">      ?</span><span style="color:#96D0FF"> "bg-emerald-500/25"</span></span>
<span class="line"><span style="color:#F47067">      :</span><span style="color:#ADBAC7"> lineType </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "del"</span></span>
<span class="line"><span style="color:#F47067">        ?</span><span style="color:#96D0FF"> "bg-red-500/25"</span></span>
<span class="line"><span style="color:#F47067">        :</span><span style="color:#96D0FF"> "bg-neutral-500/25"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"rounded-sm px-0.5"</span><span style="color:#ADBAC7">, markBg, markClassName)</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">className</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">DiffPanel.displayName </span><span style="color:#F47067">=</span><span style="color:#96D0FF"> "DiffPanel"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffViewer,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffPanel,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffLine,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffCode,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffMark,</span></span>
<span class="line"><span style="color:#ADBAC7">  buildCodeSegments,</span></span>
<span class="line"><span style="color:#ADBAC7">  tokenizeCode,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffViewerProps,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffPanelProps,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffLineProps,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffCodeProps,</span></span>
<span class="line"><span style="color:#ADBAC7">  DiffMarkProps,</span></span>
<span class="line"><span style="color:#ADBAC7">  LineType,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/diff-viewer</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/diff-viewer</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/diff-viewer</span></span></code></pre>`,
      },
    },
    usage: `import {
  DiffLine,
  DiffMark,
  DiffPanel,
  DiffViewer,
} from "@/registry/base-vega/diff-viewer/diff-viewer";

const highlightRules = [
  {
    name: "keyword",
    pattern: /\\b(?:import|from|export|function|const|return)\\b/,
    style: { color: "#38bdf8" },
  },
  {
    name: "string",
    pattern: /"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'/,
    style: { color: "#fbbf24" },
  },
];

<DiffViewer filename="app/home-screen.tsx" highlightRules={highlightRules}>
  <DiffPanel side="before">
    <DiffLine type="del" number={1}>
      {"import { "}
      <DiffMark className="text-red-200">useVehicleState</DiffMark>
      {" } "}
      {\`from "@/hooks/useVehicleState";\`}
    </DiffLine>
    <DiffLine type="del" number={2}>
      {\` const { \`}
      <DiffMark className="text-red-200">selectedVehicle</DiffMark>
      {" } = "}
      <DiffMark className="text-red-200">useVehicleState</DiffMark>();
    </DiffLine>
  </DiffPanel>

  <DiffPanel side="after">
    <DiffLine type="add" number={1}>
      {"import { "}
      <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>
      {" } "}
      "@/hooks/useVehicleStates";
    </DiffLine>
    <DiffLine type="add" number={2}>
      {\`const { \`}
      <DiffMark className="text-emerald-200">activeVehicle</DiffMark>
      {" } = "}
      <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>();
    </DiffLine>
  </DiffPanel>
</DiffViewer>;`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Compose with DiffPanel children to define the before and after panes",
      },
      {
        name: "filename",
        type: "string",
        description:
          "Optional file label rendered in the header, like a code block title",
      },
      {
        name: "highlightRules",
        type: "DiffHighlightRule[]",
        default: "DEFAULT_DIFF_HIGHLIGHT_RULES",
        description:
          "Tokenizer rules used to automatically syntax-highlight text children inside DiffLine",
      },
      {
        name: "panes",
        type: "1 | 2",
        default: "2",
        description:
          "The number of panes your diff will have. Useful when creating inline diff-view",
      },
      {
        name: "className",
        type: "string",
        description:
          "Custom classes applied to the outer diff viewer container",
      },
    ],
    subComponents: [
      {
        name: "DiffPanel",
        description:
          "One side of the diff. On mobile the panels stack vertically; from md upwards they render side by side.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Diff lines for a single side of the comparison",
          },
          {
            name: "side",
            type: '"before" | "after"',
            description:
              "Logical panel side used for composition and semantics",
          },
          {
            name: "className",
            type: "string",
            description: "Custom classes for the panel wrapper",
          },
        ],
      },
      {
        name: "DiffLine",
        description:
          "A single diff row. Automatically highlights text children and provides add/del state to nested DiffMark elements.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description:
              "Line content. Plain text is tokenized automatically; nested DiffMark stays precise.",
          },
          {
            name: "type",
            type: '"add" | "del" | "context"',
            default: '"context"',
            description:
              "Controls line chrome, sign, and inherited mark styling",
          },
          {
            name: "number",
            type: "number",
            description: "Optional line number displayed in the gutter",
          },
          {
            name: "highlightRules",
            type: "DiffHighlightRule[]",
            description:
              "Optional per-line override for syntax highlighting rules",
          },
          {
            name: "disableHighlighting",
            type: "boolean",
            default: "false",
            description: "Disables automatic syntax highlighting for that line",
          },
          {
            name: "className",
            type: "string",
            description: "Custom classes for the line wrapper",
          },
        ],
      },
      {
        name: "DiffMark",
        description:
          "Inline changed fragment. Inherits add/del state from the parent DiffLine and lets you color the inner text directly with className.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description:
              "The exact changed text or nested content to emphasize",
          },
          {
            name: "className",
            type: "string",
            description:
              "Classes applied to the inner text inside the highlighted mark",
          },
          {
            name: "markClassName",
            type: "string",
            description: "Optional classes for the outer highlighted wrapper",
          },
        ],
      },
    ],
  },
  {
    slug: "editable-heading",
    name: "Editable Heading",
    description:
      "An interactive heading styled as a text field that reveals a formatting toolbar on click. Supports bold, italic, underline, alignment, and font size controls. Inspired by Kree8's landing page design.",
    categories: ["text"],
    sourcePath: "registry/base-vega/editable-heading/editable-heading.tsx",
    sourceCode: `"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  Underline,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type EditableHeadingFontSize = "sm" | "base" | "lg" | "xl" | "2xl";
type EditableHeadingAlign = "left" | "center" | "right";

interface EditableHeadingProps {
  text?: string;
  defaultBold?: boolean;
  defaultItalic?: boolean;
  defaultUnderline?: boolean;
  defaultAlign?: EditableHeadingAlign;
  defaultFontSize?: EditableHeadingFontSize;
  className?: string;
}

const fontSizeMap: Record<EditableHeadingFontSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const fontSizeLabels: Record<EditableHeadingFontSize, string> = {
  sm: "S",
  base: "M",
  lg: "L",
  xl: "XL",
  "2xl": "2X",
};

export function EditableHeading({
  text = "Versatility",
  defaultBold = false,
  defaultItalic = false,
  defaultUnderline = false,
  defaultAlign = "center",
  defaultFontSize = "base",
  className,
}: EditableHeadingProps) {
  const [open, setOpen] = useState(false);
  const [bold, setBold] = useState(defaultBold);
  const [italic, setItalic] = useState(defaultItalic);
  const [underline, setUnderline] = useState(defaultUnderline);
  const [align, setAlign] = useState<EditableHeadingAlign>(defaultAlign);
  const [fontSize, setFontSize] =
    useState<EditableHeadingFontSize>(defaultFontSize);

  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarPos, setToolbarPos] = useState({ left: 0, top: 0 });

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  // Continuously measure toolbar position via rAF while open.
  useEffect(() => {
    if (!open) return;
    let rafId: number;
    const tick = () => {
      if (!buttonRef.current || !textRef.current || !toolbarRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      const toolbarRect = toolbarRef.current.getBoundingClientRect();

      const pad = 8;
      const gap = 4;
      const viewportWidth = document.documentElement.clientWidth;

      // Desired center = text's center in viewport coords
      const desiredCenterX = textRect.left + textRect.width / 2;

      // Clamp so toolbar stays fully inside the viewport
      const clampedCenterX = Math.max(
        toolbarRect.width / 2 + pad,
        Math.min(viewportWidth - toolbarRect.width / 2 - pad, desiredCenterX),
      );

      setToolbarPos({
        left: clampedCenterX - toolbarRect.width / 2,
        top: buttonRect.top - toolbarRect.height - gap,
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [open]);

  return (
    <div ref={containerRef} className="w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full border border-dashed bg-transparent px-3 py-2 text-center shadow-xs transition-all outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "hover:border-ring/50 cursor-pointer",
          fontSizeMap[fontSize],
          bold && "font-bold",
          italic && "italic",
          underline && "underline underline-offset-2",
          className,
        )}
        style={{ textAlign: align }}
      >
        <span ref={textRef}>{text}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              left: toolbarPos.left,
              top: toolbarPos.top,
            }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.15, ease: "easeOut" },
              scale: { duration: 0.15, ease: "easeOut" },
              y: { duration: 0.15, ease: "easeOut" },
              left: { type: "spring", stiffness: 300, damping: 30 },
              top: { duration: 0 },
            }}
            style={{ position: "fixed", zIndex: 50 }}
          >
            <div
              ref={toolbarRef}
              className={cn(
                "w-fit flex items-center rounded-xl border border-neutral-900 bg-background shadow-md",
                isMobile ? "gap-1 p-1.5" : "gap-2 p-2",
              )}
            >
              <ToggleGroup
                multiple
                variant="outline"
                size="sm"
                value={[
                  ...(bold ? (["bold"] as const) : []),
                  ...(italic ? (["italic"] as const) : []),
                  ...(underline ? (["underline"] as const) : []),
                ]}
                onValueChange={(values: string[]) => {
                  setBold(values.includes("bold"));
                  setItalic(values.includes("italic"));
                  setUnderline(values.includes("underline"));
                }}
              >
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="underline"
                  aria-label="Toggle underline"
                >
                  <Underline />
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="h-6 w-px bg-border" />

              <ToggleGroup
                variant="outline"
                size="sm"
                value={[align]}
                onValueChange={(values: string[]) => {
                  if (values.length > 0) {
                    setAlign(values[values.length - 1] as EditableHeadingAlign);
                  }
                }}
              >
                <ToggleGroupItem value="left" aria-label="Align left">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="h-6 w-px bg-border" />

              {isMobile ? (
                <SelectPrimitive.Root
                  value={fontSize}
                  onValueChange={(v) => {
                    if (v) setFontSize(v as EditableHeadingFontSize);
                  }}
                  items={fontSizeLabels}
                  modal={false}
                >
                  <SelectPrimitive.Trigger
                    className={cn(
                      "inline-flex items-center justify-center gap-1 rounded-md border border-input bg-transparent shadow-xs",
                      "hover:bg-muted cursor-pointer outline-none",
                      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      "h-7 min-w-7 px-1.5 text-xs",
                    )}
                  >
                    <SelectPrimitive.Value />
                    <ChevronDown className="size-3 opacity-50" />
                  </SelectPrimitive.Trigger>
                  <SelectPrimitive.Portal>
                    <SelectPrimitive.Positioner>
                      <SelectPrimitive.Popup className="z-[100] min-w-[var(--anchor-width)] rounded-xl border border-neutral-900 bg-background p-1 shadow-md">
                        {(
                          Object.keys(
                            fontSizeLabels,
                          ) as EditableHeadingFontSize[]
                        ).map((size) => (
                          <SelectPrimitive.Item
                            key={size}
                            value={size}
                            className="flex items-center justify-center rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted data-[highlighted]:bg-muted outline-none"
                          >
                            <SelectPrimitive.ItemText>
                              {fontSizeLabels[size]}
                            </SelectPrimitive.ItemText>
                          </SelectPrimitive.Item>
                        ))}
                      </SelectPrimitive.Popup>
                    </SelectPrimitive.Positioner>
                  </SelectPrimitive.Portal>
                </SelectPrimitive.Root>
              ) : (
                <ToggleGroup
                  variant="outline"
                  size="sm"
                  value={[fontSize]}
                  onValueChange={(values: string[]) => {
                    if (values.length > 0) {
                      setFontSize(
                        values[values.length - 1] as EditableHeadingFontSize,
                      );
                    }
                  }}
                >
                  {(
                    Object.keys(fontSizeLabels) as EditableHeadingFontSize[]
                  ).map((size) => (
                    <ToggleGroupItem
                      key={size}
                      value={size}
                      aria-label={\`Font size \${fontSizeLabels[size]}\`}
                      className="min-w-8"
                    >
                      {fontSizeLabels[size]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { EditableHeadingFontSize, EditableHeadingAlign };`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/editable-heading",
      pnpm: "pnpm dlx shadcn@latest add @arni/editable-heading",
      bun: "bunx --bun shadcn@latest add @arni/editable-heading",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { EditableHeading } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/editable-heading/editable-heading"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Basic usage</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">EditableHeading</span><span style="color:#ADBAC7"> />;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Custom text</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">EditableHeading</span><span style="color:#6CB6FF"> text</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Welcome to the Future"</span><span style="color:#ADBAC7"> />;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// With default styling</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">EditableHeading</span></span>
<span class="line"><span style="color:#6CB6FF">  text</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Styled Heading"</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultBold</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultAlign</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"left"</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultFontSize</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"xl"</span></span>
<span class="line"><span style="color:#ADBAC7">/>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Full customization</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">EditableHeading</span></span>
<span class="line"><span style="color:#6CB6FF">  text</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Get Started"</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultBold</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultItalic</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultUnderline</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultAlign</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"center"</span></span>
<span class="line"><span style="color:#6CB6FF">  defaultFontSize</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"2xl"</span></span>
<span class="line"><span style="color:#6CB6FF">  className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"font-mono"</span></span>
<span class="line"><span style="color:#ADBAC7">/>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { Select </span><span style="color:#F47067">as</span><span style="color:#ADBAC7"> SelectPrimitive } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@base-ui/react/select"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  AlignCenter,</span></span>
<span class="line"><span style="color:#ADBAC7">  AlignLeft,</span></span>
<span class="line"><span style="color:#ADBAC7">  AlignRight,</span></span>
<span class="line"><span style="color:#ADBAC7">  Bold,</span></span>
<span class="line"><span style="color:#ADBAC7">  ChevronDown,</span></span>
<span class="line"><span style="color:#ADBAC7">  Italic,</span></span>
<span class="line"><span style="color:#ADBAC7">  Underline,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "lucide-react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { AnimatePresence, motion } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "motion/react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { useCallback, useEffect, useRef, useState } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { ToggleGroup, ToggleGroupItem } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/components/ui/toggle-group"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { useIsMobile } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/hooks/use-mobile"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { cn } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/lib/utils"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "sm"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "base"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "lg"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "xl"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "2xl"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> EditableHeadingAlign</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "left"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "center"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "right"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">interface</span><span style="color:#F69D50"> EditableHeadingProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  text</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultBold</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultItalic</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultUnderline</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultAlign</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> EditableHeadingAlign</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  defaultFontSize</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> fontSizeMap</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">EditableHeadingFontSize</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  sm: </span><span style="color:#96D0FF">"text-sm"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  base: </span><span style="color:#96D0FF">"text-base"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  lg: </span><span style="color:#96D0FF">"text-lg"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  xl: </span><span style="color:#96D0FF">"text-xl"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">  "2xl"</span><span style="color:#ADBAC7">: </span><span style="color:#96D0FF">"text-2xl"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> fontSizeLabels</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">EditableHeadingFontSize</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  sm: </span><span style="color:#96D0FF">"S"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  base: </span><span style="color:#96D0FF">"M"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  lg: </span><span style="color:#96D0FF">"L"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  xl: </span><span style="color:#96D0FF">"XL"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">  "2xl"</span><span style="color:#ADBAC7">: </span><span style="color:#96D0FF">"2X"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> EditableHeading</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  text</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "Versatility"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultBold</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultItalic</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultUnderline</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultAlign</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "center"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  defaultFontSize</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "base"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> EditableHeadingProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">open</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setOpen</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">false</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">bold</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setBold</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(defaultBold);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">italic</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setItalic</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(defaultItalic);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">underline</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setUnderline</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(defaultUnderline);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">align</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setAlign</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">EditableHeadingAlign</span><span style="color:#ADBAC7">>(defaultAlign);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">fontSize</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setFontSize</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span></span>
<span class="line"><span style="color:#DCBDFB">    useState</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">EditableHeadingFontSize</span><span style="color:#ADBAC7">>(defaultFontSize);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> isMobile</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useIsMobile</span><span style="color:#ADBAC7">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> containerRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLDivElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> buttonRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLButtonElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> textRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLSpanElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> toolbarRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLDivElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">toolbarPos</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setToolbarPos</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">({ left: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, top: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7"> });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> handleClickOutside</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useCallback</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">e</span><span style="color:#F47067">:</span><span style="color:#F69D50"> MouseEvent</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">      containerRef.current </span><span style="color:#F47067">&#x26;&#x26;</span></span>
<span class="line"><span style="color:#F47067">      !</span><span style="color:#ADBAC7">containerRef.current.</span><span style="color:#DCBDFB">contains</span><span style="color:#ADBAC7">(e.target </span><span style="color:#F47067">as</span><span style="color:#F69D50"> Node</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">    ) {</span></span>
<span class="line"><span style="color:#DCBDFB">      setOpen</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">false</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"><span style="color:#ADBAC7">  }, []);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">open) </span><span style="color:#F47067">return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    document.</span><span style="color:#DCBDFB">addEventListener</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"mousedown"</span><span style="color:#ADBAC7">, handleClickOutside);</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> document.</span><span style="color:#DCBDFB">removeEventListener</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"mousedown"</span><span style="color:#ADBAC7">, handleClickOutside);</span></span>
<span class="line"><span style="color:#ADBAC7">  }, [open, handleClickOutside]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">  // Continuously measure toolbar position via rAF while open.</span></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">open) </span><span style="color:#F47067">return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">    let</span><span style="color:#ADBAC7"> rafId</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#DCBDFB"> tick</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">      if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">buttonRef.current </span><span style="color:#F47067">||</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">textRef.current </span><span style="color:#F47067">||</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">toolbarRef.current) {</span></span>
<span class="line"><span style="color:#ADBAC7">        rafId </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> requestAnimationFrame</span><span style="color:#ADBAC7">(tick);</span></span>
<span class="line"><span style="color:#F47067">        return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> buttonRect</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> buttonRef.current.</span><span style="color:#DCBDFB">getBoundingClientRect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> textRect</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> textRef.current.</span><span style="color:#DCBDFB">getBoundingClientRect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> toolbarRect</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> toolbarRef.current.</span><span style="color:#DCBDFB">getBoundingClientRect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> pad</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 8</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> gap</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 4</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> viewportWidth</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> document.documentElement.clientWidth;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">      // Desired center = text's center in viewport coords</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> desiredCenterX</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> textRect.left </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> textRect.width </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">      // Clamp so toolbar stays fully inside the viewport</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> clampedCenterX</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">max</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">        toolbarRect.width </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#F47067"> +</span><span style="color:#ADBAC7"> pad,</span></span>
<span class="line"><span style="color:#ADBAC7">        Math.</span><span style="color:#DCBDFB">min</span><span style="color:#ADBAC7">(viewportWidth </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> toolbarRect.width </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#F47067"> -</span><span style="color:#ADBAC7"> pad, desiredCenterX),</span></span>
<span class="line"><span style="color:#ADBAC7">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">      setToolbarPos</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#ADBAC7">        left: clampedCenterX </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> toolbarRect.width </span><span style="color:#F47067">/</span><span style="color:#6CB6FF"> 2</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        top: buttonRect.top </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> toolbarRect.height </span><span style="color:#F47067">-</span><span style="color:#ADBAC7"> gap,</span></span>
<span class="line"><span style="color:#ADBAC7">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      rafId </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> requestAnimationFrame</span><span style="color:#ADBAC7">(tick);</span></span>
<span class="line"><span style="color:#ADBAC7">    };</span></span>
<span class="line"><span style="color:#ADBAC7">    rafId </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> requestAnimationFrame</span><span style="color:#ADBAC7">(tick);</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#DCBDFB"> cancelAnimationFrame</span><span style="color:#ADBAC7">(rafId);</span></span>
<span class="line"><span style="color:#ADBAC7">  }, [open]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">containerRef</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"w-full"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">button</span></span>
<span class="line"><span style="color:#6CB6FF">        ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">buttonRef</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        type</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"button"</span></span>
<span class="line"><span style="color:#6CB6FF">        onClick</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">() </span><span style="color:#F47067">=></span><span style="color:#DCBDFB"> setOpen</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">prev</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">prev)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "w-full border border-dashed bg-transparent px-3 py-2 text-center shadow-xs transition-all outline-none"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">          "hover:border-ring/50 cursor-pointer"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          fontSizeMap[fontSize],</span></span>
<span class="line"><span style="color:#ADBAC7">          bold </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#96D0FF"> "font-bold"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          italic </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#96D0FF"> "italic"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          underline </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#96D0FF"> "underline underline-offset-2"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          className,</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ textAlign: align }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">textRef</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">text</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">button</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">AnimatePresence</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">open </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">motion.div</span></span>
<span class="line"><span style="color:#6CB6FF">            initial</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ opacity: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, y: </span><span style="color:#F47067">-</span><span style="color:#6CB6FF">4</span><span style="color:#ADBAC7">, scale: </span><span style="color:#6CB6FF">0.95</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            animate</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">              opacity: </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              y: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              scale: </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              left: toolbarPos.left,</span></span>
<span class="line"><span style="color:#ADBAC7">              top: toolbarPos.top,</span></span>
<span class="line"><span style="color:#ADBAC7">            }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            exit</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ opacity: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, y: </span><span style="color:#F47067">-</span><span style="color:#6CB6FF">4</span><span style="color:#ADBAC7">, scale: </span><span style="color:#6CB6FF">0.95</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            transition</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">              opacity: { duration: </span><span style="color:#6CB6FF">0.15</span><span style="color:#ADBAC7">, ease: </span><span style="color:#96D0FF">"easeOut"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">              scale: { duration: </span><span style="color:#6CB6FF">0.15</span><span style="color:#ADBAC7">, ease: </span><span style="color:#96D0FF">"easeOut"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">              y: { duration: </span><span style="color:#6CB6FF">0.15</span><span style="color:#ADBAC7">, ease: </span><span style="color:#96D0FF">"easeOut"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">              left: { type: </span><span style="color:#96D0FF">"spring"</span><span style="color:#ADBAC7">, stiffness: </span><span style="color:#6CB6FF">300</span><span style="color:#ADBAC7">, damping: </span><span style="color:#6CB6FF">30</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">              top: { duration: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">            }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ position: </span><span style="color:#96D0FF">"fixed"</span><span style="color:#ADBAC7">, zIndex: </span><span style="color:#6CB6FF">50</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          ></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">              ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">toolbarRef</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">                "w-fit flex items-center rounded-xl border border-neutral-900 bg-background shadow-md"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                isMobile </span><span style="color:#F47067">?</span><span style="color:#96D0FF"> "gap-1 p-1.5"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "gap-2 p-2"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            ></span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">ToggleGroup</span></span>
<span class="line"><span style="color:#6CB6FF">                multiple</span></span>
<span class="line"><span style="color:#6CB6FF">                variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"outline"</span></span>
<span class="line"><span style="color:#6CB6FF">                size</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"sm"</span></span>
<span class="line"><span style="color:#6CB6FF">                value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[</span></span>
<span class="line"><span style="color:#F47067">                  ...</span><span style="color:#ADBAC7">(bold </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> ([</span><span style="color:#96D0FF">"bold"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">as</span><span style="color:#F47067"> const</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> []),</span></span>
<span class="line"><span style="color:#F47067">                  ...</span><span style="color:#ADBAC7">(italic </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> ([</span><span style="color:#96D0FF">"italic"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">as</span><span style="color:#F47067"> const</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> []),</span></span>
<span class="line"><span style="color:#F47067">                  ...</span><span style="color:#ADBAC7">(underline </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> ([</span><span style="color:#96D0FF">"underline"</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">as</span><span style="color:#F47067"> const</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> []),</span></span>
<span class="line"><span style="color:#ADBAC7">                ]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                onValueChange</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">values</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[]) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#DCBDFB">                  setBold</span><span style="color:#ADBAC7">(values.</span><span style="color:#DCBDFB">includes</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"bold"</span><span style="color:#ADBAC7">));</span></span>
<span class="line"><span style="color:#DCBDFB">                  setItalic</span><span style="color:#ADBAC7">(values.</span><span style="color:#DCBDFB">includes</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"italic"</span><span style="color:#ADBAC7">));</span></span>
<span class="line"><span style="color:#DCBDFB">                  setUnderline</span><span style="color:#ADBAC7">(values.</span><span style="color:#DCBDFB">includes</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"underline"</span><span style="color:#ADBAC7">));</span></span>
<span class="line"><span style="color:#ADBAC7">                }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">              ></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"bold"</span><span style="color:#6CB6FF"> aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Toggle bold"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">Bold</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"italic"</span><span style="color:#6CB6FF"> aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Toggle italic"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">Italic</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span></span>
<span class="line"><span style="color:#6CB6FF">                  value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"underline"</span></span>
<span class="line"><span style="color:#6CB6FF">                  aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Toggle underline"</span></span>
<span class="line"><span style="color:#ADBAC7">                ></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">Underline</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;/</span><span style="color:#8DDB8C">ToggleGroup</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"h-6 w-px bg-border"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">ToggleGroup</span></span>
<span class="line"><span style="color:#6CB6FF">                variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"outline"</span></span>
<span class="line"><span style="color:#6CB6FF">                size</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"sm"</span></span>
<span class="line"><span style="color:#6CB6FF">                value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[align]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                onValueChange</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">values</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[]) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">                  if</span><span style="color:#ADBAC7"> (values.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ></span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">                    setAlign</span><span style="color:#ADBAC7">(values[values.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> -</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">as</span><span style="color:#F69D50"> EditableHeadingAlign</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span></span>
<span class="line"><span style="color:#ADBAC7">                }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">              ></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"left"</span><span style="color:#6CB6FF"> aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Align left"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">AlignLeft</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"center"</span><span style="color:#6CB6FF"> aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Align center"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">AlignCenter</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#6CB6FF"> value</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"right"</span><span style="color:#6CB6FF"> aria-label</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Align right"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">AlignRight</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;/</span><span style="color:#8DDB8C">ToggleGroup</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"h-6 w-px bg-border"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">              {</span><span style="color:#ADBAC7">isMobile </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Root</span></span>
<span class="line"><span style="color:#6CB6FF">                  value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">fontSize</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                  onValueChange</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">v</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">                    if</span><span style="color:#ADBAC7"> (v) </span><span style="color:#DCBDFB">setFontSize</span><span style="color:#ADBAC7">(v </span><span style="color:#F47067">as</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                  items</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">fontSizeLabels</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                  modal</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">false</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                ></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Trigger</span></span>
<span class="line"><span style="color:#6CB6FF">                    className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">                      "inline-flex items-center justify-center gap-1 rounded-md border border-input bg-transparent shadow-xs"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">                      "hover:bg-muted cursor-pointer outline-none"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">                      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">                      "h-7 min-w-7 px-1.5 text-xs"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                    )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                  ></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Value</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">ChevronDown</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3 opacity-50"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Trigger</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Portal</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Positioner</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                      &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Popup</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"z-[100] min-w-[var(--anchor-width)] rounded-xl border border-neutral-900 bg-background p-1 shadow-md"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">                        {</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">                          Object.</span><span style="color:#DCBDFB">keys</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">                            fontSizeLabels,</span></span>
<span class="line"><span style="color:#ADBAC7">                          ) </span><span style="color:#F47067">as</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#ADBAC7">[]</span></span>
<span class="line"><span style="color:#ADBAC7">                        ).</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">size</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                          &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.Item</span></span>
<span class="line"><span style="color:#6CB6FF">                            key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">size</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                            value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">size</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                            className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center justify-center rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted data-[highlighted]:bg-muted outline-none"</span></span>
<span class="line"><span style="color:#ADBAC7">                          ></span></span>
<span class="line"><span style="color:#ADBAC7">                            &#x3C;</span><span style="color:#8DDB8C">SelectPrimitive.ItemText</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">                              {</span><span style="color:#ADBAC7">fontSizeLabels[size]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                            &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.ItemText</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                          &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Item</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                        ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                      &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Popup</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Positioner</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Portal</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">SelectPrimitive.Root</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">              ) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ToggleGroup</span></span>
<span class="line"><span style="color:#6CB6FF">                  variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"outline"</span></span>
<span class="line"><span style="color:#6CB6FF">                  size</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"sm"</span></span>
<span class="line"><span style="color:#6CB6FF">                  value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[fontSize]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                  onValueChange</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">values</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[]) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">                    if</span><span style="color:#ADBAC7"> (values.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ></span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">                      setFontSize</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">                        values[values.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> -</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">as</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                      );</span></span>
<span class="line"><span style="color:#ADBAC7">                    }</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                ></span></span>
<span class="line"><span style="color:#F47067">                  {</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">                    Object.</span><span style="color:#DCBDFB">keys</span><span style="color:#ADBAC7">(fontSizeLabels) </span><span style="color:#F47067">as</span><span style="color:#F69D50"> EditableHeadingFontSize</span><span style="color:#ADBAC7">[]</span></span>
<span class="line"><span style="color:#ADBAC7">                  ).</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">size</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">ToggleGroupItem</span></span>
<span class="line"><span style="color:#6CB6FF">                      key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">size</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      value</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">size</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      aria-label</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`Font size \${</span><span style="color:#ADBAC7">fontSizeLabels</span><span style="color:#96D0FF">[</span><span style="color:#ADBAC7">size</span><span style="color:#96D0FF">]</span><span style="color:#96D0FF">}\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"min-w-8"</span></span>
<span class="line"><span style="color:#ADBAC7">                    ></span></span>
<span class="line"><span style="color:#F47067">                      {</span><span style="color:#ADBAC7">fontSizeLabels[size]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;/</span><span style="color:#8DDB8C">ToggleGroupItem</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">ToggleGroup</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">              )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">motion.div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">AnimatePresence</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#ADBAC7"> { EditableHeadingFontSize, EditableHeadingAlign };</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/editable-heading</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/editable-heading</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/editable-heading</span></span></code></pre>`,
      },
    },
    usage: `import { EditableHeading } from "@/registry/base-vega/editable-heading/editable-heading";

// Basic usage
<EditableHeading />;

// Custom text
<EditableHeading text="Welcome to the Future" />;

// With default styling
<EditableHeading
  text="Styled Heading"
  defaultBold
  defaultAlign="left"
  defaultFontSize="xl"
/>;

// Full customization
<EditableHeading
  text="Get Started"
  defaultBold
  defaultItalic
  defaultUnderline
  defaultAlign="center"
  defaultFontSize="2xl"
  className="font-mono"
/>;`,
    props: [
      {
        name: "text",
        type: "string",
        default: '"Versatility"',
        description: "The text content displayed in the heading",
      },
      {
        name: "defaultBold",
        type: "boolean",
        default: "false",
        description: "Initial bold state",
      },
      {
        name: "defaultItalic",
        type: "boolean",
        default: "false",
        description: "Initial italic state",
      },
      {
        name: "defaultUnderline",
        type: "boolean",
        default: "false",
        description: "Initial underline state",
      },
      {
        name: "defaultAlign",
        type: '"left" | "center" | "right"',
        default: '"center"',
        description: "Initial text alignment",
      },
      {
        name: "defaultFontSize",
        type: '"sm" | "base" | "lg" | "xl" | "2xl"',
        default: '"base"',
        description: "Initial font size",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes applied to the trigger button",
      },
    ],
    subComponents: [],
  },
  {
    slug: "floating-navbar",
    name: "Floating Navbar",
    description:
      "A reusable floating navigation bar with preserved motion behavior, array-driven links, and flexible brand configuration for logo or text.",
    categories: ["navigation", "marketing"],
    sourcePath: "registry/base-vega/floating-navbar/floating-navbar.tsx",
    sourceCode: `"use client";

import { ArrowRight, Menu } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  type HTMLAttributeAnchorTarget,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type FloatingNavbarItem = {
  href: string;
  label: ReactNode;
  mobileLabel?: ReactNode;
  className?: string;
  mobileClassName?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
};

export type FloatingNavbarBrandLogoConfig = {
  src: string;
  alt: string;
  darkSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export type FloatingNavbarBrand = {
  href?: string;
  logo?: FloatingNavbarBrandLogoConfig;
  text?: ReactNode;
  content?: ReactNode;
  className?: string;
  textClassName?: string;
};

export type FloatingNavbarCallToAction = {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
};

export type FloatingNavbarProps = {
  items: FloatingNavbarItem[];
  brand?: FloatingNavbarBrand;
  callToAction?: FloatingNavbarCallToAction;
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
  className?: string;
  contentClassName?: string;
  navClassName?: string;
  navItemClassName?: string;
  mobileSheetClassName?: string;
  mobileNavClassName?: string;
  mobileNavItemClassName?: string;
  mobileSide?: "top" | "right" | "bottom" | "left";
  menuButtonLabel?: string;
};

const DEFAULT_NAV_CLASS =
  "hidden md:flex items-center gap-8 text-sm font-medium";
const DEFAULT_NAV_ITEM_CLASS = "hover:text-primary transition-colors";
const DEFAULT_CTA_CLASS =
  "hidden md:flex group items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-all";
const DEFAULT_MOBILE_ITEM_CLASS =
  "text-2xl font-medium hover:text-primary transition-colors";

export function FloatingNavbarBrandLogo({
  src,
  darkSrc,
  alt,
  width = 140,
  height = 28,
  className,
  priority,
}: FloatingNavbarBrandLogoConfig) {
  if (!darkSrc) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain dark:hidden", className)}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("hidden object-contain dark:block", className)}
      />
    </>
  );
}

export function FloatingNavbarBrandText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-base font-semibold", className)}>{children}</span>
  );
}

export function FloatingNavbar({
  items,
  brand,
  callToAction,
  leadingSlot,
  trailingSlot,
  className,
  contentClassName,
  navClassName,
  navItemClassName,
  mobileSheetClassName,
  mobileNavClassName,
  mobileNavItemClassName,
  mobileSide = "right",
  menuButtonLabel = "Open menu",
}: FloatingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ maxWidth: "90%" }}
      animate={{
        maxWidth: scrolled ? "100%" : "90%",
        top: scrolled ? "8px" : "28px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-4 right-4 z-50 mx-auto rounded-xl border border-border/40 bg-background/80 backdrop-blur-md md:top-6 md:right-6 md:left-6",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-4 py-3",
          contentClassName,
        )}
      >
        <Link
          href={brand?.href ?? "/"}
          className={cn(
            "flex items-center gap-2 font-bold tracking-tight",
            brand?.className,
          )}
        >
          {brand?.content ? (
            brand.content
          ) : (
            <>
              {brand?.logo ? <FloatingNavbarBrandLogo {...brand.logo} /> : null}
              {brand?.text || !brand?.logo ? (
                <FloatingNavbarBrandText className={brand?.textClassName}>
                  {brand?.text ?? "Brand"}
                </FloatingNavbarBrandText>
              ) : null}
            </>
          )}
        </Link>

        <nav className={cn(DEFAULT_NAV_CLASS, navClassName)}>
          {items.map((item, index) => (
            <Link
              key={\`\${item.href}-\${index}\`}
              href={item.href}
              target={item.target}
              rel={item.rel}
              className={cn(
                DEFAULT_NAV_ITEM_CLASS,
                navItemClassName,
                item.className,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {leadingSlot}
          {callToAction ? (
            <Link
              href={callToAction.href}
              target={callToAction.target}
              rel={callToAction.rel}
              className={cn(DEFAULT_CTA_CLASS, callToAction.className)}
            >
              <span>{callToAction.label}</span>
              {callToAction.icon ?? (
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={16}
                />
              )}
            </Link>
          ) : null}
          {trailingSlot}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={menuButtonLabel}
                >
                  <Menu size={24} />
                </Button>
              }
            />
            <SheetContent
              side={mobileSide}
              className={cn("pt-24 pl-8", mobileSheetClassName)}
            >
              <nav className={cn("flex flex-col gap-6", mobileNavClassName)}>
                {items.map((item, index) => (
                  <SheetClose key={\`\${item.href}-mobile-\${index}\`}>
                    <Link
                      href={item.href}
                      target={item.target}
                      rel={item.rel}
                      className={cn(
                        DEFAULT_MOBILE_ITEM_CLASS,
                        mobileNavItemClassName,
                        item.mobileClassName,
                      )}
                    >
                      {item.mobileLabel ?? item.label}
                    </Link>
                  </SheetClose>
                ))}
                {callToAction ? (
                  <SheetClose>
                    <Link
                      href={callToAction.href}
                      target={callToAction.target}
                      rel={callToAction.rel}
                      className={cn(
                        DEFAULT_MOBILE_ITEM_CLASS,
                        mobileNavItemClassName,
                        callToAction.className,
                      )}
                    >
                      {callToAction.label}
                    </Link>
                  </SheetClose>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}

export const Navbar = FloatingNavbar;`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/floating-navbar",
      pnpm: "pnpm dlx shadcn@latest add @arni/floating-navbar",
      bun: "bunx --bun shadcn@latest add @arni/floating-navbar",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> Image </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "next/image"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  FloatingNavbar,</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> FloatingNavbarItem,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/floating-navbar/floating-navbar"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> navItems</span><span style="color:#F47067">:</span><span style="color:#F69D50"> FloatingNavbarItem</span><span style="color:#ADBAC7">[] </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#ADBAC7">  { href: </span><span style="color:#96D0FF">"/about"</span><span style="color:#ADBAC7">, label: </span><span style="color:#96D0FF">"About"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  { href: </span><span style="color:#96D0FF">"/services"</span><span style="color:#ADBAC7">, label: </span><span style="color:#96D0FF">"Services"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">  { href: </span><span style="color:#96D0FF">"/case-studies"</span><span style="color:#ADBAC7">, label: </span><span style="color:#96D0FF">"Case Studies"</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Logo branding variant</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">FloatingNavbar</span></span>
<span class="line"><span style="color:#6CB6FF">  items</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">navItems</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">  brand</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">    href: </span><span style="color:#96D0FF">"/"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    logo: {</span></span>
<span class="line"><span style="color:#ADBAC7">      src: </span><span style="color:#96D0FF">"/logo/ss-black.png"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">      darkSrc: </span><span style="color:#96D0FF">"/logo/ss-white.png"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">      alt: </span><span style="color:#96D0FF">"Studio logo"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">      width: </span><span style="color:#6CB6FF">140</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">      height: </span><span style="color:#6CB6FF">28</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    },</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">  leadingSlot</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">Image</span></span>
<span class="line"><span style="color:#6CB6FF">      alt</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Indian flag"</span></span>
<span class="line"><span style="color:#6CB6FF">      src</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"/logo/india.png"</span></span>
<span class="line"><span style="color:#6CB6FF">      height</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">20</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      width</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">20</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"object-cover"</span></span>
<span class="line"><span style="color:#ADBAC7">    /></span></span>
<span class="line"><span style="color:#F47067">  }</span></span>
<span class="line"><span style="color:#6CB6FF">  callToAction</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ href: </span><span style="color:#96D0FF">"/contact"</span><span style="color:#ADBAC7">, label: </span><span style="color:#96D0FF">"Contact Us"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">/>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Text branding variant</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">FloatingNavbar</span></span>
<span class="line"><span style="color:#6CB6FF">  items</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">navItems</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">  brand</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">    href: </span><span style="color:#96D0FF">"/"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    text: </span><span style="color:#96D0FF">"Acme Studio"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">  callToAction</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ href: </span><span style="color:#96D0FF">"/contact"</span><span style="color:#ADBAC7">, label: </span><span style="color:#96D0FF">"Book a Call"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">/>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { ArrowRight, Menu } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "lucide-react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { motion } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "motion/react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> Image </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "next/image"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> Link </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "next/link"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> HTMLAttributeAnchorTarget,</span></span>
<span class="line"><span style="color:#F47067">  type</span><span style="color:#ADBAC7"> ReactNode,</span></span>
<span class="line"><span style="color:#ADBAC7">  useEffect,</span></span>
<span class="line"><span style="color:#ADBAC7">  useState,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { Button } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/components/ui/button"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  Sheet,</span></span>
<span class="line"><span style="color:#ADBAC7">  SheetClose,</span></span>
<span class="line"><span style="color:#ADBAC7">  SheetContent,</span></span>
<span class="line"><span style="color:#ADBAC7">  SheetTrigger,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/components/ui/sheet"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { cn } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/lib/utils"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> FloatingNavbarItem</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  href</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  label</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileLabel</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  target</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> HTMLAttributeAnchorTarget</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  rel</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> FloatingNavbarBrandLogoConfig</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  src</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  alt</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  darkSrc</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  width</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  height</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  priority</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> FloatingNavbarBrand</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  href</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  logo</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> FloatingNavbarBrandLogoConfig</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  text</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  content</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  textClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> FloatingNavbarCallToAction</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  href</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  label</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  icon</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  target</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> HTMLAttributeAnchorTarget</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  rel</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> FloatingNavbarProps</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  items</span><span style="color:#F47067">:</span><span style="color:#F69D50"> FloatingNavbarItem</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#F69D50">  brand</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> FloatingNavbarBrand</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  callToAction</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> FloatingNavbarCallToAction</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  leadingSlot</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  trailingSlot</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  contentClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  navClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  navItemClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileSheetClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileNavClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileNavItemClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  mobileSide</span><span style="color:#F47067">?:</span><span style="color:#96D0FF"> "top"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "right"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "bottom"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "left"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  menuButtonLabel</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DEFAULT_NAV_CLASS</span><span style="color:#F47067"> =</span></span>
<span class="line"><span style="color:#96D0FF">  "hidden md:flex items-center gap-8 text-sm font-medium"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DEFAULT_NAV_ITEM_CLASS</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "hover:text-primary transition-colors"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DEFAULT_CTA_CLASS</span><span style="color:#F47067"> =</span></span>
<span class="line"><span style="color:#96D0FF">  "hidden md:flex group items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-all"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> DEFAULT_MOBILE_ITEM_CLASS</span><span style="color:#F47067"> =</span></span>
<span class="line"><span style="color:#96D0FF">  "text-2xl font-medium hover:text-primary transition-colors"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> FloatingNavbarBrandLogo</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  src</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  darkSrc</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  alt</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  width</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 140</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  height</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 28</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  priority</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> FloatingNavbarBrandLogoConfig</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">darkSrc) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Image</span></span>
<span class="line"><span style="color:#6CB6FF">        src</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">src</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        alt</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">alt</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        width</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">width</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        height</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">height</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        priority</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">priority</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"object-contain"</span><span style="color:#ADBAC7">, className)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">    );</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Image</span></span>
<span class="line"><span style="color:#6CB6FF">        src</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">src</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        alt</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">alt</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        width</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">width</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        height</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">height</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        priority</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">priority</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"object-contain dark:hidden"</span><span style="color:#ADBAC7">, className)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Image</span></span>
<span class="line"><span style="color:#6CB6FF">        src</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">darkSrc</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        alt</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">alt</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        width</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">width</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        height</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">height</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        priority</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">priority</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"hidden object-contain dark:block"</span><span style="color:#ADBAC7">, className)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> FloatingNavbarBrandText</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"text-base font-semibold"</span><span style="color:#ADBAC7">, className)</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> FloatingNavbar</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  items</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  brand</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  callToAction</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  leadingSlot</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  trailingSlot</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  contentClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  navClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  navItemClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  mobileSheetClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  mobileNavClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  mobileNavItemClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  mobileSide</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "right"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  menuButtonLabel</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "Open menu"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> FloatingNavbarProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">scrolled</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setScrolled</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">false</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#DCBDFB"> handleScroll</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#DCBDFB">      setScrolled</span><span style="color:#ADBAC7">(window.scrollY </span><span style="color:#F47067">></span><span style="color:#6CB6FF"> 50</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    window.</span><span style="color:#DCBDFB">addEventListener</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"scroll"</span><span style="color:#ADBAC7">, handleScroll);</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> window.</span><span style="color:#DCBDFB">removeEventListener</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"scroll"</span><span style="color:#ADBAC7">, handleScroll);</span></span>
<span class="line"><span style="color:#ADBAC7">  }, []);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">motion.nav</span></span>
<span class="line"><span style="color:#6CB6FF">      initial</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ maxWidth: </span><span style="color:#96D0FF">"90%"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      animate</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">        maxWidth: scrolled </span><span style="color:#F47067">?</span><span style="color:#96D0FF"> "100%"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "90%"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        top: scrolled </span><span style="color:#F47067">?</span><span style="color:#96D0FF"> "8px"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "28px"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      transition</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ duration: </span><span style="color:#6CB6FF">0.3</span><span style="color:#ADBAC7">, ease: </span><span style="color:#96D0FF">"easeInOut"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">        "fixed left-4 right-4 z-50 mx-auto rounded-xl border border-border/40 bg-background/80 backdrop-blur-md md:top-6 md:right-6 md:left-6"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        className,</span></span>
<span class="line"><span style="color:#ADBAC7">      )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "mx-auto flex items-center justify-between px-4 py-3"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          contentClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">          href</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">brand?.href </span><span style="color:#F47067">??</span><span style="color:#96D0FF"> "/"</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">            "flex items-center gap-2 font-bold tracking-tight"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">            brand?.className,</span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        ></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">brand?.content </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">            brand.content</span></span>
<span class="line"><span style="color:#ADBAC7">          ) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;></span></span>
<span class="line"><span style="color:#F47067">              {</span><span style="color:#ADBAC7">brand?.logo </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">FloatingNavbarBrandLogo</span><span style="color:#F47067"> {...</span><span style="color:#ADBAC7">brand.logo</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /> </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">              {</span><span style="color:#ADBAC7">brand?.text </span><span style="color:#F47067">||</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">brand?.logo </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">FloatingNavbarBrandText</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">brand?.textClassName</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">                  {</span><span style="color:#ADBAC7">brand?.text </span><span style="color:#F47067">??</span><span style="color:#96D0FF"> "Brand"</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">FloatingNavbarBrandText</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">              ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;/></span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">nav</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">DEFAULT_NAV_CLASS</span><span style="color:#ADBAC7">, navClassName)</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">items.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">item</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">              key</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">item</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">href</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              href</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.href</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              target</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.target</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              rel</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.rel</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#6CB6FF">                DEFAULT_NAV_ITEM_CLASS</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                navItemClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">                item.className,</span></span>
<span class="line"><span style="color:#ADBAC7">              )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            ></span></span>
<span class="line"><span style="color:#F47067">              {</span><span style="color:#ADBAC7">item.label</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">nav</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center gap-4"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">leadingSlot</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">callToAction </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">              href</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.href</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              target</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.target</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              rel</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.rel</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">DEFAULT_CTA_CLASS</span><span style="color:#ADBAC7">, callToAction.className)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            ></span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">callToAction.label</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">              {</span><span style="color:#ADBAC7">callToAction.icon </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">ArrowRight</span></span>
<span class="line"><span style="color:#6CB6FF">                  className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"transition-transform group-hover:translate-x-1"</span></span>
<span class="line"><span style="color:#6CB6FF">                  size</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">16</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                /></span></span>
<span class="line"><span style="color:#ADBAC7">              )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">trailingSlot</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">Sheet</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">SheetTrigger</span></span>
<span class="line"><span style="color:#6CB6FF">              render</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">Button</span></span>
<span class="line"><span style="color:#6CB6FF">                  variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"ghost"</span></span>
<span class="line"><span style="color:#6CB6FF">                  size</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"icon"</span></span>
<span class="line"><span style="color:#6CB6FF">                  className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"md:hidden"</span></span>
<span class="line"><span style="color:#6CB6FF">                  aria-label</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">menuButtonLabel</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                ></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">Menu</span><span style="color:#6CB6FF"> size</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">24</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;/</span><span style="color:#8DDB8C">Button</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">              }</span></span>
<span class="line"><span style="color:#ADBAC7">            /></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">SheetContent</span></span>
<span class="line"><span style="color:#6CB6FF">              side</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">mobileSide</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"pt-24 pl-8"</span><span style="color:#ADBAC7">, mobileSheetClassName)</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">            ></span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">nav</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"flex flex-col gap-6"</span><span style="color:#ADBAC7">, mobileNavClassName)</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">                {</span><span style="color:#ADBAC7">items.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">item</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">SheetClose</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">item</span><span style="color:#96D0FF">.</span><span style="color:#ADBAC7">href</span><span style="color:#96D0FF">}-mobile-\${</span><span style="color:#ADBAC7">index</span><span style="color:#96D0FF">}\`</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">                      href</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.href</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      target</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.target</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      rel</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">item.rel</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#6CB6FF">                        DEFAULT_MOBILE_ITEM_CLASS</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                        mobileNavItemClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">                        item.mobileClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">                      )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                    ></span></span>
<span class="line"><span style="color:#F47067">                      {</span><span style="color:#ADBAC7">item.mobileLabel </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> item.label</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;/</span><span style="color:#8DDB8C">SheetClose</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">                {</span><span style="color:#ADBAC7">callToAction </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;</span><span style="color:#8DDB8C">SheetClose</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">                      href</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.href</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      target</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.target</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      rel</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">callToAction.rel</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                      className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#6CB6FF">                        DEFAULT_MOBILE_ITEM_CLASS</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                        mobileNavItemClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">                        callToAction.className,</span></span>
<span class="line"><span style="color:#ADBAC7">                      )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                    ></span></span>
<span class="line"><span style="color:#F47067">                      {</span><span style="color:#ADBAC7">callToAction.label</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">                    &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                  &#x3C;/</span><span style="color:#8DDB8C">SheetClose</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">                ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;/</span><span style="color:#8DDB8C">nav</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;/</span><span style="color:#8DDB8C">SheetContent</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">Sheet</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">motion.nav</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#6CB6FF"> Navbar</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> FloatingNavbar;</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/floating-navbar</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/floating-navbar</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/floating-navbar</span></span></code></pre>`,
      },
    },
    usage: `import Image from "next/image";
import {
  FloatingNavbar,
  type FloatingNavbarItem,
} from "@/registry/base-vega/floating-navbar/floating-navbar";

const navItems: FloatingNavbarItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
];

// Logo branding variant
<FloatingNavbar
  items={navItems}
  brand={{
    href: "/",
    logo: {
      src: "/logo/ss-black.png",
      darkSrc: "/logo/ss-white.png",
      alt: "Studio logo",
      width: 140,
      height: 28,
    },
  }}
  leadingSlot={
    <Image
      alt="Indian flag"
      src="/logo/india.png"
      height={20}
      width={20}
      className="object-cover"
    />
  }
  callToAction={{ href: "/contact", label: "Contact Us" }}
/>;

// Text branding variant
<FloatingNavbar
  items={navItems}
  brand={{
    href: "/",
    text: "Acme Studio",
  }}
  callToAction={{ href: "/contact", label: "Book a Call" }}
/>;`,
    props: [
      {
        name: "items",
        type: "FloatingNavbarItem[]",
        description:
          "Array of link objects used to render desktop and mobile navigation",
      },
      {
        name: "brand",
        type: "FloatingNavbarBrand",
        description:
          "Brand configuration supporting logo, text, or custom brand content",
      },
      {
        name: "callToAction",
        type: "FloatingNavbarCallToAction",
        description: "Optional desktop CTA button and matching mobile CTA link",
      },
      {
        name: "leadingSlot",
        type: "React.ReactNode",
        description: "Optional node rendered before the CTA area",
      },
      {
        name: "trailingSlot",
        type: "React.ReactNode",
        description: "Optional node rendered after the CTA area",
      },
    ],
    subComponents: [
      {
        name: "FloatingNavbarBrandLogo",
        description: "Renders brand logo with optional dark mode source",
        props: [
          {
            name: "src",
            type: "string",
            description: "Primary logo source",
          },
          {
            name: "darkSrc",
            type: "string",
            description: "Optional dark mode logo source",
          },
          {
            name: "alt",
            type: "string",
            description: "Accessible logo description",
          },
        ],
      },
      {
        name: "FloatingNavbarBrandText",
        description: "Renders brand text when no logo is used",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Brand copy rendered in the navbar",
          },
        ],
      },
    ],
  },
  {
    slug: "hero-background",
    name: "Hero Background",
    description:
      "An animated glow-and-stars backdrop you can drop into any relative container to build cinematic landing sections.",
    categories: ["background", "marketing"],
    sourcePath: "registry/base-vega/hero-background/hero-background.tsx",
    sourceCode: `"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type HeroBackgroundProps = {
  glowColor?: string;
  glowOpacity?: number;
  starOpacity?: number;
  starSize?: number;
  motionSpeed?: number;
  animated?: boolean;
  className?: string;
};

const glowLayers = [
  {
    size: "h-[70vh] w-[108vw] sm:h-[74vh]",
    duration: 18,
    delay: 0,
    x: ["-18%", "-6%", "-12%"],
    y: ["18%", "-14%", "6%"],
    scale: [1, 1.14, 1.02],
  },
  {
    size: "h-[66vh] w-[92vw] sm:h-[70vh]",
    duration: 22,
    delay: 1.4,
    x: ["12%", "26%", "16%"],
    y: ["14%", "-20%", "2%"],
    scale: [0.94, 1.2, 1],
  },
  {
    size: "h-[58vh] w-[78vw] sm:h-[62vh]",
    duration: 26,
    delay: 2.8,
    x: ["-2%", "10%", "0%"],
    y: ["20%", "-8%", "10%"],
    scale: [0.9, 1.08, 0.96],
  },
];

function withAlpha(color: string, alpha: number) {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    let hex = normalized.slice(1);

    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((value) => value + value)
        .join("");
    }

    if (hex.length === 6 || hex.length === 8) {
      const red = Number.parseInt(hex.slice(0, 2), 16);
      const green = Number.parseInt(hex.slice(2, 4), 16);
      const blue = Number.parseInt(hex.slice(4, 6), 16);

      return \`rgba(\${red}, \${green}, \${blue}, \${alpha})\`;
    }
  }

  return \`color-mix(in srgb, \${normalized} \${alpha * 100}%, transparent)\`;
}

export function HeroBackground({
  glowColor = "#2563eb",
  glowOpacity = 0.72,
  starOpacity = 0.08,
  starSize = 22,
  motionSpeed = 1,
  animated = true,
  className,
}: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;
  const clampedMotionSpeed = Math.max(motionSpeed, 0.15);
  const primaryGlow = withAlpha(glowColor, glowOpacity);
  const secondaryGlow = withAlpha(glowColor, Math.max(glowOpacity * 0.7, 0.18));
  const haloGlow = withAlpha(glowColor, Math.max(glowOpacity * 0.48, 0.12));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#030712_0%,#060b1f_56%,#020308_100%)]" />

      <div className="absolute inset-x-[-12%] bottom-[14%] top-[-10%] mix-blend-screen">
        {glowLayers.map((layer, index) => (
          <motion.div
            key={layer.duration}
            animate={
              shouldAnimate
                ? {
                    x: layer.x,
                    y: layer.y,
                    scale: layer.scale,
                    opacity: [0.16, 0.38, 0.2],
                  }
                : {
                    x: layer.x[1],
                    y: layer.y[1],
                    scale: 1,
                    opacity: 0.24,
                  }
            }
            transition={
              shouldAnimate
                ? {
                    duration: layer.duration / clampedMotionSpeed,
                    delay: layer.delay / clampedMotionSpeed,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: [0.23, 1, 0.32, 1],
                  }
                : { duration: 0.2 }
            }
            className={cn(
              "absolute left-1/2 top-1/2 rounded-full blur-3xl will-change-transform",
              layer.size,
            )}
            style={{
              translateX: "-50%",
              translateY: "-50%",
              background:
                index === 1
                  ? \`radial-gradient(circle at 50% 100%, \${primaryGlow} 0%, transparent 72%)\`
                  : \`radial-gradient(circle at 50% 100%, \${secondaryGlow} 0%, transparent 74%)\`,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={
          shouldAnimate
            ? {
                opacity: [0.45, 0.78, 0.52],
                scale: [0.96, 1.04, 0.98],
              }
            : { opacity: 0.58, scale: 1 }
        }
        transition={
          shouldAnimate
            ? {
                duration: 9 / clampedMotionSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: [0.23, 1, 0.32, 1],
              }
            : { duration: 0.2 }
        }
        className="absolute inset-x-[8%] bottom-[-12%] h-[44%] rounded-full blur-[90px] sm:inset-x-[16%] sm:h-[48%] sm:blur-[120px]"
        style={{
          background: \`radial-gradient(circle at 50% 100%, \${haloGlow} 0%, transparent 64%)\`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[28svh] bg-gradient-to-t from-[#020308] via-[#020308]/72 to-transparent" />

      <div
        className="absolute inset-0"
        style={{
          opacity: starOpacity,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: \`\${starSize}px \${starSize}px\`,
        }}
      />
    </div>
  );
}`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/hero-background",
      pnpm: "pnpm dlx shadcn@latest add @arni/hero-background",
      bun: "bunx --bun shadcn@latest add @arni/hero-background",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> Link </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "next/link"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { HeroBackground } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/hero-background/hero-background"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">section</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"relative isolate overflow-hidden rounded-[2rem] bg-[#020308] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">HeroBackground</span></span>
<span class="line"><span style="color:#6CB6FF">    glowColor</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"#38bdf8"</span></span>
<span class="line"><span style="color:#6CB6FF">    glowOpacity</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">0.8</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">    starOpacity</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">0.1</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">    starSize</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">20</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">  /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"relative z-10 mx-auto flex min-h-[36rem] max-w-5xl flex-col items-center justify-center text-center"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/72 backdrop-blur-md"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      Built with HeroBackground</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"mt-8 space-y-5"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">h1</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        Use the background to build your own hero composition.</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">h1</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">p</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"mx-auto max-w-2xl text-balance text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        The component only owns the animated glow and star field. The layout,</span></span>
<span class="line"><span style="color:#ADBAC7">        copy, calls to action, and any foreground media stay entirely up to you.</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">p</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"mt-8 flex flex-col gap-3 sm:flex-row"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">        href</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"/signup"</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950"</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#ADBAC7">        Start building</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Link</span></span>
<span class="line"><span style="color:#6CB6FF">        href</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"/docs"</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-medium text-white"</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#ADBAC7">        Explore docs</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">Link</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">section</span><span style="color:#ADBAC7">>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { motion, useReducedMotion } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "motion/react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { cn } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/lib/utils"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> HeroBackgroundProps</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  glowColor</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  glowOpacity</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  starOpacity</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  starSize</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  motionSpeed</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  animated</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> glowLayers</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> [</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    size: </span><span style="color:#96D0FF">"h-[70vh] w-[108vw] sm:h-[74vh]"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    duration: </span><span style="color:#6CB6FF">18</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    delay: </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    x: [</span><span style="color:#96D0FF">"-18%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"-6%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"-12%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    y: [</span><span style="color:#96D0FF">"18%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"-14%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"6%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    scale: [</span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1.14</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1.02</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    size: </span><span style="color:#96D0FF">"h-[66vh] w-[92vw] sm:h-[70vh]"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    duration: </span><span style="color:#6CB6FF">22</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    delay: </span><span style="color:#6CB6FF">1.4</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    x: [</span><span style="color:#96D0FF">"12%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"26%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"16%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    y: [</span><span style="color:#96D0FF">"14%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"-20%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"2%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    scale: [</span><span style="color:#6CB6FF">0.94</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1.2</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">  {</span></span>
<span class="line"><span style="color:#ADBAC7">    size: </span><span style="color:#96D0FF">"h-[58vh] w-[78vw] sm:h-[62vh]"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    duration: </span><span style="color:#6CB6FF">26</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    delay: </span><span style="color:#6CB6FF">2.8</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    x: [</span><span style="color:#96D0FF">"-2%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"10%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"0%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    y: [</span><span style="color:#96D0FF">"20%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"-8%"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"10%"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">    scale: [</span><span style="color:#6CB6FF">0.9</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1.08</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.96</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">  },</span></span>
<span class="line"><span style="color:#ADBAC7">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> withAlpha</span><span style="color:#ADBAC7">(</span><span style="color:#F69D50">color</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">alpha</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> normalized</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> color.</span><span style="color:#DCBDFB">trim</span><span style="color:#ADBAC7">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (normalized.</span><span style="color:#DCBDFB">startsWith</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"#"</span><span style="color:#ADBAC7">)) {</span></span>
<span class="line"><span style="color:#F47067">    let</span><span style="color:#ADBAC7"> hex </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> normalized.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (hex.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 3</span><span style="color:#F47067"> ||</span><span style="color:#ADBAC7"> hex.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 4</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#ADBAC7">      hex </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> hex</span></span>
<span class="line"><span style="color:#ADBAC7">        .</span><span style="color:#DCBDFB">split</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">""</span><span style="color:#ADBAC7">)</span></span>
<span class="line"><span style="color:#ADBAC7">        .</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">value</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> value </span><span style="color:#F47067">+</span><span style="color:#ADBAC7"> value)</span></span>
<span class="line"><span style="color:#ADBAC7">        .</span><span style="color:#DCBDFB">join</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">""</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (hex.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 6</span><span style="color:#F47067"> ||</span><span style="color:#ADBAC7"> hex.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 8</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> red</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Number.</span><span style="color:#DCBDFB">parseInt</span><span style="color:#ADBAC7">(hex.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">2</span><span style="color:#ADBAC7">), </span><span style="color:#6CB6FF">16</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> green</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Number.</span><span style="color:#DCBDFB">parseInt</span><span style="color:#ADBAC7">(hex.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">2</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">4</span><span style="color:#ADBAC7">), </span><span style="color:#6CB6FF">16</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> blue</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Number.</span><span style="color:#DCBDFB">parseInt</span><span style="color:#ADBAC7">(hex.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">4</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">6</span><span style="color:#ADBAC7">), </span><span style="color:#6CB6FF">16</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#96D0FF"> \`rgba(\${</span><span style="color:#ADBAC7">red</span><span style="color:#96D0FF">}, \${</span><span style="color:#ADBAC7">green</span><span style="color:#96D0FF">}, \${</span><span style="color:#ADBAC7">blue</span><span style="color:#96D0FF">}, \${</span><span style="color:#ADBAC7">alpha</span><span style="color:#96D0FF">})\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#96D0FF"> \`color-mix(in srgb, \${</span><span style="color:#ADBAC7">normalized</span><span style="color:#96D0FF">} \${</span><span style="color:#ADBAC7">alpha</span><span style="color:#F47067"> *</span><span style="color:#6CB6FF"> 100</span><span style="color:#96D0FF">}%, transparent)\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> HeroBackground</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  glowColor</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "#2563eb"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  glowOpacity</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 0.72</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  starOpacity</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 0.08</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  starSize</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 22</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  motionSpeed</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  animated</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> true</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> HeroBackgroundProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> shouldReduceMotion</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useReducedMotion</span><span style="color:#ADBAC7">();</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> shouldAnimate</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> animated </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">shouldReduceMotion;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> clampedMotionSpeed</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> Math.</span><span style="color:#DCBDFB">max</span><span style="color:#ADBAC7">(motionSpeed, </span><span style="color:#6CB6FF">0.15</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> primaryGlow</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> withAlpha</span><span style="color:#ADBAC7">(glowColor, glowOpacity);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> secondaryGlow</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> withAlpha</span><span style="color:#ADBAC7">(glowColor, Math.</span><span style="color:#DCBDFB">max</span><span style="color:#ADBAC7">(glowOpacity </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> 0.7</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.18</span><span style="color:#ADBAC7">));</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> haloGlow</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> withAlpha</span><span style="color:#ADBAC7">(glowColor, Math.</span><span style="color:#DCBDFB">max</span><span style="color:#ADBAC7">(glowOpacity </span><span style="color:#F47067">*</span><span style="color:#6CB6FF"> 0.48</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.12</span><span style="color:#ADBAC7">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">      aria-hidden</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"true"</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">        "pointer-events-none absolute inset-0 overflow-hidden"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        className,</span></span>
<span class="line"><span style="color:#ADBAC7">      )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#030712_0%,#060b1f_56%,#020308_100%)]"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"absolute inset-x-[-12%] bottom-[14%] top-[-10%] mix-blend-screen"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">glowLayers.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">layer</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">index</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">motion.div</span></span>
<span class="line"><span style="color:#6CB6FF">            key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">layer.duration</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            animate</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">              shouldAnimate</span></span>
<span class="line"><span style="color:#F47067">                ?</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">                    x: layer.x,</span></span>
<span class="line"><span style="color:#ADBAC7">                    y: layer.y,</span></span>
<span class="line"><span style="color:#ADBAC7">                    scale: layer.scale,</span></span>
<span class="line"><span style="color:#ADBAC7">                    opacity: [</span><span style="color:#6CB6FF">0.16</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.38</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.2</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span></span>
<span class="line"><span style="color:#F47067">                :</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">                    x: layer.x[</span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">                    y: layer.y[</span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">                    scale: </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                    opacity: </span><span style="color:#6CB6FF">0.24</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span></span>
<span class="line"><span style="color:#F47067">            }</span></span>
<span class="line"><span style="color:#6CB6FF">            transition</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">              shouldAnimate</span></span>
<span class="line"><span style="color:#F47067">                ?</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">                    duration: layer.duration </span><span style="color:#F47067">/</span><span style="color:#ADBAC7"> clampedMotionSpeed,</span></span>
<span class="line"><span style="color:#ADBAC7">                    delay: layer.delay </span><span style="color:#F47067">/</span><span style="color:#ADBAC7"> clampedMotionSpeed,</span></span>
<span class="line"><span style="color:#ADBAC7">                    repeat: Number.POSITIVE_INFINITY,</span></span>
<span class="line"><span style="color:#ADBAC7">                    repeatType: </span><span style="color:#96D0FF">"mirror"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                    ease: [</span><span style="color:#6CB6FF">0.23</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.32</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span></span>
<span class="line"><span style="color:#F47067">                :</span><span style="color:#ADBAC7"> { duration: </span><span style="color:#6CB6FF">0.2</span><span style="color:#ADBAC7"> }</span></span>
<span class="line"><span style="color:#F47067">            }</span></span>
<span class="line"><span style="color:#6CB6FF">            className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">              "absolute left-1/2 top-1/2 rounded-full blur-3xl will-change-transform"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              layer.size,</span></span>
<span class="line"><span style="color:#ADBAC7">            )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">              translateX: </span><span style="color:#96D0FF">"-50%"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              translateY: </span><span style="color:#96D0FF">"-50%"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">              background:</span></span>
<span class="line"><span style="color:#ADBAC7">                index </span><span style="color:#F47067">===</span><span style="color:#6CB6FF"> 1</span></span>
<span class="line"><span style="color:#F47067">                  ?</span><span style="color:#96D0FF"> \`radial-gradient(circle at 50% 100%, \${</span><span style="color:#ADBAC7">primaryGlow</span><span style="color:#96D0FF">} 0%, transparent 72%)\`</span></span>
<span class="line"><span style="color:#F47067">                  :</span><span style="color:#96D0FF"> \`radial-gradient(circle at 50% 100%, \${</span><span style="color:#ADBAC7">secondaryGlow</span><span style="color:#96D0FF">} 0%, transparent 74%)\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">            }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          /></span></span>
<span class="line"><span style="color:#ADBAC7">        ))</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">motion.div</span></span>
<span class="line"><span style="color:#6CB6FF">        animate</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">          shouldAnimate</span></span>
<span class="line"><span style="color:#F47067">            ?</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">                opacity: [</span><span style="color:#6CB6FF">0.45</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.78</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.52</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">                scale: [</span><span style="color:#6CB6FF">0.96</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1.04</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.98</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">              }</span></span>
<span class="line"><span style="color:#F47067">            :</span><span style="color:#ADBAC7"> { opacity: </span><span style="color:#6CB6FF">0.58</span><span style="color:#ADBAC7">, scale: </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7"> }</span></span>
<span class="line"><span style="color:#F47067">        }</span></span>
<span class="line"><span style="color:#6CB6FF">        transition</span><span style="color:#F47067">={</span></span>
<span class="line"><span style="color:#ADBAC7">          shouldAnimate</span></span>
<span class="line"><span style="color:#F47067">            ?</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">                duration: </span><span style="color:#6CB6FF">9</span><span style="color:#F47067"> /</span><span style="color:#ADBAC7"> clampedMotionSpeed,</span></span>
<span class="line"><span style="color:#ADBAC7">                repeat: Number.POSITIVE_INFINITY,</span></span>
<span class="line"><span style="color:#ADBAC7">                repeatType: </span><span style="color:#96D0FF">"mirror"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                ease: [</span><span style="color:#6CB6FF">0.23</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0.32</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">              }</span></span>
<span class="line"><span style="color:#F47067">            :</span><span style="color:#ADBAC7"> { duration: </span><span style="color:#6CB6FF">0.2</span><span style="color:#ADBAC7"> }</span></span>
<span class="line"><span style="color:#F47067">        }</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"absolute inset-x-[8%] bottom-[-12%] h-[44%] rounded-full blur-[90px] sm:inset-x-[16%] sm:h-[48%] sm:blur-[120px]"</span></span>
<span class="line"><span style="color:#6CB6FF">        style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">          background: </span><span style="color:#96D0FF">\`radial-gradient(circle at 50% 100%, \${</span><span style="color:#ADBAC7">haloGlow</span><span style="color:#96D0FF">} 0%, transparent 64%)\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"absolute inset-x-0 bottom-0 h-[28svh] bg-gradient-to-t from-[#020308] via-[#020308]/72 to-transparent"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"absolute inset-0"</span></span>
<span class="line"><span style="color:#6CB6FF">        style</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#ADBAC7">          opacity: starOpacity,</span></span>
<span class="line"><span style="color:#ADBAC7">          backgroundImage:</span></span>
<span class="line"><span style="color:#96D0FF">            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          backgroundSize: </span><span style="color:#96D0FF">\`\${</span><span style="color:#ADBAC7">starSize</span><span style="color:#96D0FF">}px \${</span><span style="color:#ADBAC7">starSize</span><span style="color:#96D0FF">}px\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/hero-background</span></span></code></pre>`,
      },
    },
    usage: `import Link from "next/link";
import { HeroBackground } from "@/registry/base-vega/hero-background/hero-background";

<section className="relative isolate overflow-hidden rounded-[2rem] bg-[#020308] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
  <HeroBackground
    glowColor="#38bdf8"
    glowOpacity={0.8}
    starOpacity={0.1}
    starSize={20}
  />

  <div className="relative z-10 mx-auto flex min-h-[36rem] max-w-5xl flex-col items-center justify-center text-center">
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/72 backdrop-blur-md">
      Built with HeroBackground
    </div>

    <div className="mt-8 space-y-5">
      <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
        Use the background to build your own hero composition.
      </h1>
      <p className="mx-auto max-w-2xl text-balance text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
        The component only owns the animated glow and star field. The layout,
        copy, calls to action, and any foreground media stay entirely up to you.
      </p>
    </div>

    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/signup"
        className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950"
      >
        Start building
      </Link>
      <Link
        href="/docs"
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-medium text-white"
      >
        Explore docs
      </Link>
    </div>
  </div>
</section>;`,
    props: [
      {
        name: "glowColor",
        type: "string",
        default: '"#2563eb"',
        description: "Accent color used across the ambient glow layers.",
      },
      {
        name: "glowOpacity",
        type: "number",
        default: "0.72",
        description: "Controls the intensity of the moving glow bloom.",
      },
      {
        name: "starOpacity",
        type: "number",
        default: "0.08",
        description: "Sets the visibility of the dotted star field overlay.",
      },
      {
        name: "starSize",
        type: "number",
        default: "22",
        description: "Adjusts the spacing of the dot pattern used as stars.",
      },
      {
        name: "motionSpeed",
        type: "number",
        default: "1",
        description: "Speeds up or slows down the ambient glow animation.",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description:
          "Disables motion while keeping the static background visible.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Optional classes for the absolutely positioned background wrapper.",
      },
    ],
    subComponents: [],
  },
  {
    slug: "linear-card",
    name: "Linear Card",
    description:
      "A compound feature card inspired by Linear's design language. Supports image and reactive SVG content variants with a minimal, editorial layout.",
    categories: ["card", "marketing"],
    sourcePath: "registry/base-vega/linear-card/linear-card.tsx",
    sourceCode: `export const LinearCard = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => {
  return (
    <div
      className={\`
              flex flex-col items-center gap-12 w-96 px-8 py-6
              border border-neutral-900 rounded-md
              md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-none md:py-0
              \${isLast ? "md:border-r-0" : "md:border-r md:border-neutral-900"}
            \`}
    >
      {children}
    </div>
  );
};

export const LinearCardHeading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="font-medium">{children}</h3>;
};

export const LinearCardSubheading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-neutral-500 text-balance">{children}</p>;
};

export const LinearCardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col text-neutral-50 text-[12px] gap-2">
      {children}
    </div>
  );
};

export const LinearCardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="hidden md:block text-neutral-600 text-[8px] font-mono w-full">
      {children}
    </p>
  );
};

export const LinearCardSVGContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="overflow-hidden w-72 h-56">{children}</div>;
};

export const LinearCardImageContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="overflow-hidden w-72 h-56 relative">{children}</div>;
};`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/linear-card",
      pnpm: "pnpm dlx shadcn@latest add @arni/linear-card",
      bun: "bunx --bun shadcn@latest add @arni/linear-card",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> Image </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "next/image"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> CardWave </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/card-wave/card-wave"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCard,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardBody,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardHeader,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardHeading,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardImageContainer,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardSubheading,</span></span>
<span class="line"><span style="color:#ADBAC7">  LinearCardSVGContainer,</span></span>
<span class="line"><span style="color:#ADBAC7">} </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/registry/base-vega/linear-card/linear-card"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// Image variant</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">>FIG 0.1&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardImageContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">Image</span></span>
<span class="line"><span style="color:#6CB6FF">      src</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"/your-image.png"</span></span>
<span class="line"><span style="color:#6CB6FF">      alt</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Card image"</span></span>
<span class="line"><span style="color:#6CB6FF">      fill</span></span>
<span class="line"><span style="color:#6CB6FF">      sizes</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"(max-width: 768px) 100vw, 50vw"</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"cover"</span></span>
<span class="line"><span style="color:#ADBAC7">    /></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardImageContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">>Designed for speed&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      Reduces noise and restores momentum.</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390">// SVG variant</span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#6CB6FF"> isLast</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">>FIG 0.2&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeader</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardSVGContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">CardWave</span><span style="color:#6CB6FF"> cardWidth</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">140</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> defaultHoverIndex</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">5</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardSVGContainer</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">>Designed for speed&#x3C;/</span><span style="color:#8DDB8C">LinearCardHeading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      Reduces noise and restores momentum.</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">LinearCardSubheading</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  &#x3C;/</span><span style="color:#8DDB8C">LinearCardBody</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">LinearCard</span><span style="color:#ADBAC7">>;</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCard</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">  isLast </span><span style="color:#F47067">=</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  isLast</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">={</span><span style="color:#96D0FF">\`</span></span>
<span class="line"><span style="color:#96D0FF">              flex flex-col items-center gap-12 w-96 px-8 py-6</span></span>
<span class="line"><span style="color:#96D0FF">              border border-neutral-900 rounded-md</span></span>
<span class="line"><span style="color:#96D0FF">              md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-none md:py-0</span></span>
<span class="line"><span style="color:#96D0FF">              \${</span><span style="color:#ADBAC7">isLast</span><span style="color:#F47067"> ?</span><span style="color:#96D0FF"> "md:border-r-0"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "md:border-r md:border-neutral-900"}</span></span>
<span class="line"><span style="color:#96D0FF">            \`</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardHeading</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">h3</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"font-medium"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">h3</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardSubheading</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">p</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-neutral-500 text-balance"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">p</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardBody</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({ </span><span style="color:#F69D50">children</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> { </span><span style="color:#F69D50">children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7"> }) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex flex-col text-neutral-50 text-[12px] gap-2"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardHeader</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">p</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"hidden md:block text-neutral-600 text-[8px] font-mono w-full"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">p</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardSVGContainer</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"overflow-hidden w-72 h-56"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> const</span><span style="color:#DCBDFB"> LinearCardImageContainer</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> ({</span></span>
<span class="line"><span style="color:#ADBAC7">  children,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  children</span><span style="color:#F47067">:</span><span style="color:#F69D50"> React</span><span style="color:#ADBAC7">.</span><span style="color:#F69D50">ReactNode</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"overflow-hidden w-72 h-56 relative"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">children</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/linear-card</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/linear-card</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/linear-card</span></span></code></pre>`,
      },
    },
    usage: `import Image from "next/image";
import CardWave from "@/registry/base-vega/card-wave/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardImageContainer,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/registry/base-vega/linear-card/linear-card";

// Image variant
<LinearCard>
  <LinearCardHeader>FIG 0.1</LinearCardHeader>
  <LinearCardImageContainer>
    <Image
      src="/your-image.png"
      alt="Card image"
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="cover"
    />
  </LinearCardImageContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>;

// SVG variant
<LinearCard isLast>
  <LinearCardHeader>FIG 0.2</LinearCardHeader>
  <LinearCardSVGContainer>
    <CardWave cardWidth={140} defaultHoverIndex={5} />
  </LinearCardSVGContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>;`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Card content - compose with the sub-components below",
      },
      {
        name: "isLast",
        type: "boolean",
        default: "false",
        description:
          "When true, removes the right border so the last card in a row sits flush",
      },
    ],
    subComponents: [
      {
        name: "LinearCardHeader",
        description:
          "Mono micro-label displayed above the card media. Hidden on mobile",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: 'Header label text, e.g. "FIG 0.1"',
          },
        ],
      },
      {
        name: "LinearCardHeading",
        description: "Primary heading inside the card body",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Heading text",
          },
        ],
      },
      {
        name: "LinearCardSubheading",
        description: "Muted description text inside the card body",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Subheading text",
          },
        ],
      },
      {
        name: "LinearCardBody",
        description:
          "Wrapper for heading + subheading. Provides vertical flex layout and small text size",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Body content - typically heading and subheading",
          },
        ],
      },
      {
        name: "LinearCardImageContainer",
        description:
          "Fixed-size container for an image (relative positioned for next/image fill)",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "An <Image /> or <img /> element",
          },
        ],
      },
      {
        name: "LinearCardSVGContainer",
        description:
          "Fixed-size container for an SVG graphic with overflow hidden",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "An SVG element or reactive SVG component",
          },
        ],
      },
    ],
  },
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "A procedural terminal playback component with typed commands, line-by-line output reveals, optional in-view start, and macOS, Windows, and Linux window variants.",
    categories: ["code", "marketing"],
    sourcePath: "registry/base-vega/terminal/terminal.tsx",
    sourceCode: `"use client";

import { Minus, Square, TerminalIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalVariant = "mac" | "windows" | "linux";
export type TerminalWindowNameAlign = "left" | "center" | "right";
export type TerminalBackgroundVariant = "solid" | "gradient";

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  route?: string;
  windowName?: string;
  windowNameAlign?: TerminalWindowNameAlign;
  showWindowPane?: boolean;
  backgroundVariant?: TerminalBackgroundVariant;
  variant?: TerminalVariant;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  outputLineDelay?: number;
  playOnInView?: boolean;
  inViewMargin?: string;
  className?: string;
  contentClassName?: string;
}

type TerminalHistoryEntry = {
  id: string;
  kind: "command" | "output";
  text: string;
};

type TerminalPhase = "idle" | "typing" | "output" | "delay" | "done";

const PROMPT_SYMBOL: Record<TerminalVariant, string> = {
  linux: "$",
  mac: "$",
  windows: ">",
};

const WINDOW_ALIGN_CLASS: Record<TerminalWindowNameAlign, string> = {
  center: "text-center",
  left: "text-left",
  right: "text-right",
};

export function Terminal({
  commands,
  outputs = {},
  route = "~/projects/nextjs",
  windowName = "bash",
  windowNameAlign = "center",
  showWindowPane = true,
  backgroundVariant = "solid",
  variant = "mac",
  typingSpeed = 45,
  delayBetweenCommands = 1000,
  outputLineDelay = 130,
  playOnInView = false,
  inViewMargin = "0px 0px -10% 0px",
  className,
  contentClassName,
}: TerminalProps) {
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleOutputLines, setVisibleOutputLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(!playOnInView);
  const [phase, setPhase] = useState<TerminalPhase>(() => {
    if (commands.length === 0) {
      return "done";
    }

    return playOnInView ? "idle" : "typing";
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCommand = commands[currentCommandIndex] ?? "";
  const activeOutput = outputs[currentCommandIndex] ?? [];
  const typedCommand = activeCommand.slice(0, typedChars);
  const finalizedCurrentCommand = useMemo(
    () => history.some((entry) => entry.id === \`cmd-\${currentCommandIndex}\`),
    [currentCommandIndex, history],
  );

  useEffect(() => {
    if (!playOnInView || hasStarted || commands.length === 0) {
      return;
    }

    const node = rootRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasStarted(true);
        setPhase("typing");
        observer.disconnect();
      },
      { rootMargin: inViewMargin, threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [commands.length, hasStarted, inViewMargin, playOnInView]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  });

  useEffect(() => {
    if (!hasStarted || phase === "idle" || phase === "done") {
      return;
    }

    const timeout =
      phase === "typing"
        ? window.setTimeout(() => {
            if (typedChars < activeCommand.length) {
              setTypedChars((current) => current + 1);
              return;
            }

            if (activeOutput.length > 0) {
              setPhase("output");
              return;
            }

            setPhase("delay");
          }, typingSpeed)
        : phase === "output"
          ? window.setTimeout(() => {
              if (visibleOutputLines < activeOutput.length) {
                setVisibleOutputLines((current) => current + 1);
                return;
              }

              setPhase("delay");
            }, outputLineDelay)
          : window.setTimeout(() => {
              setHistory((previous) => {
                const next = [...previous];
                const commandId = \`cmd-\${currentCommandIndex}\`;

                if (!next.some((entry) => entry.id === commandId)) {
                  next.push({
                    id: commandId,
                    kind: "command",
                    text: activeCommand,
                  });
                }

                activeOutput.forEach((line, lineIndex) => {
                  const outputId = \`out-\${currentCommandIndex}-\${lineIndex}\`;

                  if (!next.some((entry) => entry.id === outputId)) {
                    next.push({
                      id: outputId,
                      kind: "output",
                      text: line,
                    });
                  }
                });

                return next;
              });

              if (currentCommandIndex >= commands.length - 1) {
                setPhase("done");
                return;
              }

              setCurrentCommandIndex((current) => current + 1);
              setTypedChars(0);
              setVisibleOutputLines(0);
              setPhase("typing");
            }, delayBetweenCommands);

    return () => window.clearTimeout(timeout);
  }, [
    activeCommand,
    activeOutput,
    commands.length,
    currentCommandIndex,
    delayBetweenCommands,
    hasStarted,
    outputLineDelay,
    phase,
    typedChars,
    typingSpeed,
    visibleOutputLines,
  ]);

  const liveOutputEntries = useMemo(() => {
    const seen = new Map<string, number>();

    return activeOutput.slice(0, visibleOutputLines).map((line) => {
      const count = (seen.get(line) ?? 0) + 1;
      seen.set(line, count);

      return {
        id: \`live-out-\${currentCommandIndex}-\${line}-\${count}\`,
        line,
      };
    });
  }, [activeOutput, currentCommandIndex, visibleOutputLines]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "w-full overflow-hidden rounded-md border border-neutral-700/70 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      {showWindowPane ? (
        <TerminalWindowPane
          variant={variant}
          windowName={windowName}
          windowNameAlign={windowNameAlign}
        />
      ) : null}

      <div
        ref={scrollContainerRef}
        className={cn(
          "h-90 overflow-y-auto p-4 font-mono text-[13px] leading-6 text-neutral-300 md:p-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-900 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-900",
          backgroundVariant === "gradient"
            ? "bg-[radial-gradient(circle_at_top,rgba(64,64,64,0.28),rgba(10,10,10,0.96)_42%)]"
            : "bg-neutral-950",
          contentClassName,
        )}
      >
        <div className="space-y-0.5">
          {history.map((entry) =>
            entry.kind === "command" ? (
              <CommandLine
                key={entry.id}
                route={route}
                promptSymbol={PROMPT_SYMBOL[variant]}
                command={entry.text}
              />
            ) : (
              <OutputLine key={entry.id} line={entry.text} />
            ),
          )}

          {hasStarted && phase !== "done" && !finalizedCurrentCommand ? (
            <CommandLine
              route={route}
              promptSymbol={PROMPT_SYMBOL[variant]}
              command={typedCommand}
              cursor
            />
          ) : null}

          {phase !== "typing" && !finalizedCurrentCommand
            ? liveOutputEntries.map((entry) => (
                <OutputLine key={entry.id} line={entry.line} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

function TerminalWindowPane({
  variant,
  windowName,
  windowNameAlign,
}: {
  variant: TerminalVariant;
  windowName: string;
  windowNameAlign: TerminalWindowNameAlign;
}) {
  if (variant === "mac") {
    return (
      <div className="flex items-center border-b border-neutral-700 bg-neutral-900 px-3 py-2.5">
        <div className="flex w-16 items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f56]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#27c93f]" />
        </div>
        <span
          className={cn(
            "grow truncate text-xs font-medium text-neutral-300",
            WINDOW_ALIGN_CLASS[windowNameAlign],
          )}
        >
          {windowName}
        </span>
        <div className="w-16" />
      </div>
    );
  }

  if (variant === "windows") {
    return (
      <div className="flex items-center border-b border-neutral-700 bg-neutral-900 pl-2">
        <div className="bg-blue-600 rounded-xs p-0.5 my-2.5">
          <TerminalIcon className="size-4" />
        </div>
        <span
          className={cn(
            "mx-3 grow truncate text-xs font-medium text-neutral-200",
            WINDOW_ALIGN_CLASS[windowNameAlign],
          )}
        >
          {windowName}
        </span>
        <div className="flex items-center text-[10px] text-neutral-300">
          <span className="grid h-10 w-12 place-items-center hover:bg-white/10">
            <Minus className="size-3" />
          </span>
          <span className="grid h-10 w-12 place-items-center hover:bg-white/10">
            <Square className="size-3" />
          </span>
          <span className="grid h-10 w-12 place-items-center hover:bg-red-600/80">
            <X className="size-4" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border-b border-neutral-700 bg-[#1f2937] px-3 py-2">
      <div className="flex w-16 items-center gap-1">
        <span className="h-2.5 w-3 rounded-sm bg-neutral-300" />
        <span className="h-2.5 w-3 rounded-sm bg-neutral-500" />
        <span className="h-2.5 w-3 rounded-sm bg-neutral-700" />
      </div>
      <span
        className={cn(
          "grow truncate text-xs font-medium text-neutral-200",
          WINDOW_ALIGN_CLASS[windowNameAlign],
        )}
      >
        {windowName}
      </span>
      <div className="w-16" />
    </div>
  );
}

function CommandLine({
  route,
  promptSymbol,
  command,
  cursor = false,
}: {
  route: string;
  promptSymbol: string;
  command: string;
  cursor?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="text-emerald-400">{route}</span>
      <span className="text-emerald-500">{promptSymbol}</span>
      <span className="break-all text-neutral-200">
        {command}
        {cursor ? (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[1.1em] w-[0.58em] translate-y-1 bg-neutral-100"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </span>
    </div>
  );
}

function OutputLine({ line }: { line: string }) {
  return <p className="whitespace-pre-wrap text-neutral-400">{line}</p>;
}`,
    installCommands: {
      npx: "npx shadcn@latest add @arni/terminal",
      pnpm: "pnpm dlx shadcn@latest add @arni/terminal",
      bun: "bunx --bun shadcn@latest add @arni/terminal",
    },
    highlighted: {
      usage: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { Terminal } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/components/ui/terminal"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> TerminalDemo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">section</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"w-full py-10 md:py-20"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">Terminal</span></span>
<span class="line"><span style="color:#6CB6FF">        commands</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[</span></span>
<span class="line"><span style="color:#96D0FF">          "npx shadcn@latest init"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">          "npm install motion"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">          "npx shadcn@latest add button card"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">          "Term Deez Nuts"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        ]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        outputs</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#6CB6FF">          0</span><span style="color:#ADBAC7">: [</span></span>
<span class="line"><span style="color:#96D0FF">            "✔ Preflight checks passed."</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">            "✔ Created components.json"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#96D0FF">            "✔ Initialized project."</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          ],</span></span>
<span class="line"><span style="color:#6CB6FF">          1</span><span style="color:#ADBAC7">: [</span><span style="color:#96D0FF">"added 1 package in 2s"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#6CB6FF">          2</span><span style="color:#ADBAC7">: [</span><span style="color:#96D0FF">"✔ Done. Installed button, card."</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        route</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"~/workspace/vega"</span></span>
<span class="line"><span style="color:#6CB6FF">        windowName</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"bash - setup"</span></span>
<span class="line"><span style="color:#6CB6FF">        variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"mac"</span></span>
<span class="line"><span style="color:#6CB6FF">        windowNameAlign</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"center"</span></span>
<span class="line"><span style="color:#6CB6FF">        backgroundVariant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"gradient"</span></span>
<span class="line"><span style="color:#6CB6FF">        playOnInView</span></span>
<span class="line"><span style="color:#6CB6FF">        typingSpeed</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">45</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        delayBetweenCommands</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">1000</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      /></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">section</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> WindowsTerminalDemo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">Terminal</span></span>
<span class="line"><span style="color:#6CB6FF">      commands</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[</span><span style="color:#96D0FF">"pnpm dev"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"pnpm build"</span><span style="color:#ADBAC7">]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      outputs</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#6CB6FF">        0</span><span style="color:#ADBAC7">: [</span><span style="color:#96D0FF">"Ready in 1.8s"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#6CB6FF">        1</span><span style="color:#ADBAC7">: [</span><span style="color:#96D0FF">"Compiled successfully"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      route</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"C:\\\\Users\\\\you\\\\project"</span></span>
<span class="line"><span style="color:#6CB6FF">      windowName</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"Windows Terminal"</span></span>
<span class="line"><span style="color:#6CB6FF">      windowNameAlign</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"left"</span></span>
<span class="line"><span style="color:#6CB6FF">      variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"windows"</span></span>
<span class="line"><span style="color:#ADBAC7">    /></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> HeaderlessTerminalDemo</span><span style="color:#ADBAC7">() {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">Terminal</span></span>
<span class="line"><span style="color:#6CB6FF">      commands</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">[</span><span style="color:#96D0FF">"docker compose up"</span><span style="color:#ADBAC7">]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      outputs</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{</span></span>
<span class="line"><span style="color:#6CB6FF">        0</span><span style="color:#ADBAC7">: [</span><span style="color:#96D0FF">"[+] Running 6/6"</span><span style="color:#ADBAC7">, </span><span style="color:#96D0FF">"api-1  | listening on :3000"</span><span style="color:#ADBAC7">],</span></span>
<span class="line"><span style="color:#ADBAC7">      }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      route</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"~/infra/local"</span></span>
<span class="line"><span style="color:#6CB6FF">      showWindowPane</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">false</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      variant</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"linux"</span></span>
<span class="line"><span style="color:#ADBAC7">    /></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>`,
      source: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#96D0FF">"use client"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { Minus, Square, TerminalIcon, X } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "lucide-react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { motion } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "motion/react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { useEffect, useMemo, useRef, useState } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "react"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">import</span><span style="color:#ADBAC7"> { cn } </span><span style="color:#F47067">from</span><span style="color:#96D0FF"> "@/lib/utils"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> TerminalVariant</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "mac"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "windows"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "linux"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> TerminalWindowNameAlign</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "left"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "center"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "right"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> type</span><span style="color:#F69D50"> TerminalBackgroundVariant</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "solid"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "gradient"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> interface</span><span style="color:#F69D50"> TerminalProps</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  commands</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">[];</span></span>
<span class="line"><span style="color:#F69D50">  outputs</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">number</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">[]>;</span></span>
<span class="line"><span style="color:#F69D50">  route</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  windowName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  windowNameAlign</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> TerminalWindowNameAlign</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  showWindowPane</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  backgroundVariant</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> TerminalBackgroundVariant</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  variant</span><span style="color:#F47067">?:</span><span style="color:#F69D50"> TerminalVariant</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  typingSpeed</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  delayBetweenCommands</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  outputLineDelay</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> number</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  playOnInView</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  inViewMargin</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  contentClassName</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> TerminalHistoryEntry</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  id</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  kind</span><span style="color:#F47067">:</span><span style="color:#96D0FF"> "command"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "output"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  text</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">type</span><span style="color:#F69D50"> TerminalPhase</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "idle"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "typing"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "output"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "delay"</span><span style="color:#F47067"> |</span><span style="color:#96D0FF"> "done"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> PROMPT_SYMBOL</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">TerminalVariant</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  linux: </span><span style="color:#96D0FF">"$"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  mac: </span><span style="color:#96D0FF">"$"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  windows: </span><span style="color:#96D0FF">">"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">const</span><span style="color:#6CB6FF"> WINDOW_ALIGN_CLASS</span><span style="color:#F47067">:</span><span style="color:#F69D50"> Record</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">TerminalWindowNameAlign</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">> </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">  center: </span><span style="color:#96D0FF">"text-center"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  left: </span><span style="color:#96D0FF">"text-left"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">  right: </span><span style="color:#96D0FF">"text-right"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">export</span><span style="color:#F47067"> function</span><span style="color:#DCBDFB"> Terminal</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  commands</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  outputs</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> {},</span></span>
<span class="line"><span style="color:#F69D50">  route</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "~/projects/nextjs"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  windowName</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "bash"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  windowNameAlign</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "center"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  showWindowPane</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> true</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  backgroundVariant</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "solid"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  variant</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "mac"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  typingSpeed</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 45</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  delayBetweenCommands</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 1000</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  outputLineDelay</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> 130</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  playOnInView</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  inViewMargin</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> "0px 0px -10% 0px"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  className</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  contentClassName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#F69D50"> TerminalProps</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">history</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setHistory</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">TerminalHistoryEntry</span><span style="color:#ADBAC7">[]>([]);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">currentCommandIndex</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setCurrentCommandIndex</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">typedChars</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setTypedChars</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">visibleOutputLines</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setVisibleOutputLines</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">hasStarted</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setHasStarted</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">(</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">playOnInView);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#ADBAC7"> [</span><span style="color:#6CB6FF">phase</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">setPhase</span><span style="color:#ADBAC7">] </span><span style="color:#F47067">=</span><span style="color:#DCBDFB"> useState</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">TerminalPhase</span><span style="color:#ADBAC7">>(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (commands.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#96D0FF"> "done"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> playOnInView </span><span style="color:#F47067">?</span><span style="color:#96D0FF"> "idle"</span><span style="color:#F47067"> :</span><span style="color:#96D0FF"> "typing"</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> rootRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLDivElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> scrollContainerRef</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useRef</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#F69D50">HTMLDivElement</span><span style="color:#ADBAC7">>(</span><span style="color:#6CB6FF">null</span><span style="color:#ADBAC7">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> activeCommand</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> commands[currentCommandIndex] </span><span style="color:#F47067">??</span><span style="color:#96D0FF"> ""</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> activeOutput</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> outputs[currentCommandIndex] </span><span style="color:#F47067">??</span><span style="color:#ADBAC7"> [];</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> typedCommand</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> activeCommand.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, typedChars);</span></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> finalizedCurrentCommand</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useMemo</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">    () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> history.</span><span style="color:#DCBDFB">some</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> entry.id </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> \`cmd-\${</span><span style="color:#ADBAC7">currentCommandIndex</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">),</span></span>
<span class="line"><span style="color:#ADBAC7">    [currentCommandIndex, history],</span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">playOnInView </span><span style="color:#F47067">||</span><span style="color:#ADBAC7"> hasStarted </span><span style="color:#F47067">||</span><span style="color:#ADBAC7"> commands.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ===</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> node</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> rootRef.current;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">node) {</span></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> observer</span><span style="color:#F47067"> =</span><span style="color:#F47067"> new</span><span style="color:#DCBDFB"> IntersectionObserver</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#ADBAC7">      ([</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">]) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">        if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">entry?.isIntersecting) {</span></span>
<span class="line"><span style="color:#F47067">          return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">        setHasStarted</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">true</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#DCBDFB">        setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"typing"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">        observer.</span><span style="color:#DCBDFB">disconnect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"><span style="color:#ADBAC7">      },</span></span>
<span class="line"><span style="color:#ADBAC7">      { rootMargin: inViewMargin, threshold: </span><span style="color:#6CB6FF">0.25</span><span style="color:#ADBAC7"> },</span></span>
<span class="line"><span style="color:#ADBAC7">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    observer.</span><span style="color:#DCBDFB">observe</span><span style="color:#ADBAC7">(node);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> observer.</span><span style="color:#DCBDFB">disconnect</span><span style="color:#ADBAC7">();</span></span>
<span class="line"><span style="color:#ADBAC7">  }, [commands.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">, hasStarted, inViewMargin, playOnInView]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> container</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> scrollContainerRef.current;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">container) {</span></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">    container.scrollTop </span><span style="color:#F47067">=</span><span style="color:#ADBAC7"> container.scrollHeight;</span></span>
<span class="line"><span style="color:#ADBAC7">  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">  useEffect</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">hasStarted </span><span style="color:#F47067">||</span><span style="color:#ADBAC7"> phase </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "idle"</span><span style="color:#F47067"> ||</span><span style="color:#ADBAC7"> phase </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "done"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> timeout</span><span style="color:#F47067"> =</span></span>
<span class="line"><span style="color:#ADBAC7">      phase </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "typing"</span></span>
<span class="line"><span style="color:#F47067">        ?</span><span style="color:#ADBAC7"> window.</span><span style="color:#DCBDFB">setTimeout</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">            if</span><span style="color:#ADBAC7"> (typedChars </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> activeCommand.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">              setTypedChars</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">current</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> current </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">              return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">            if</span><span style="color:#ADBAC7"> (activeOutput.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> ></span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">              setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"output"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">              return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">            setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"delay"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">          }, typingSpeed)</span></span>
<span class="line"><span style="color:#F47067">        :</span><span style="color:#ADBAC7"> phase </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "output"</span></span>
<span class="line"><span style="color:#F47067">          ?</span><span style="color:#ADBAC7"> window.</span><span style="color:#DCBDFB">setTimeout</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">              if</span><span style="color:#ADBAC7"> (visibleOutputLines </span><span style="color:#F47067">&#x3C;</span><span style="color:#ADBAC7"> activeOutput.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">                setVisibleOutputLines</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">current</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> current </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">                return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">              }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">              setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"delay"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">            }, outputLineDelay)</span></span>
<span class="line"><span style="color:#F47067">          :</span><span style="color:#ADBAC7"> window.</span><span style="color:#DCBDFB">setTimeout</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#DCBDFB">              setHistory</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">previous</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">                const</span><span style="color:#6CB6FF"> next</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> [</span><span style="color:#F47067">...</span><span style="color:#ADBAC7">previous];</span></span>
<span class="line"><span style="color:#F47067">                const</span><span style="color:#6CB6FF"> commandId</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> \`cmd-\${</span><span style="color:#ADBAC7">currentCommandIndex</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">                if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">next.</span><span style="color:#DCBDFB">some</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> entry.id </span><span style="color:#F47067">===</span><span style="color:#ADBAC7"> commandId)) {</span></span>
<span class="line"><span style="color:#ADBAC7">                  next.</span><span style="color:#DCBDFB">push</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#ADBAC7">                    id: commandId,</span></span>
<span class="line"><span style="color:#ADBAC7">                    kind: </span><span style="color:#96D0FF">"command"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                    text: activeCommand,</span></span>
<span class="line"><span style="color:#ADBAC7">                  });</span></span>
<span class="line"><span style="color:#ADBAC7">                }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">                activeOutput.</span><span style="color:#DCBDFB">forEach</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">line</span><span style="color:#ADBAC7">, </span><span style="color:#F69D50">lineIndex</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">                  const</span><span style="color:#6CB6FF"> outputId</span><span style="color:#F47067"> =</span><span style="color:#96D0FF"> \`out-\${</span><span style="color:#ADBAC7">currentCommandIndex</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">lineIndex</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">                  if</span><span style="color:#ADBAC7"> (</span><span style="color:#F47067">!</span><span style="color:#ADBAC7">next.</span><span style="color:#DCBDFB">some</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> entry.id </span><span style="color:#F47067">===</span><span style="color:#ADBAC7"> outputId)) {</span></span>
<span class="line"><span style="color:#ADBAC7">                    next.</span><span style="color:#DCBDFB">push</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#ADBAC7">                      id: outputId,</span></span>
<span class="line"><span style="color:#ADBAC7">                      kind: </span><span style="color:#96D0FF">"output"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">                      text: line,</span></span>
<span class="line"><span style="color:#ADBAC7">                    });</span></span>
<span class="line"><span style="color:#ADBAC7">                  }</span></span>
<span class="line"><span style="color:#ADBAC7">                });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">                return</span><span style="color:#ADBAC7"> next;</span></span>
<span class="line"><span style="color:#ADBAC7">              });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">              if</span><span style="color:#ADBAC7"> (currentCommandIndex </span><span style="color:#F47067">>=</span><span style="color:#ADBAC7"> commands.</span><span style="color:#6CB6FF">length</span><span style="color:#F47067"> -</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#DCBDFB">                setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"done"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#F47067">                return</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">              }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB">              setCurrentCommandIndex</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">current</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> current </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#DCBDFB">              setTypedChars</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#DCBDFB">              setVisibleOutputLines</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#DCBDFB">              setPhase</span><span style="color:#ADBAC7">(</span><span style="color:#96D0FF">"typing"</span><span style="color:#ADBAC7">);</span></span>
<span class="line"><span style="color:#ADBAC7">            }, delayBetweenCommands);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> () </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> window.</span><span style="color:#DCBDFB">clearTimeout</span><span style="color:#ADBAC7">(timeout);</span></span>
<span class="line"><span style="color:#ADBAC7">  }, [</span></span>
<span class="line"><span style="color:#ADBAC7">    activeCommand,</span></span>
<span class="line"><span style="color:#ADBAC7">    activeOutput,</span></span>
<span class="line"><span style="color:#ADBAC7">    commands.</span><span style="color:#6CB6FF">length</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">    currentCommandIndex,</span></span>
<span class="line"><span style="color:#ADBAC7">    delayBetweenCommands,</span></span>
<span class="line"><span style="color:#ADBAC7">    hasStarted,</span></span>
<span class="line"><span style="color:#ADBAC7">    outputLineDelay,</span></span>
<span class="line"><span style="color:#ADBAC7">    phase,</span></span>
<span class="line"><span style="color:#ADBAC7">    typedChars,</span></span>
<span class="line"><span style="color:#ADBAC7">    typingSpeed,</span></span>
<span class="line"><span style="color:#ADBAC7">    visibleOutputLines,</span></span>
<span class="line"><span style="color:#ADBAC7">  ]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  const</span><span style="color:#6CB6FF"> liveOutputEntries</span><span style="color:#F47067"> =</span><span style="color:#DCBDFB"> useMemo</span><span style="color:#ADBAC7">(() </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">    const</span><span style="color:#6CB6FF"> seen</span><span style="color:#F47067"> =</span><span style="color:#F47067"> new</span><span style="color:#DCBDFB"> Map</span><span style="color:#ADBAC7">&#x3C;</span><span style="color:#6CB6FF">string</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">number</span><span style="color:#ADBAC7">>();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> activeOutput.</span><span style="color:#DCBDFB">slice</span><span style="color:#ADBAC7">(</span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, visibleOutputLines).</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">line</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F47067">      const</span><span style="color:#6CB6FF"> count</span><span style="color:#F47067"> =</span><span style="color:#ADBAC7"> (seen.</span><span style="color:#DCBDFB">get</span><span style="color:#ADBAC7">(line) </span><span style="color:#F47067">??</span><span style="color:#6CB6FF"> 0</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">+</span><span style="color:#6CB6FF"> 1</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">      seen.</span><span style="color:#DCBDFB">set</span><span style="color:#ADBAC7">(line, count);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">      return</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#ADBAC7">        id: </span><span style="color:#96D0FF">\`live-out-\${</span><span style="color:#ADBAC7">currentCommandIndex</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">line</span><span style="color:#96D0FF">}-\${</span><span style="color:#ADBAC7">count</span><span style="color:#96D0FF">}\`</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        line,</span></span>
<span class="line"><span style="color:#ADBAC7">      };</span></span>
<span class="line"><span style="color:#ADBAC7">    });</span></span>
<span class="line"><span style="color:#ADBAC7">  }, [activeOutput, currentCommandIndex, visibleOutputLines]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">      ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">rootRef</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">      className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">        "w-full overflow-hidden rounded-md border border-neutral-700/70 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">        className,</span></span>
<span class="line"><span style="color:#ADBAC7">      )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">    ></span></span>
<span class="line"><span style="color:#F47067">      {</span><span style="color:#ADBAC7">showWindowPane </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">TerminalWindowPane</span></span>
<span class="line"><span style="color:#6CB6FF">          variant</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">variant</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          windowName</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">windowName</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">          windowNameAlign</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">windowNameAlign</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        /></span></span>
<span class="line"><span style="color:#ADBAC7">      ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span></span>
<span class="line"><span style="color:#6CB6FF">        ref</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">scrollContainerRef</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "h-90 overflow-y-auto p-4 font-mono text-[13px] leading-6 text-neutral-300 md:p-5 [&#x26;::-webkit-scrollbar]:w-1 [&#x26;::-webkit-scrollbar-track]:bg-transparent [&#x26;::-webkit-scrollbar-thumb]:bg-neutral-900 dark:[&#x26;::-webkit-scrollbar-track]:bg-transparent dark:[&#x26;::-webkit-scrollbar-thumb]:bg-neutral-900"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          backgroundVariant </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "gradient"</span></span>
<span class="line"><span style="color:#F47067">            ?</span><span style="color:#96D0FF"> "bg-[radial-gradient(circle_at_top,rgba(64,64,64,0.28),rgba(10,10,10,0.96)_42%)]"</span></span>
<span class="line"><span style="color:#F47067">            :</span><span style="color:#96D0FF"> "bg-neutral-950"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">          contentClassName,</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"space-y-0.5"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">history.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span></span>
<span class="line"><span style="color:#ADBAC7">            entry.kind </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "command"</span><span style="color:#F47067"> ?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">CommandLine</span></span>
<span class="line"><span style="color:#6CB6FF">                key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.id</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                route</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">route</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                promptSymbol</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">PROMPT_SYMBOL</span><span style="color:#ADBAC7">[variant]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">                command</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.text</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">              /></span></span>
<span class="line"><span style="color:#ADBAC7">            ) </span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">              &#x3C;</span><span style="color:#8DDB8C">OutputLine</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.id</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> line</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.text</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">            ),</span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">hasStarted </span><span style="color:#F47067">&#x26;&#x26;</span><span style="color:#ADBAC7"> phase </span><span style="color:#F47067">!==</span><span style="color:#96D0FF"> "done"</span><span style="color:#F47067"> &#x26;&#x26;</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">finalizedCurrentCommand </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">CommandLine</span></span>
<span class="line"><span style="color:#6CB6FF">              route</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">route</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              promptSymbol</span><span style="color:#F47067">={</span><span style="color:#6CB6FF">PROMPT_SYMBOL</span><span style="color:#ADBAC7">[variant]</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              command</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">typedCommand</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">              cursor</span></span>
<span class="line"><span style="color:#ADBAC7">            /></span></span>
<span class="line"><span style="color:#ADBAC7">          ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">phase </span><span style="color:#F47067">!==</span><span style="color:#96D0FF"> "typing"</span><span style="color:#F47067"> &#x26;&#x26;</span><span style="color:#F47067"> !</span><span style="color:#ADBAC7">finalizedCurrentCommand</span></span>
<span class="line"><span style="color:#F47067">            ?</span><span style="color:#ADBAC7"> liveOutputEntries.</span><span style="color:#DCBDFB">map</span><span style="color:#ADBAC7">((</span><span style="color:#F69D50">entry</span><span style="color:#ADBAC7">) </span><span style="color:#F47067">=></span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">                &#x3C;</span><span style="color:#8DDB8C">OutputLine</span><span style="color:#6CB6FF"> key</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.id</span><span style="color:#F47067">}</span><span style="color:#6CB6FF"> line</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">entry.line</span><span style="color:#F47067">}</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">              ))</span></span>
<span class="line"><span style="color:#F47067">            :</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> TerminalWindowPane</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  variant</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  windowName</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  windowNameAlign</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  variant</span><span style="color:#F47067">:</span><span style="color:#F69D50"> TerminalVariant</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  windowName</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  windowNameAlign</span><span style="color:#F47067">:</span><span style="color:#F69D50"> TerminalWindowNameAlign</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) {</span></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (variant </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "mac"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center border-b border-neutral-700 bg-neutral-900 px-3 py-2.5"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex w-16 items-center gap-1.5"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3 rounded-full bg-[#ff5f56]"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3 rounded-full bg-[#ffbd2e]"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3 rounded-full bg-[#27c93f]"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">          className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">            "grow truncate text-xs font-medium text-neutral-300"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#6CB6FF">            WINDOW_ALIGN_CLASS</span><span style="color:#ADBAC7">[windowNameAlign],</span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        ></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">windowName</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"w-16"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    );</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  if</span><span style="color:#ADBAC7"> (variant </span><span style="color:#F47067">===</span><span style="color:#96D0FF"> "windows"</span><span style="color:#ADBAC7">) {</span></span>
<span class="line"><span style="color:#F47067">    return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center border-b border-neutral-700 bg-neutral-900 pl-2"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"bg-blue-600 rounded-xs p-0.5 my-2.5"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">TerminalIcon</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-4"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">          className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">            "mx-3 grow truncate text-xs font-medium text-neutral-200"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#6CB6FF">            WINDOW_ALIGN_CLASS</span><span style="color:#ADBAC7">[windowNameAlign],</span></span>
<span class="line"><span style="color:#ADBAC7">          )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        ></span></span>
<span class="line"><span style="color:#F47067">          {</span><span style="color:#ADBAC7">windowName</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center text-[10px] text-neutral-300"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"grid h-10 w-12 place-items-center hover:bg-white/10"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">Minus</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"grid h-10 w-12 place-items-center hover:bg-white/10"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">Square</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-3"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"grid h-10 w-12 place-items-center hover:bg-red-600/80"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">            &#x3C;</span><span style="color:#8DDB8C">X</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"size-4"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    );</span></span>
<span class="line"><span style="color:#ADBAC7">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex items-center border-b border-neutral-700 bg-[#1f2937] px-3 py-2"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex w-16 items-center gap-1"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"h-2.5 w-3 rounded-sm bg-neutral-300"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"h-2.5 w-3 rounded-sm bg-neutral-500"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">        &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"h-2.5 w-3 rounded-sm bg-neutral-700"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">span</span></span>
<span class="line"><span style="color:#6CB6FF">        className</span><span style="color:#F47067">={</span><span style="color:#DCBDFB">cn</span><span style="color:#ADBAC7">(</span></span>
<span class="line"><span style="color:#96D0FF">          "grow truncate text-xs font-medium text-neutral-200"</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#6CB6FF">          WINDOW_ALIGN_CLASS</span><span style="color:#ADBAC7">[windowNameAlign],</span></span>
<span class="line"><span style="color:#ADBAC7">        )</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      ></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">windowName</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"w-16"</span><span style="color:#ADBAC7"> /></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> CommandLine</span><span style="color:#ADBAC7">({</span></span>
<span class="line"><span style="color:#F69D50">  route</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  promptSymbol</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  command</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#F69D50">  cursor</span><span style="color:#F47067"> =</span><span style="color:#6CB6FF"> false</span><span style="color:#ADBAC7">,</span></span>
<span class="line"><span style="color:#ADBAC7">}</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> {</span></span>
<span class="line"><span style="color:#F69D50">  route</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  promptSymbol</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  command</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#F69D50">  cursor</span><span style="color:#F47067">?:</span><span style="color:#6CB6FF"> boolean</span><span style="color:#ADBAC7">;</span></span>
<span class="line"><span style="color:#ADBAC7">}) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;</span><span style="color:#8DDB8C">div</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"flex flex-wrap items-start gap-2"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-emerald-400"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">route</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"text-emerald-500"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">promptSymbol</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;</span><span style="color:#8DDB8C">span</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"break-all text-neutral-200"</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">command</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#F47067">        {</span><span style="color:#ADBAC7">cursor </span><span style="color:#F47067">?</span><span style="color:#ADBAC7"> (</span></span>
<span class="line"><span style="color:#ADBAC7">          &#x3C;</span><span style="color:#8DDB8C">motion.span</span></span>
<span class="line"><span style="color:#6CB6FF">            aria-hidden</span></span>
<span class="line"><span style="color:#6CB6FF">            className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"ml-0.5 inline-block h-[1.1em] w-[0.58em] translate-y-1 bg-neutral-100"</span></span>
<span class="line"><span style="color:#6CB6FF">            animate</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ opacity: [</span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">0</span><span style="color:#ADBAC7">, </span><span style="color:#6CB6FF">1</span><span style="color:#ADBAC7">] }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#6CB6FF">            transition</span><span style="color:#F47067">={</span><span style="color:#ADBAC7">{ duration: </span><span style="color:#6CB6FF">0.85</span><span style="color:#ADBAC7">, repeat: </span><span style="color:#6CB6FF">Infinity</span><span style="color:#ADBAC7">, ease: </span><span style="color:#96D0FF">"linear"</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">          /></span></span>
<span class="line"><span style="color:#ADBAC7">        ) </span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> null</span><span style="color:#F47067">}</span></span>
<span class="line"><span style="color:#ADBAC7">      &#x3C;/</span><span style="color:#8DDB8C">span</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">    &#x3C;/</span><span style="color:#8DDB8C">div</span><span style="color:#ADBAC7">></span></span>
<span class="line"><span style="color:#ADBAC7">  );</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067">function</span><span style="color:#DCBDFB"> OutputLine</span><span style="color:#ADBAC7">({ </span><span style="color:#F69D50">line</span><span style="color:#ADBAC7"> }</span><span style="color:#F47067">:</span><span style="color:#ADBAC7"> { </span><span style="color:#F69D50">line</span><span style="color:#F47067">:</span><span style="color:#6CB6FF"> string</span><span style="color:#ADBAC7"> }) {</span></span>
<span class="line"><span style="color:#F47067">  return</span><span style="color:#ADBAC7"> &#x3C;</span><span style="color:#8DDB8C">p</span><span style="color:#6CB6FF"> className</span><span style="color:#F47067">=</span><span style="color:#96D0FF">"whitespace-pre-wrap text-neutral-400"</span><span style="color:#ADBAC7">></span><span style="color:#F47067">{</span><span style="color:#ADBAC7">line</span><span style="color:#F47067">}</span><span style="color:#ADBAC7">&#x3C;/</span><span style="color:#8DDB8C">p</span><span style="color:#ADBAC7">>;</span></span>
<span class="line"><span style="color:#ADBAC7">}</span></span></code></pre>`,
      install: {
        npx: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">npx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/terminal</span></span></code></pre>`,
        pnpm: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">pnpm</span><span style="color:#96D0FF"> dlx</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/terminal</span></span></code></pre>`,
        bun: `<pre class="shiki github-dark-dimmed" style="background-color:#22272e;color:#adbac7" tabindex="0"><code><span class="line"><span style="color:#F69D50">bunx</span><span style="color:#6CB6FF"> --bun</span><span style="color:#96D0FF"> shadcn@latest</span><span style="color:#96D0FF"> add</span><span style="color:#96D0FF"> @arni/terminal</span></span></code></pre>`,
      },
    },
    usage: `"use client";

import { Terminal } from "@/components/ui/terminal";

export function TerminalDemo() {
  return (
    <section className="w-full py-10 md:py-20">
      <Terminal
        commands={[
          "npx shadcn@latest init",
          "npm install motion",
          "npx shadcn@latest add button card",
          "Term Deez Nuts",
        ]}
        outputs={{
          0: [
            "✔ Preflight checks passed.",
            "✔ Created components.json",
            "✔ Initialized project.",
          ],
          1: ["added 1 package in 2s"],
          2: ["✔ Done. Installed button, card."],
        }}
        route="~/workspace/vega"
        windowName="bash - setup"
        variant="mac"
        windowNameAlign="center"
        backgroundVariant="gradient"
        playOnInView
        typingSpeed={45}
        delayBetweenCommands={1000}
      />
    </section>
  );
}

export function WindowsTerminalDemo() {
  return (
    <Terminal
      commands={["pnpm dev", "pnpm build"]}
      outputs={{
        0: ["Ready in 1.8s"],
        1: ["Compiled successfully"],
      }}
      route="C:\\\\Users\\\\you\\\\project"
      windowName="Windows Terminal"
      windowNameAlign="left"
      variant="windows"
    />
  );
}

export function HeaderlessTerminalDemo() {
  return (
    <Terminal
      commands={["docker compose up"]}
      outputs={{
        0: ["[+] Running 6/6", "api-1  | listening on :3000"],
      }}
      route="~/infra/local"
      showWindowPane={false}
      variant="linux"
    />
  );
}`,
    props: [
      {
        name: "commands",
        type: "string[]",
        description: "Commands typed into the terminal in sequence.",
      },
      {
        name: "outputs",
        type: "Record<number, string[]>",
        description:
          "Maps each command index to the lines revealed after that command completes.",
      },
      {
        name: "route",
        type: "string",
        default: '"~/projects/nextjs"',
        description: "Prompt path shown before each command.",
      },
      {
        name: "windowName",
        type: "string",
        default: '"bash"',
        description: "Title text shown inside the window pane.",
      },
      {
        name: "variant",
        type: '"mac" | "windows" | "linux"',
        default: '"mac"',
        description: "Visual style of the window chrome and prompt.",
      },
      {
        name: "showWindowPane",
        type: "boolean",
        default: "true",
        description: "Hides the window chrome when set to false.",
      },
      {
        name: "windowNameAlign",
        type: '"left" | "center" | "right"',
        default: '"center"',
        description: "Controls the alignment of the window title.",
      },
      {
        name: "backgroundVariant",
        type: '"solid" | "gradient"',
        default: '"solid"',
        description:
          "Chooses between a plain terminal body or a subtle gradient treatment.",
      },
      {
        name: "playOnInView",
        type: "boolean",
        default: "false",
        description:
          "Starts the playback only after the terminal enters the viewport.",
      },
    ],
    subComponents: [],
  },
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((component) => component.slug === slug);
}
