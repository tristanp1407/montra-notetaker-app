import { SignOutButton } from "@components/ui/sign-out-button";

export function Sidebar() {
  return (
    <aside className="w-64 border-r p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
          C
        </div>
        <span className="text-sm font-medium">Campbell Baron</span>
      </div>

      <nav className="text-sm space-y-2">
        <a href="/projects" className="font-medium">
          Projects
        </a>
      </nav>

      <div className="mt-auto pt-6 border-t text-sm">
        <SignOutButton />
      </div>
    </aside>
  );
}
