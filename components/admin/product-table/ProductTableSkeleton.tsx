"use client";

export function ProductTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b animate-pulse">
          <td className="p-4 align-middle">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded border bg-muted" />
              <div className="space-y-1">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
          </td>
          <td className="p-4 align-middle">
            <div className="h-6 w-24 bg-muted rounded-full" />
          </td>
          <td className="p-4 align-middle">
            <div className="h-5 w-16 bg-muted rounded" />
          </td>
          <td className="p-4 align-middle">
            <div className="h-5 w-20 bg-muted rounded-full" />
          </td>
          <td className="p-4 align-middle">
            <div className="h-5 w-24 bg-muted rounded" />
          </td>
          <td className="p-4 align-middle text-right">
            <div className="h-8 w-8 bg-muted rounded mx-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}