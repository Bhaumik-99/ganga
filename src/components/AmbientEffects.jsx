export default function AmbientEffects() {
  return (
    <>
      {/* Film grain — uses CSS ::after */}
      <div className="grain-overlay" />

      {/* Vignette — uses CSS ::before */}
      <div className="vignette-overlay" />
    </>
  );
}
