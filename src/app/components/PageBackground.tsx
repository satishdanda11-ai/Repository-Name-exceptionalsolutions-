export function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse at 70% 10%, rgba(67,176,241,0.18) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 60%, rgba(5,125,205,0.12) 0%, transparent 45%),
        radial-gradient(ellipse at 80% 85%, rgba(67,176,241,0.10) 0%, transparent 40%),
        linear-gradient(180deg,
          #0B1F3A 0%,
          #0D2647 18%,
          #0F2D55 35%,
          #112E56 50%,
          #0F2A50 65%,
          #0C2244 80%,
          #0A1B38 100%
        )
      `,
    }}>
      {children}
    </div>
  );
}