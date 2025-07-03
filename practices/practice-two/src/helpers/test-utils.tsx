import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			gcTime: 0,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
		mutations: {
			retry: false,
		},
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions) =>
	render(ui, { wrapper, ...options });

export { screen, fireEvent, waitFor, act } from "@testing-library/react";
export { queryClient, customRender as render, wrapper };
