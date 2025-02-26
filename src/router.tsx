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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useEffect } from 'react';
import { logout } from './store/auth/authSlice';
import { isTokenExpired } from './utils/token';
import EditJourney from './pages/EditJourney';

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
    const dispatch = useDispatch();
    const { isAuthenticated, token } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (token && isTokenExpired(token)) {
            dispatch(logout());
        }
    }, [dispatch, token]);

    if (!isAuthenticated || (token && isTokenExpired(token))) {
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
                path: '/journeys/:id',
                element: (
                    <PrivateRoute>
                        <JourneyDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: '/journeys/new',
                element: (
                    <PrivateRoute>
                        <EditJourney />
                    </PrivateRoute>
                ),
            },
            {
                path: '/journeys/:id/edit',
                element: (
                    <PrivateRoute>
                        <EditJourney />
                    </PrivateRoute>
                ),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
