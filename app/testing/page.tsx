import {
  DiffLine,
  DiffMark,
  DiffPanel,
  DiffViewer,
} from "@/components/ui/diff-viewer";

export default function TestingPage() {
  return (
    <div className="flex flex-col gap-24 min-h-screen items-center justify-center bg-black p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <p className="mb-2">Base diff component</p>
        <DiffViewer filename="app/home-screen.tsx">
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
              {"    <"}
              <DiffMark className="text-red-200">Dashboard</DiffMark>
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

      <div className="w-full max-w-6xl border border-border p-1 rounded-xl relative">
        <p className="mb-2 absolute -top-8">Background blended diff</p>
        <div className="w-full absolute -bottom-1 -left-1 -right-1 h-60 bg-linear-0 from-black to-transparent" />
        <DiffViewer filename="app/home-screen.tsx">
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
              {"    <"}
              <DiffMark className="text-red-200">Dashboard</DiffMark>
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

      <div className="w-full max-w-xl border border-border p-1 rounded-xl relative">
        <p className="mb-2 absolute -top-8">Inline diff</p>
        <div className="w-full absolute -bottom-1 -left-1 -right-1 h-60 bg-linear-0 from-black to-transparent" />
        <DiffViewer filename="app/home-screen.tsx" panes={1}>
          <DiffPanel side="before">
            <DiffLine type="del" number={1}>
              {"import { "}
              <DiffMark className="text-red-200">useVehicleState</DiffMark>
              {' } from "@/hooks/useVehicleState";'}
            </DiffLine>
            <DiffLine type="add" number={1}>
              {"import { "}
              <DiffMark className="text-emerald-200">useVehicleState</DiffMark>
              {' } from "@/hooks/useVehicleState";'}
            </DiffLine>
            <DiffLine type="context" number={2}>
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
            <DiffLine type="add" number={5}>
              {"  const { "}
              <DiffMark className="text-emerald-200">selectedVehicle</DiffMark>
              {", "}
              <DiffMark className="text-emerald-200">refresh</DiffMark>
              {" } = "}
              <DiffMark className="text-emerald-200">useVehicleState</DiffMark>
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
        </DiffViewer>
      </div>
    </div>
  );
}
