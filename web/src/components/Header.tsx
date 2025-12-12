export function Header() {
  return (
    <header className="relative text-center py-8 mb-8 w-full max-w-full overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-[100vw] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(59,185,80,0.15)_0%,transparent_70%)] pointer-events-none" />

      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-accent-green to-accent-blue bg-clip-text text-transparent relative z-10">
        🎄 Advent of Code Solutions
      </h1>
      <p className="text-text-secondary text-lg mt-2 relative z-10">
        Interactive Problem Viewer & Solution Explorer
      </p>
    </header>
  );
}
