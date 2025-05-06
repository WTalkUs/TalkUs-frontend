"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { AuthProvider } from "./AuthProvider";

export default function MainProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </NextThemeProvider>
    </HeroUIProvider>
  );
}
