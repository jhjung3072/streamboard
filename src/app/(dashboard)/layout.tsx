import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <header>Dashboard Header</header>
      <main>{children}</main>
    </div>
  );
}
