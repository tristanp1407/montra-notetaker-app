import { SignOutButton } from "@components/ui/sign-out-button";
import { User, GalleryHorizontalEnd, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted/25 border-r p-4 flex flex-col">
      {/* Header / Branding */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-teal-400 text-primary-foreground rounded-lg w-8 h-8 flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Montra Notetake</span>
      </div>

      {/* Full-Width Divider */}
      <div className="-mx-4 mb-4 h-px bg-border" />

      {/* Navigation */}
      <nav className="text-sm space-y-2">
        <a
          href="/projects"
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted transition"
        >
          <GalleryHorizontalEnd className="w-4 h-4" />
          <span className="font-medium">Projects</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <SignOutButton />
      </div>
    </aside>
  );
}
