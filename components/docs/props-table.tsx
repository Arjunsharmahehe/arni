import type { PropDef, SubComponent } from "@/lib/component-registry-schema";

export function PropsTable({
  title,
  props,
}: {
  title: string;
  props: PropDef[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-mono text-sm font-medium text-foreground">{title}</h3>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Prop
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Default
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                  {prop.name}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {prop.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {prop.default ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-balance">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SubComponentsTable({
  subComponents,
}: {
  subComponents: SubComponent[];
}) {
  return (
    <div className="space-y-8">
      {subComponents.map((sub) => (
        <div key={sub.name} className="space-y-2">
          <div>
            <h3 className="font-mono text-sm font-medium text-foreground">
              {sub.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {sub.description}
            </p>
          </div>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Prop
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Default
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {sub.props.map((prop) => (
                  <tr
                    key={prop.name}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                      {prop.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {prop.type}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {prop.default ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
