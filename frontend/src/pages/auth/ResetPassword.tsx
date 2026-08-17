import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="bg-slate-900 dark:bg-slate-950 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <KeyRound className="h-8 w-8 text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Invalid Link
              </h1>
              <p className="text-slate-400">
                This password reset link is invalid. Please request a new one.
              </p>
            </div>
            <Link to="/forgot-password">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all">
                Request New Link
              </Button>
            </Link>
          </div>
          <div className="hidden md:block relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradientReset" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M 0,400 C 150,450 350,350 500,400 L 500,00 L 0,0 Z" fill="url(#gradientReset)" className="animate-pulse" opacity="0.3" />
                <path d="M 0,450 C 200,480 300,420 500,460 L 500,00 L 0,0 Z" fill="url(#gradientReset)" opacity="0.4" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center justify-center h-full p-12">
              <div className="text-center text-white">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
                    <KeyRound className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Reset Password</h2>
                <p className="text-white/80 text-lg">Create a new strong password for your account</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="bg-slate-900 dark:bg-slate-950 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Password Reset!
              </h1>
              <p className="text-slate-400">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Login
              </Button>
            </Link>
          </div>
          <div className="hidden md:block relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradientReset" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M 0,400 C 150,450 350,350 500,400 L 500,00 L 0,0 Z" fill="url(#gradientReset)" className="animate-pulse" opacity="0.3" />
                <path d="M 0,450 C 200,480 300,420 500,460 L 500,00 L 0,0 Z" fill="url(#gradientReset)" opacity="0.4" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center justify-center h-full p-12">
              <div className="text-center text-white">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">All Done!</h2>
                <p className="text-white/80 text-lg">
                  Your account is now secured with a new password
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Left Side - Gradient Wave Background */}
        <div className="hidden md:block relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradientReset" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M 0,400 C 150,450 350,350 500,400 L 500,00 L 0,0 Z" fill="url(#gradientReset)" className="animate-pulse" opacity="0.3" />
              <path d="M 0,450 C 200,480 300,420 500,460 L 500,00 L 0,0 Z" fill="url(#gradientReset)" opacity="0.4" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-center h-full p-12">
            <div className="text-center text-white">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
                  <KeyRound className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Create New Password</h2>
              <p className="text-white/80 text-lg">
                Make sure your new password is strong and unique
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-slate-900 dark:bg-slate-950 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Reset Password
            </h1>
            <p className="text-slate-400">
              Enter your new password or{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer hover:underline transition-all">
                go back to login
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 pr-12 bg-slate-800 border ${
                    errors.password ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 pr-12 bg-slate-800 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                  } rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
