import { GalleryHorizontalEnd } from "lucide-react";

export function Header() {
  return (
    <header className="border-b px-4 py-3">
      <div className="flex items-center gap-2 text-base ">
        <GalleryHorizontalEnd className="w-4 h-4" />
        <h1>Projects</h1>
      </div>
    </header>
  );
}
