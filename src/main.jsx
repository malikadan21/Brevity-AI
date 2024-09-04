import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from './auth/sign-in/index.jsx';
import Home  from './LandingPage/index.jsx';
import DashBoard from './DashBoard/index.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import EditResume from './DashBoard/resume/[resumeId]/edit/index.jsx';
import ViewResume from './my-resume/[resumeID]/index.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


const router = createBrowserRouter([
  {
    element:<App/>,
    children:[
      {
        path:'/dashboard',
        element:<DashBoard/>
      },
      {
        path:'/dashboard/resume/:resumeId/edit',
        element:<EditResume/>
      }
    ]
  },
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'auth/sign-in',
    element:<SignInPage/>,
  },
  {
    path:'/my-resume/:resumeId/view',
    element:<ViewResume/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router= {router} />
    </ClerkProvider>
  </StrictMode>,
)
