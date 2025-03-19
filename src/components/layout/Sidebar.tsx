import { SignOutButton } from "@components/ui/sign-out-button";
import Albums from "@icons/Albums";

export function Sidebar() {
  return (
    <aside className="w-[240px] bg-muted/25 border-r p-4 flex flex-col">
      {/* Header / Branding */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#21CCEE] text-primary-foreground rounded-[6px] w-6 h-6 flex items-center justify-center">
          C
        </div>
        <span className="text-lg">Campbell Baron</span>
      </div>

      {/* Full-Width Divider */}
      <div className="-mx-4 mb-4 h-px bg-border" />

      {/* Navigation */}
      <nav className="text-sm space-y-2">
        <a
          href="/projects"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition"
        >
          <Albums className="w-4 h-4 text-gray-700" />
          <span className="font-normal text-gray-900">Projects</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <SignOutButton />
      </div>
    </aside>
  );
}
