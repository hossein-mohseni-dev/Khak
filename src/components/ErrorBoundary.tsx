import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from './ui/Button'

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('UI crash', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-2">This screen crashed</h1>
          <p className="text-sm text-soil-600 mb-4">{this.state.error.message}</p>
          <Button onClick={() => this.setState({ error: null })}>Try to recover</Button>
        </div>
      )
    }
    return this.props.children
  }
}
