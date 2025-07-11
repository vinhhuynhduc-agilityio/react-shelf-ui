import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("Error caught in ErrorBoundary:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
						<p className="font-semibold">Something went wrong in this card.</p>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
