"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// --- (수정됨) ---
// 'dist/types' 같은 깊은 경로 대신, 
// 'next-themes'에서 직접 타입을 가져옵니다.
import { type ThemeProviderProps } from "next-themes" 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}