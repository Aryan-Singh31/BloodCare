import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter | hold | exit

  useEffect(() => {
    // hold after enter animation
    const t1 = setTimeout(() => setPhase("exit"), 3800);
    // notify parent after exit fade
    const t2 = setTimeout(() => onDone(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 40%, #e11d48 100%)",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in-out" : "none",
      }}
    >
      {/* tiled cross pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
        <defs>
          <pattern id="sp" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <rect x="25" y="16" width="6" height="24" rx="3" fill="white"/>
            <rect x="16" y="25" width="24" height="6" rx="3" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sp)"/>
      </svg>

      {/* blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-400 opacity-25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-900 opacity-30 rounded-full blur-3xl pointer-events-none" />

      {/* content */}
      <div
        className="relative flex flex-col items-center gap-5"
        style={{
          animation: "splashPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* icon ring */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <HeartPulse size={48} className="text-white drop-shadow-lg" />
          </div>
          {/* pulse rings */}
          <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" style={{ animationDuration: "1.4s" }} />
          <span className="absolute -inset-3 rounded-full border border-white/20 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.3s" }} />
        </div>

        {/* brand name */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            BloodCare
          </h1>
          <p className="text-red-100 text-sm mt-1.5 tracking-widest uppercase font-medium">
            Donate Blood Â· Save Lives
          </p>
        </div>

        {/* loading bar */}
        <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-white rounded-full"
            style={{ animation: "loadBar 3.6s ease-in-out forwards" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splashPop {
          0%   { opacity: 0; transform: scale(0.7) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes loadBar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}


