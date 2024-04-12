import React from 'react'
import WebsitePage from './Registration/page' // Import the new WebsitePage component
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ThemeRegistry from './ThemeRegistry'

export default function Page() {
  return (
    <AppRouterCacheProvider>
      <ThemeRegistry options={{ key: 'mui-theme' }}>
        <WebsitePage />;
      </ThemeRegistry>
    </AppRouterCacheProvider>
  )
}
