import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  showStrength = false,
  className = '',
  id,
  value,
  onChange,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [strength, setStrength] = useState(0);

  // Evaluate password strength
  const checkPasswordStrength = (val) => {
    let score = 0;
    if (!val) return 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 10) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;
    return score;
  };

  const handleTextChange = (e) => {
    if (onChange) onChange(e);
    if (type === 'password' && showStrength) {
      setStrength(checkPasswordStrength(e.target.value));
    }
  };

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-danger';
    if (strength <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={`w-full mb-5 ${className}`}>
      <div className="relative">
        <input
          id={id}
          type={type}
          ref={ref}
          value={value}
          onChange={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => setFocused(e.target.value !== '')}
          className={`w-full bg-[#111111]/70 backdrop-blur-md text-white border rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-300 font-sans
            ${error ? 'border-danger focus:border-danger' : 'border-white/10 focus:border-primary'}
            ${focused || value ? 'pt-6 pb-2' : ''}
          `}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={id}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-sans pointer-events-none transition-all duration-300
              ${focused || value ? 'top-3 text-xs text-primary translate-y-0' : ''}
              ${error && (focused || value) ? 'text-danger' : ''}
            `}
          >
            {label}
          </label>
        )}
      </div>

      {/* Password Strength Meter */}
      {type === 'password' && showStrength && value && (
        <div className="mt-2 px-1">
          <div className="flex justify-between items-center mb-1 text-xs text-text-muted">
            <span>Password Strength:</span>
            <span className={strength <= 1 ? 'text-danger' : strength <= 3 ? 'text-warning' : 'text-success'}>
              {getStrengthText()}
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 transition-all duration-300 ${
                  strength >= step ? getStrengthColor() : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-danger text-xs mt-1.5 ml-1 font-sans"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
