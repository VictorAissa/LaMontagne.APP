import { createBrowserRouter, Navigate, Outlet, RouteObject } from "react-router-dom"
import Login from "./pages/Login"
import Journeys from "./pages/Journeys"
import NewJourney from "./pages/NewJourney"
import JourneyDetails from "./pages/JourneyDetails"
import RouteLayout from "./layouts/RootLayout"


/* interface JourneyParams {
    id: string
} */

const routes: RouteObject[] = [
  {
    element: <RouteLayout><Outlet/></RouteLayout>,
    children : [
      {
        path: '/',
        element: <Navigate to="/journeys" replace />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/journeys',
        element: <Journeys />
      },
      {
        path: '/journeys/new',
        element: <NewJourney />
      },
      {
        path: '/journeys/:id',
        element: <JourneyDetails />
      }
    ]
  }    
]

export const router = createBrowserRouter(routes)