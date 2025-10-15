import { PropsWithChildren } from 'react';

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
}

export function AppShell({ sidebar, topbar, children }: PropsWithChildren<AppShellProps>) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0b0418 0%, #120a2c 60%, #1b0f3d 100%)',
        color: '#f7f5ff'
      }}
    >
      <aside style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>{sidebar}</aside>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        {topbar ? <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{topbar}</header> : null}
        <main style={{ flex: 1, padding: '2.5rem' }}>{children}</main>
      </section>
    </div>
  );
}
