import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/store/auth-context'
import { AuthLayout } from './AuthLayout'
import { forgotPasswordSchema, type ForgotPasswordFormData } from './schemas'

export default function ForgotPasswordPage() {
  const { resetPassword, error: authError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" description="We've sent you a password reset link">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-success-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-success-600" />
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            If an account exists for <strong className="text-neutral-900">{getValues('email')}</strong>, you'll receive a password reset email shortly.
          </p>
          <p className="mt-3 text-xs text-neutral-400">Check your spam folder if you don't see it.</p>
          <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset your password" description="Enter your email and we'll send you a reset link">
      {authError && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3">
          <p className="text-xs font-medium text-error-700">{authError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@university.edu"
              className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${errors.email ? 'border-error-300' : 'border-border'}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-error-600">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send Reset Link
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
