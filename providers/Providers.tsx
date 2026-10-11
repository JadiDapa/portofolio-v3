"use client";

import { ReactNode, useState } from "react";
import { MotionConfig } from "motion/react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          enableColorScheme
          disableTransitionOnChange
        >
          {/* Honour the OS reduce-motion setting for every motion component */}
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
