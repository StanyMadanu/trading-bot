import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/auth";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Controls from "./components/Controls";
import Api from "./components/Api";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import AllDataTable from "./common/AllDataTable";

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
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/profile",
          element: <Profile />,
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
          path: "/settings",
          element: <Settings />,
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
