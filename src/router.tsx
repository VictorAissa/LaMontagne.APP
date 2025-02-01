import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouteObject,
} from 'react-router-dom';
import Login from './pages/Login';
import Journeys from './pages/Journeys';
import NewJourney from './pages/NewJourney';
import JourneyDetails from './pages/JourneyDetails';
import RouteLayout from './layouts/RootLayout';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    if (isAuthenticated) {
        return <Navigate to="/journeys" replace />;
    }

    return children;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const routes: RouteObject[] = [
    {
        element: (
            <RouteLayout>
                <Outlet />
            </RouteLayout>
        ),
        children: [
            {
                path: '/',
                element: <Navigate to="/journeys" replace />,
            },
            {
                path: '/login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: '/journeys',
                element: (
                    <PrivateRoute>
                        <Journeys />
                    </PrivateRoute>
                ),
            },
            {
                path: '/journeys/new',
                element: (
                    <PrivateRoute>
                        <NewJourney />
                    </PrivateRoute>
                ),
            },
            {
                path: '/journeys/:id',
                element: (
                    <PrivateRoute>
                        <JourneyDetails />
                    </PrivateRoute>
                ),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
