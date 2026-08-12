'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { SocketProvider } from '@/contexts/SocketContext';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { X } from 'lucide-react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(91, 141, 239, 0.12)",
            },
            success: {
              iconTheme: { primary: "#6A9CFD", secondary: "#fff" },
            },
          }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== "loading" && (
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="ml-auto rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand shrink-0"
                      aria-label="Close toast"
                    >
                      <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </SocketProvider>
    </QueryClientProvider>
  );
}
