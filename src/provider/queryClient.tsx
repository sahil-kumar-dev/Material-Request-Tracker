/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        gcTime: 5 * 60 * 1000,
                        retry: (failureCount, error: any) => {
                            // Don't retry on 4xx errors except 408, 429
                            if (
                                error?.statusCode >= 400 &&
                                error?.statusCode < 500
                            ) {
                                if (
                                    error?.statusCode === 408 ||
                                    error?.statusCode === 429
                                ) {
                                    return failureCount < 3;
                                }
                                return false;
                            }
                            // Retry on network errors and 5xx errors
                            return failureCount < 3;
                        },
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            // Don't retry mutations on client errors
                            if (
                                error?.statusCode >= 400 &&
                                error?.statusCode < 500
                            ) {
                                return false;
                            }
                            // Retry on network errors and 5xx errors
                            return failureCount < 2;
                        },
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient} >
            {children}
            {
                import.meta.env.MODE === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )
            }
        </QueryClientProvider>
    );
}
