import { QueryCache, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// constants
import { ERROR_MESSAGE } from "@/constants";
import { useToastStore } from "@/stores";

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Handle API error at global scope
      // Only process toast if it is a query (mutation does not go into this)
      if (!query.meta?.suppressToast) {
        const { showToast } = useToastStore.getState();
        const err = error as {
          response?: {
            data?: {
              error?: string;
            };
          };
        };
        const message = (err?.response?.data?.error ??
          query.meta?.errorMessage ??
          ERROR_MESSAGE.DEFAULT) as string;

        showToast(message, "error");
      }
    },
  }),
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
});
