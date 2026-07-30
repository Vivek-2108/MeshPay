import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const Signup = () => {
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  // Watch name to show real-time VPA preview
  const nameValue = useWatch({ control, name: 'name' });
  const previewVpa = nameValue
    ? `${nameValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@upimesh`
    : 'address@upimesh';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password);
      toast.success('Registration successful! VPA assigned and 10,000 INR loaded.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. User may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 mesh-grid opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full radial-glow-green z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full radial-glow-purple z-0 pointer-events-none" />

      {/* Noise filter */}
      <div className="noise-overlay" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
      >
        {/* Glow Line Top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60" />

        {/* Heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20 mb-4"
          >
            <div className="text-secondary glow-text-secondary text-2xl font-bold font-orbitron tracking-tighter">
              MP
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-black font-orbitron tracking-tight text-white mb-2">
            REGISTER WALLET
          </h2>
          <p className="text-sm text-text-muted">
            Create an offline-ready digital wallet account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <Input
            label="Full Name"
            type="text"
            id="name"
            error={errors.name?.message}
            {...register('name')}
            placeholder=" "
          />

          {/* VPA Preview Card */}
          {nameValue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-4 py-2.5 rounded-xl border border-secondary/15 bg-secondary/5 mb-4 text-xs flex justify-between items-center"
            >
              <span className="text-text-muted">Allocated UPI VPA:</span>
              <span className="font-mono font-bold text-secondary glow-text-secondary">{previewVpa}</span>
            </motion.div>
          )}

          <Input
            label="Email Address"
            type="email"
            id="email"
            error={errors.email?.message}
            {...register('email')}
            placeholder=" "
          />

          <Input
            label="Password"
            type="password"
            id="password"
            showStrength
            error={errors.password?.message}
            {...register('password')}
            placeholder=" "
          />

          <div className="text-xs text-text-muted py-3">
            By registering, you agree to generate a simulated bank account with a starting balance of <strong className="text-white">10,000 INR</strong> for testing.
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full py-3.5"
            loading={loading}
          >
            Create Wallet & VPA
          </Button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-text-muted mt-6">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-secondary font-bold hover:underline transition-all duration-200"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
