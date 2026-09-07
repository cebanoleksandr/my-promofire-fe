import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/i18n'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './network/queryClient'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { AppThemeProvider } from './lib/theme-mode'
import { Provider } from 'react-redux'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <RouterProvider router={router} />
          </AppThemeProvider>
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>,
)
