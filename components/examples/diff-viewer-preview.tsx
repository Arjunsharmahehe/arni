"use client";

import {
  DiffLine,
  DiffMark,
  DiffPanel,
  DiffViewer,
} from "@/components/ui/diff-viewer";

const previewHighlightRules = [
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

export function DiffViewerPreview() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <DiffViewer
        filename="app/home-screen.tsx"
        highlightRules={previewHighlightRules}
      >
        <DiffPanel side="before">
          <DiffLine type="del" number={1}>
            {"import { "}
            <DiffMark className="text-red-200">useVehicleState</DiffMark>
            {' } from "@/hooks/useVehicleState";'}
          </DiffLine>
          <DiffLine type="del" number={2}>
            {'import { Dashboard } from "@/components/dashboard";'}
          </DiffLine>
          <DiffLine type="context" number={3}>
            {""}
          </DiffLine>
          <DiffLine type="context" number={4}>
            export function HomeScreen() {"{"}
          </DiffLine>
          <DiffLine type="del" number={5}>
            {"  const { "}
            <DiffMark className="text-red-200">selectedVehicle</DiffMark>
            {", "}
            <DiffMark className="text-red-200">refresh</DiffMark>
            {" } = "}
            <DiffMark className="text-red-200">useVehicleState</DiffMark>
            {"();"}
          </DiffLine>
          <DiffLine type="context" number={6}>
            {""}
          </DiffLine>
          <DiffLine type="context" number={7}>
            {"  return ("}
          </DiffLine>
          <DiffLine type="del" number={8}>
            {"    <Dashboard"}
          </DiffLine>
          <DiffLine type="del" number={9}>
            {"      vehicle={"}
            <DiffMark className="text-red-200">selectedVehicle</DiffMark>
            {"}"}
          </DiffLine>
          <DiffLine type="del" number={10}>
            {"      onRefresh={"}
            <DiffMark className="text-red-200">refresh</DiffMark>
            {"}"}
          </DiffLine>
          <DiffLine type="del" number={11}>
            {"      variant="}
            <DiffMark className="text-red-200">"default"</DiffMark>
          </DiffLine>
          <DiffLine type="del" number={12}>
            {"    />"}
          </DiffLine>
          <DiffLine type="context" number={13}>
            {"  );"}
          </DiffLine>
          <DiffLine type="context" number={14}>
            {"}"}
          </DiffLine>
        </DiffPanel>

        <DiffPanel side="after">
          <DiffLine type="add" number={1}>
            {"import { "}
            <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>
            {' } from "@/hooks/useVehicleStates";'}
          </DiffLine>
          <DiffLine type="add" number={2}>
            {"import { "}
            <DiffMark className="text-emerald-200">DashboardShell</DiffMark>
            {' } from "@/components/dashboard-shell";'}
          </DiffLine>
          <DiffLine type="context" number={3}>
            {""}
          </DiffLine>
          <DiffLine type="context" number={4}>
            export function HomeScreen() {"{"}
          </DiffLine>
          <DiffLine type="add" number={5}>
            {"  const { "}
            <DiffMark className="text-emerald-200">activeVehicle</DiffMark>
            {", "}
            <DiffMark className="text-emerald-200">refreshVehicles</DiffMark>
            {" } = "}
            <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>
            {"();"}
          </DiffLine>
          <DiffLine type="context" number={6}>
            {""}
          </DiffLine>
          <DiffLine type="context" number={7}>
            {"  return ("}
          </DiffLine>
          <DiffLine type="add" number={8}>
            {"    <"}
            <DiffMark className="text-emerald-200">DashboardShell</DiffMark>
          </DiffLine>
          <DiffLine type="add" number={9}>
            {"      vehicle={"}
            <DiffMark className="text-emerald-200">activeVehicle</DiffMark>
            {"}"}
          </DiffLine>
          <DiffLine type="add" number={10}>
            {"      onRefresh={"}
            <DiffMark className="text-emerald-200">refreshVehicles</DiffMark>
            {"}"}
          </DiffLine>
          <DiffLine type="add" number={11}>
            {"      variant="}
            <DiffMark className="text-emerald-200">"focused"</DiffMark>
          </DiffLine>
          <DiffLine type="add" number={12}>
            {"    />"}
          </DiffLine>
          <DiffLine type="context" number={13}>
            {"  );"}
          </DiffLine>
          <DiffLine type="context" number={14}>
            {"}"}
          </DiffLine>
        </DiffPanel>
      </DiffViewer>
    </div>
  );
}
