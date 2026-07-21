import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, User, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/auth-context'
import { useToast } from '@/components/shared/Toast'
import { AuthLayout } from './AuthLayout'
import { registerSchema, type RegisterFormData } from './schemas'

export default function RegisterPage() {
  const { register: registerUser, loginWithGoogle, error: authError } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false as unknown as true },
  })

  const password = watch('password', '')
  const passwordChecks = [
    { label: '6+ characters', met: password.length >= 6 },
    { label: 'One uppercase', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      await registerUser(data.email, data.password)
      toast({ title: 'Account created!', description: 'Welcome to Academia.', variant: 'success' })
      navigate('/', { replace: true })
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/', { replace: true })
    } catch {
      // Error handled by AuthContext
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" description="Join thousands of students using Academia">
      {authError && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3">
          <p className="text-xs font-medium text-error-700">{authError}</p>
        </motion.div>
      )}

      {/* Google */}
      <button onClick={handleGoogle} disabled={googleLoading || loading} className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none">
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        )}
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-neutral-400">or</span><div className="h-px flex-1 bg-border" /></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input {...register('fullName')} placeholder="Dhruv Arora" className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${errors.fullName ? 'border-error-300' : 'border-border'}`} />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-error-600">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input {...register('email')} type="email" placeholder="you@university.edu" className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${errors.email ? 'border-error-300' : 'border-border'}`} />
          </div>
          {errors.email && <p className="mt-1 text-xs text-error-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${errors.password ? 'border-error-300' : 'border-border'}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password strength */}
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
              {passwordChecks.map((c) => (
                <span key={c.label} className={cn('flex items-center gap-1 text-[11px]', c.met ? 'text-success-600' : 'text-neutral-400')}>
                  <CheckCircle2 className="h-3 w-3" />{c.label}
                </span>
              ))}
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-error-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${errors.confirmPassword ? 'border-error-300' : 'border-border'}`} />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-error-600">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input {...register('acceptTerms')} type="checkbox" id="terms" className="mt-0.5 h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-200" />
          <label htmlFor="terms" className="text-xs text-neutral-600">I agree to the <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> and <Link to="/about" className="text-primary-600 hover:underline">Terms of Service</Link></label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-error-600">{errors.acceptTerms.message}</p>}

        {/* Submit */}
        <button type="submit" disabled={loading || googleLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
