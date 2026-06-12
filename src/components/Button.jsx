// Button.jsx
// Reusable button component following the RatioCraft design system.

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button
 * Props:
 *   variant   {string}  'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
 *   size      {string}  'sm' | 'md' | 'lg'
 *   disabled  {boolean}
 *   onClick   {fn}
 *   children  {node}
 *   fullWidth {boolean}
 *   icon      {node}    Leading icon (optional)
 *   trailingIcon {node} Trailing icon (optional)
 *   className {string}  Extra classes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  fullWidth = false,
  icon = null,
  trailingIcon = null,
  className = '',
  ...rest
}) {
  const variantClasses = {
    primary:   'bg-primary hover:bg-primary-light text-white shadow-md',
    secondary: 'bg-secondary hover:bg-secondary-light text-white shadow-md',
    accent:    'bg-accent hover:bg-accent-light text-white shadow-md',
    ghost:     'bg-transparent hover:bg-white/10 text-white/80 border border-white/15',
    danger:    'bg-red-900/300 hover:bg-red-600 text-white shadow-md',
    outline:   'bg-white/5 hover:bg-white/5 text-primary border-2 border-primary',
  }[variant] || '';

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 gap-1',
    md: 'text-sm py-2.5 px-5 gap-2',
    lg: 'text-base py-3 px-7 gap-2.5',
  }[size] || 'text-sm py-2.5 px-5 gap-2';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-bold rounded-full transition-all
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {trailingIcon && <span className="flex-shrink-0">{trailingIcon}</span>}
    </motion.button>
  );
}
