import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';

import APIErrorBoundary from '@/components/ErrorBoundary/APIErrorBoundary';
import UnknownErrorBoundary from '@/components/ErrorBoundary/UnKnownErrorBoudary';
import SomethingWentWrong from '@/components/ErrorPage/SomethingWentWrong';
import { PATH, TRADERS_ROUTES } from '@/constants';
import A11yPage from '@/pages/A11yPage';
import AriaHiddenPage from '@/pages/A11yPage/AriaHiddenPage';
import AriaRolePage from '@/pages/A11yPage/AriaRolePage';
import KeyboardPage from '@/pages/A11yPage/KeyboardPage';
import SemanticPage from '@/pages/A11yPage/SemanticPage';
import HomePage from '@/pages/HomePage';
import SketchPage from '@/pages/SketchPage';
import TradersPage from '@/pages/TradersPage';
import FloatingThemeToggle from '@/pages/TradersPage/components/FloatingThemeToggle';
import GameCompletePage from '@/pages/TradersPage/GameCompletePage';
import GamePage from '@/pages/TradersPage/GamePage';
import RankingPage from '@/pages/TradersPage/RankingPage';
import RoomLobbyPage from '@/pages/TradersPage/RoomLobbyPage';
import RoomWaitingPage from '@/pages/TradersPage/RoomWaitingPage';
import { TradersThemeProvider } from '@/pages/TradersPage/theme/TradersThemeProvider';

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: (
      <UnknownErrorBoundary>
        <APIErrorBoundary>
          <Outlet />
        </APIErrorBoundary>
      </UnknownErrorBoundary>
    ),
    errorElement: <SomethingWentWrong />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PATH.TRADERS,
        element: (
          <TradersThemeProvider>
            <FloatingThemeToggle />
            <Outlet />
          </TradersThemeProvider>
        ),
        children: [
          {
            index: true,
            element: <TradersPage />,
          },
          {
            path: TRADERS_ROUTES.GAME,
            element: <GamePage />,
          },
          {
            path: TRADERS_ROUTES.GAME_COMPLETE,
            element: <GameCompletePage />,
          },
          {
            path: TRADERS_ROUTES.RANKING,
            element: <RankingPage />,
          },
          {
            path: TRADERS_ROUTES.ROOM,
            element: <RoomLobbyPage />,
          },
          {
            path: TRADERS_ROUTES.ROOM_WAITING,
            element: <RoomWaitingPage />,
          },
        ],
      },
      {
        path: PATH.SKETCH,
        element: <SketchPage />,
      },
      {
        path: PATH.A11Y,
        element: <A11yPage />,
      },
      {
        path: PATH.A11Y_SEMANTIC,
        element: <SemanticPage />,
      },
      {
        path: PATH.A11Y_ARIA_ROLE,
        element: <AriaRolePage />,
      },
      {
        path: PATH.A11Y_KEYBOARD,
        element: <KeyboardPage />,
      },
      {
        path: PATH.A11Y_ARIA_HIDDEN,
        element: <AriaHiddenPage />,
      },
      {
        path: '*',
        element: <SomethingWentWrong />,
      },
    ],
  },
]);

const RouteProvider = () => <RouterProvider router={router} />;

export default RouteProvider;
