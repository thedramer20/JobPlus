import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { ErrorBoundary } from "./components/system/error-boundary";
import { PreferencesProvider } from "./context/PreferencesContext";
import "./i18n";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false
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
