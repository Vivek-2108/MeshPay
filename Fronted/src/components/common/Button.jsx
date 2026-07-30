import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-grotesk font-semibold tracking-wide rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variants = {
    primary: 'bg-primary text-background-primary hover:bg-white glow-border-primary border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)] focus:ring-primary',
    secondary: 'bg-secondary text-background-primary hover:bg-white glow-border-secondary border border-secondary/20 shadow-[0_0_20px_rgba(0,255,149,0.2)] focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-opacity-90 border border-accent/20 shadow-[0_0_20px_rgba(108,99,255,0.2)] focus:ring-accent',
    outline: 'bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20 focus:ring-white',
    danger: 'bg-danger text-white hover:bg-opacity-90 border border-danger/20 focus:ring-danger',
    ghost: 'bg-transparent text-text-muted hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Glow highlight inside */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}

      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
