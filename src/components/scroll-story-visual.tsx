"use client";

import { useId } from "react";

export type ScrollStoryVariant = "method" | "expertises" | "projects" | "advice" | "about";

type Props = {
  activeStep: number;
  variant: ScrollStoryVariant;
};

const methodNodes = [
  { x: 84, y: 244 },
  { x: 188, y: 188 },
  { x: 292, y: 132 },
  { x: 396, y: 76 },
];

const projectFrames = [
  { x: 52, y: 52 },
  { x: 140, y: 108 },
  { x: 228, y: 164 },
];

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function ScrollStoryVisual({ activeStep, variant }: Props) {
  const rawId = useId();
  const gridId = `scroll-story-grid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className="scroll-story-svg"
      focusable="false"
      role="presentation"
      viewBox="0 0 480 320"
    >
      <defs>
        <pattern height="24" id={gridId} patternUnits="userSpaceOnUse" width="24">
          <path className="sv-grid" d="M24 0H0V24" fill="none" />
        </pattern>
      </defs>
      <rect className="sv-grid-bg" fill={`url(#${gridId})`} height="320" width="480" />
      {variant === "method" ? <MethodVisual activeStep={activeStep} /> : null}
      {variant === "expertises" ? <ExpertisesVisual activeStep={activeStep} /> : null}
      {variant === "projects" ? <ProjectsVisual activeStep={activeStep} /> : null}
      {variant === "advice" ? <AdviceVisual activeStep={activeStep} /> : null}
      {variant === "about" ? <AboutVisual activeStep={activeStep} /> : null}
    </svg>
  );
}

function MethodVisual({ activeStep }: { activeStep: number }) {
  const activeNodes = methodNodes.slice(0, Math.min(activeStep + 1, methodNodes.length));

  return (
    <g>
      <path className="sv-frame" d="M48 280H432M48 280V48" />
      <path className="sv-line sv-dashed" d="M84 244H396" />
      <polyline
        className="sv-line"
        fill="none"
        points={methodNodes.map((node) => `${node.x},${node.y}`).join(" ")}
      />
      {activeNodes.length > 1 ? (
        <polyline
          className="sv-accent"
          fill="none"
          points={activeNodes.map((node) => `${node.x},${node.y}`).join(" ")}
        />
      ) : null}
      {methodNodes.map((node, index) => (
        <g key={`${node.x}-${node.y}`}>
          {index === activeStep ? (
            <rect
              className="sv-active-frame"
              height="34"
              width="34"
              x={node.x - 17}
              y={node.y - 17}
            />
          ) : null}
          <circle
            className={classes(
              "sv-node",
              index < activeStep && "is-done",
              index === activeStep && "is-active",
            )}
            cx={node.x}
            cy={node.y}
            r="10"
          />
          <text className="sv-label" x={node.x - 5} y={node.y + 36}>
            {String(index + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </g>
  );
}

function ExpertisesVisual({ activeStep }: { activeStep: number }) {
  return (
    <g>
      <path className="sv-frame" d="M56 280V44M56 280H432" />
      {[0, 1, 2, 3, 4].map((index) => {
        const y = 64 + index * 46;
        const width = 96 + index * 52;
        const active = index === activeStep;
        const done = index < activeStep;

        return (
          <g key={index}>
            {active ? (
              <rect className="sv-row-bg" height="26" width={width} x="56" y={y - 13} />
            ) : null}
            <line className="sv-line" x1="56" x2="424" y1={y} y2={y} />
            <line
              className={classes("sv-progress", active && "is-active", done && "is-done")}
              x1="56"
              x2={56 + width}
              y1={y}
              y2={y}
            />
            <rect
              className={classes("sv-node-square", active && "is-active", done && "is-done")}
              height="10"
              width="10"
              x={51 + width}
              y={y - 5}
            />
            <text className={classes("sv-label", active && "is-active")} x="28" y={y + 3}>
              {String(index + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <text className="sv-label" x="56" y="300">
        01 — 05
      </text>
    </g>
  );
}

function ProjectsVisual({ activeStep }: { activeStep: number }) {
  const order = [0, 1, 2].sort((a, b) => Number(a === activeStep) - Number(b === activeStep));

  return (
    <g>
      <path className="sv-frame" d="M40 288H440M440 288V32" />
      {order.map((index) => {
        const frame = projectFrames[index];
        const active = index === activeStep;
        const done = index < activeStep;

        return (
          <g
            className={classes("sv-window", active && "is-active", done && "is-done")}
            key={index}
            transform={`translate(${frame.x} ${frame.y})`}
          >
            <rect className="sv-window-bg" height="118" width="196" />
            <line className="sv-line" x1="0" x2="196" y1="24" y2="24" />
            <circle className="sv-window-dot" cx="12" cy="12" r="3" />
            <circle className="sv-window-dot" cx="24" cy="12" r="3" />
            <rect className="sv-window-block" height="8" width="96" x="16" y="42" />
            <rect className="sv-window-line" height="4" width="156" x="16" y="62" />
            <rect className="sv-window-line" height="4" width="132" x="16" y="76" />
            <rect className="sv-window-line" height="4" width="148" x="16" y="90" />
            <text className="sv-label" x="170" y="108">
              {String(index + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function AdviceVisual({ activeStep }: { activeStep: number }) {
  return (
    <g>
      <path className="sv-frame" d="M48 288V40M48 288H432" />
      <g className={classes("sv-group", activeStep === 0 && "is-active")}>
        <line className="sv-line" x1="84" x2="84" y1="52" y2="236" />
        {[0, 1, 2, 3, 4].map((index) => {
          const y = 52 + index * 46;

          return (
            <g key={index}>
              <circle
                className={classes("sv-node", activeStep > 0 && "is-done")}
                cx="84"
                cy={y}
                r="7"
              />
              <text className="sv-label" x="50" y={y + 3}>
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </g>
      <path className="sv-connector" d="M84 144H150" />
      <g className={classes("sv-rules", activeStep === 1 && "is-active")}>
        <rect className="sv-rule-frame" height="52" width="52" x="150" y="118" />
        <line className="sv-line" x1="162" x2="190" y1="132" y2="132" />
        <line className="sv-line" x1="162" x2="190" y1="144" y2="144" />
        <line className="sv-line" x1="162" x2="184" y1="156" y2="156" />
      </g>
      <path className="sv-connector" d="M202 144H236" />
      <g className={classes("sv-result", activeStep === 2 && "is-active")}>
        <rect className="sv-result-frame" height="136" width="184" x="236" y="76" />
        <line className="sv-line" x1="252" x2="380" y1="104" y2="104" />
        <line className="sv-line" x1="252" x2="404" y1="128" y2="128" />
        <line className="sv-line" x1="252" x2="360" y1="152" y2="152" />
        <line className="sv-line" x1="252" x2="392" y1="176" y2="176" />
      </g>
      <g className={classes("sv-risks", activeStep === 3 && "is-active")}>
        <path className="sv-risk-triangle" d="M352 252L372 220L392 252Z" />
        <line className="sv-line" x1="372" x2="372" y1="230" y2="240" />
        <circle className="sv-window-dot" cx="372" cy="246" r="1.5" />
      </g>
      <text className="sv-label" x="236" y="278">
        04
      </text>
    </g>
  );
}

function AboutVisual({ activeStep }: { activeStep: number }) {
  return (
    <g>
      <path className="sv-frame" d="M60 280V40H420V280H60" />
      <path className="sv-line sv-dashed" d="M60 160H420M240 40V280" />
      <path
        className={classes("sv-connector", activeStep === 1 && "is-active")}
        d="M140 170Q240 84 340 170"
      />
      <g className={classes("sv-about-node", activeStep === 0 && "is-active")}>
        <circle className="sv-node" cx="140" cy="170" r="9" />
        {activeStep === 0 ? (
          <rect className="sv-active-frame" height="36" width="36" x="122" y="152" />
        ) : null}
        <text className="sv-label" x="116" y="206">
          01
        </text>
      </g>
      <g className={classes("sv-about-node", activeStep === 1 && "is-active")}>
        <circle className="sv-node" cx="340" cy="170" r="9" />
        {activeStep === 1 ? (
          <rect className="sv-active-frame" height="36" width="36" x="322" y="152" />
        ) : null}
        <text className="sv-label" x="316" y="206">
          02
        </text>
      </g>
      <g className={classes("sv-about-values", activeStep === 2 && "is-active")}>
        <rect
          className="sv-diamond"
          height="36"
          transform="rotate(45 240 160)"
          width="36"
          x="222"
          y="142"
        />
        <circle className="sv-node" cx="240" cy="160" r="5" />
        <text className="sv-label" x="232" y="122">
          03
        </text>
      </g>
    </g>
  );
}
