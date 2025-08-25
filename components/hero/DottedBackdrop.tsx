"use client";

const DottedBackdrop = () => {
  return (
    // fixed so it fills the viewport at all times
    <div
      className="fixed inset-0 z-[2] pointer-events-none select-none"
      // pure dot grid, no overlays/vignettes
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.14) 1px, rgba(255,255,255,0) 1px)",
        backgroundSize: "22px 22px", // density
        backgroundPosition: "center top", // align with hero
        opacity: 0.35, // subtlety
        mixBlendMode: "normal",
      }}
    />
  );
};

export default DottedBackdrop;
