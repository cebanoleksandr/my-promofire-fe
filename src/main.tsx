import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './network/queryClient'
import { RouterProvider } from 'react-router-dom'
import router from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {/* <Provider store={store}> */}
        <QueryClientProvider client={queryClient}>
          {/* <ThemeModeProvider> */}
            <RouterProvider router={router} />
          {/* </ThemeModeProvider> */}
        </QueryClientProvider>
      {/* </Provider> */}
    </Suspense>
  </StrictMode>,
)
