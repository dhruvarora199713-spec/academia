import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, BarChart3, Shield, Zap } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/constants'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

const features = [
  { icon: BookOpen, text: 'Complete academic management' },
  { icon: BarChart3, text: 'Real-time analytics & insights' },
  { icon: Shield, text: 'Enterprise-grade security' },
  { icon: Zap, text: 'Blazing fast performance' },
]

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between bg-neutral-900 p-10 xl:p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-white">{APP_NAME}</span>
          </div>

          {/* Tagline */}
          <div className="mt-16">
            <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              {APP_TAGLINE}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400 max-w-sm">
              Built for students who demand excellence. Track attendance, manage assignments, analyze performance — all in one platform.
            </p>
          </div>

          {/* Features */}
          <div className="mt-10 space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-primary-400" />
                </div>
                <span className="text-sm text-neutral-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-neutral-600">
          © 2026 {APP_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right — Auth Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-semibold text-neutral-900">{APP_NAME}</span>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">{title}</h2>
            <p className="mt-1.5 text-sm text-neutral-500">{description}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
