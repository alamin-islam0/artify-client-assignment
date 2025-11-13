import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import ErrorPage from './pages/ErrorPage.jsx';

const router = createBrowserRouter ([
  {
    index: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {

      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router = {router}/>
    </AuthProvider>
  </StrictMode>,
)
