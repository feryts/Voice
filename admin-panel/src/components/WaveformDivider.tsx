const HEIGHTS = [6, 12, 8, 18, 10, 14, 7, 16, 9, 12, 6, 15, 11, 8, 17, 10, 6, 13, 9, 12];

export default function WaveformDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`waveform-divider ${className}`} aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <span key={i} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}
