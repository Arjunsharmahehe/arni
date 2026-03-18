import {
  DiffLine,
  DiffMark,
  DiffPanel,
  DiffViewer,
} from "@/registry/base-vega/diff-viewer/diff-viewer";

const highlightRules = [
  {
    name: "keyword",
    pattern: /\b(?:import|from|export|function|const|return)\b/,
    style: { color: "#38bdf8" },
  },
  {
    name: "string",
    pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
    style: { color: "#fbbf24" },
  },
];

<DiffViewer filename="app/home-screen.tsx" highlightRules={highlightRules}>
  <DiffPanel side="before">
    <DiffLine type="del" number={1}>
      {"import { "}
      <DiffMark className="text-red-200">useVehicleState</DiffMark>
      {" } "}
      {`from "@/hooks/useVehicleState";`}
    </DiffLine>
    <DiffLine type="del" number={2}>
      {` const { `}
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
      {`const { `}
      <DiffMark className="text-emerald-200">activeVehicle</DiffMark>
      {" } = "}
      <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>();
    </DiffLine>
  </DiffPanel>
</DiffViewer>;
