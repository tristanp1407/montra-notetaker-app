import Albums from "@icons/Albums";

export function Header() {
  return (
    <header className="border-b px-4 py-3">
      <div className="flex items-center gap-2 text-base ">
        <Albums className="w-[20px] h-[20px] text-gray-600" />
        <h1>Projects</h1>
      </div>
    </header>
  );
}
