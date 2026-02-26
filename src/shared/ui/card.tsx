import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-800/70 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
