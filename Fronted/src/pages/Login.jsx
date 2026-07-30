import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FiLock, FiMail } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 mesh-grid opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full radial-glow-blue z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full radial-glow-purple z-0 pointer-events-none" />

      {/* Floating Sparkles/Particles */}
      <div className="noise-overlay" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
      >
        {/* Glow Line Top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        {/* Heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-4"
          >
            <div className="text-primary glow-text-primary text-2xl font-bold font-orbitron tracking-tighter">
              MP
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-black font-orbitron tracking-tight text-white mb-2">
            WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">MESHPAY</span>
          </h2>
          <p className="text-sm text-text-muted">
            Enter your credentials to access the offline simulator
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Input
            label="Email Address"
            type="email"
            id="email"
            error={errors.email?.message}
            {...register('email')}
            placeholder=" " // Required for CSS peer floating selectors to activate
          />

          <Input
            label="Password"
            type="password"
            id="password"
            error={errors.password?.message}
            {...register('password')}
            placeholder=" "
          />

          <div className="flex items-center justify-between text-xs text-text-muted pb-4">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-white/10 bg-card text-primary focus:ring-primary w-4 h-4"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="hover:text-primary transition-all duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5"
            loading={loading}
          >
            Authenticate
          </Button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-text-muted mt-6">
          Don't have a wallet?{' '}
          <Link
            to="/signup"
            className="text-primary font-bold hover:underline transition-all duration-200"
          >
            Register VPA
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
