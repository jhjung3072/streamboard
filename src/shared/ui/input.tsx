import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-lg border bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        hasError ? 'border-rose-500/70 focus-visible:ring-rose-400' : 'border-slate-800/80',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';

export default Input;
