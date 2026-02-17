import clsx from 'clsx';
import { FiLoader } from 'react-icons/fi';
import { forwardRef } from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className = '', ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white focus:ring-violet-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:ring-white/20',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 focus:ring-white/10',
    outline: 'border border-violet-500 text-violet-400 hover:bg-violet-500/10 focus:ring-violet-500',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  return (
    <button
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" />}
      {children}
    </button>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <input
      ref={ref}
      className={clsx(
        'w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none transition-all',
        error
          ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
          : 'border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

Input.displayName = 'Input';

// ─── Select ───────────────────────────────────────────────────────────────────
// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <select
      ref={ref}
      className={clsx(
        'w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-white outline-none transition-all',
        error ? 'border-red-500' : 'border-white/10 focus:border-violet-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

Select.displayName = 'Select';

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = 'gray', className = '' }) => {
  const colors = {
    gray: 'bg-gray-500/20 text-gray-300',
    green: 'bg-green-500/20 text-green-300',
    yellow: 'bg-yellow-500/20 text-yellow-300',
    red: 'bg-red-500/20 text-red-300',
    blue: 'bg-blue-500/20 text-blue-300',
    purple: 'bg-purple-500/20 text-purple-300',
    violet: 'bg-violet-500/20 text-violet-300',
  };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 8 }) => (
  <div className={clsx(`w-${size} h-${size} border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin`)} />
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', ...props }) => (
  <div
    className={clsx('bg-white/[0.03] border border-white/10 rounded-2xl', className)}
    {...props}
  >
    {children}
  </div>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    {Icon && <Icon className="w-16 h-16 text-gray-600" />}
    <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
    {desc && <p className="text-gray-500 max-w-sm">{desc}</p>}
    {action}
  </div>
);
