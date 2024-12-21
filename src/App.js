import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./common/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./basic/PublicRoute"; // Add PublicRoute
import CronSettings from "./common/CronSettings";
import MakeAnAdmin from "./common/MakeAnAdmin";

// Lazy-loaded components
const Dashboard = lazy(() => import("./components/Dashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./components/Login"));
const Controls = lazy(() => import("./components/Controls"));
const Api = lazy(() => import("./components/Api"));
const AllDataTable = lazy(() => import("./common/AllDataTable"));
const AddCoins = lazy(() => import("./components/AddCoins"));

function App() {
  const router = createBrowserRouter([
    // Public Route: Login Page
    {
      path: "/",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    // Protected Routes: Only accessible if JWT exists
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/api", element: <Api /> },
        { path: "/controls", element: <Controls /> },
        { path: "/addcoins", element: <AddCoins /> },
        { path: "/allDataTable", element: <AllDataTable /> },
        { path: "/cronsetting", element: <CronSettings /> },
        { path: "/makeadmin", element: <MakeAnAdmin /> },
      ],
    },
    // Fallback route for unmatched paths
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
