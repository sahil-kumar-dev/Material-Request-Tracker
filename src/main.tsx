import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './provider/queryClient.tsx'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <Toaster richColors />
    <App />
  </QueryProvider>,
)
