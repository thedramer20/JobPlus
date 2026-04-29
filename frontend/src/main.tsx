import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { ErrorBoundary } from "./components/system/error-boundary";
import { PreferencesProvider } from "./context/PreferencesContext";
import "./i18n";
import "./styles/global.css";
import "./styles/premium-polish.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes default
      gcTime: 5 * 60 * 1000, // 5 minutes default
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: 1,
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <RouterProvider router={router} />
        </PreferencesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
