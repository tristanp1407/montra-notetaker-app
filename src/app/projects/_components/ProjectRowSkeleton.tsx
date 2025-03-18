export default function ProjectRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {/* Group label skeleton */}
      <tr>
        <td
          colSpan={4}
          className="bg-muted px-3 py-2 text-sm font-medium text-gray-700 border-y"
        >
          <span className="inline-block h-4 w-24 bg-muted rounded-sm animate-pulse align-middle leading-tight" />
        </td>
      </tr>

      {/* Skeleton project rows */}
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b hover:bg-muted/50 animate-pulse">
          <td className="px-3 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md border border-gray-200 bg-muted" />
              <div className="h-4 w-1/2 bg-muted rounded-sm" />
            </div>
          </td>
          <td className="px-3 py-2 text-right">
            <div className="h-4 w-24 bg-muted rounded-sm ml-auto" />
          </td>
          <td className="px-3 py-2 text-right">
            <div className="h-4 w-24 bg-muted rounded-sm ml-auto" />
          </td>
          <td className="px-3 py-2 text-right">
            <div className="h-4 w-6 bg-muted rounded-sm ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
