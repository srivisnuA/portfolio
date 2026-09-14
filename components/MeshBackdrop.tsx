"use client";

export default function MeshBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-[#0A0B10]" />
      <div
        className="absolute -top-40 left-1/4 h-[560px] w-[560px] rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, #5EEAD4 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.14] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, #7DD3FC 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full opacity-[0.10] blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, #F5B860 0%, transparent 70%)",
        }}
      />
      {/* faint starfield dots, nods to the ISRO/space project without being literal */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]">
        <defs>
          <pattern
            id="stars"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="30" r="1" fill="#E7E9EE" opacity="0.5" />
            <circle cx="90" cy="80" r="0.8" fill="#E7E9EE" opacity="0.3" />
            <circle cx="140" cy="20" r="1.2" fill="#E7E9EE" opacity="0.4" />
            <circle cx="60" cy="140" r="0.9" fill="#E7E9EE" opacity="0.3" />
            <circle cx="160" cy="120" r="1" fill="#E7E9EE" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stars)" />
      </svg>
    </div>
  );
}
