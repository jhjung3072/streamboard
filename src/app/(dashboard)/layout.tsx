import type { ReactNode } from 'react';
import LogoutButton from './_components/logout-button.client';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <header>
        <span>Dashboard Header</span>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}
