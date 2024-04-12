'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ThemeRegistry from './ThemeRegistry'

import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ height: '100vh', backgroundColor: '#63B3DD' }}>
        <AppRouterCacheProvider>
            <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
