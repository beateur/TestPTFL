import { PropsWithChildren } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions, children }: PropsWithChildren<PageHeaderProps>) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle ? (
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.65)' }}>{subtitle}</p>
        ) : null}
        {children}
      </div>
      {actions ? <div style={{ display: 'flex', gap: '0.75rem' }}>{actions}</div> : null}
    </div>
  );
}
