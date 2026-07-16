import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 mb-4">
            <AlertTriangle className="h-6 w-6 text-error-600" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">Something went wrong</h2>
          <p className="mt-1 text-sm text-neutral-500 text-center max-w-sm">
            An unexpected error occurred. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
