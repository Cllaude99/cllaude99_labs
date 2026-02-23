import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';

import APIErrorBoundary from '@/components/ErrorBoundary/APIErrorBoundary';
import UnknownErrorBoundary from '@/components/ErrorBoundary/UnKnownErrorBoudary';
import SomethingWentWrong from '@/components/ErrorPage/SomethingWentWrong';
import { PATH } from '@/constants';
import A11yPage from '@/pages/A11yPage';
import AriaHiddenPage from '@/pages/A11yPage/AriaHiddenPage';
import AriaRolePage from '@/pages/A11yPage/AriaRolePage';
import KeyboardPage from '@/pages/A11yPage/KeyboardPage';
import SemanticPage from '@/pages/A11yPage/SemanticPage';
import HomePage from '@/pages/HomePage';
import SketchPage from '@/pages/SketchPage';
import TradersPage from '@/pages/TradersPage';
import AuthCallbackPage from '@/pages/TradersPage/AuthCallbackPage';
import GameCompletePage from '@/pages/TradersPage/GameCompletePage';
import GamePage from '@/pages/TradersPage/GamePage';
import RankingPage from '@/pages/TradersPage/RankingPage';
import RoomLobbyPage from '@/pages/TradersPage/RoomLobbyPage';
import RoomWaitingPage from '@/pages/TradersPage/RoomWaitingPage';

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
        element: <TradersPage />,
      },
      {
        path: PATH.TRADERS_GAME,
        element: <GamePage />,
      },
      {
        path: PATH.TRADERS_GAME_COMPLETE,
        element: <GameCompletePage />,
      },
      {
        path: PATH.TRADERS_RANKING,
        element: <RankingPage />,
      },
      {
        path: PATH.TRADERS_AUTH_CALLBACK,
        element: <AuthCallbackPage />,
      },
      {
        path: PATH.TRADERS_ROOM,
        element: <RoomLobbyPage />,
      },
      {
        path: PATH.TRADERS_ROOM_WAITING,
        element: <RoomWaitingPage />,
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
