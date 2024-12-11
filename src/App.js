import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./common/Loader";

// Lazy-loaded components
const Dashboard = lazy(() => import("./components/Dashboard"));
const Auth = lazy(() => import("./components/auth"));
const NotFound = lazy(() => import("./components/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./components/Login"));
const Controls = lazy(() => import("./components/Controls"));
const Api = lazy(() => import("./components/Api"));
const AllDataTable = lazy(() => import("./common/AllDataTable"));
const AddCoins = lazy(() => import("./components/AddCoins"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/api",
          element: <Api />,
        },
        {
          path: "/controls",
          element: <Controls />,
        },
        {
          path: "/addcoins",
          element: <AddCoins />,
        },
        {
          path: "/allDataTable",
          element: <AllDataTable />,
        },
      ],
    },
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
