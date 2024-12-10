import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/auth"; // You might not need this if Login is the only auth-related component
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />, // Default route should render Login component
    },
    {
      path: "/dashboard",
      element: <Layout />, // Layout should wrap the dashboard and other components
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "*", // For any unmatched routes
      element: <NotFound />,
    },
  ]);

  return(
    <>
      <ToastContainer position="top-right" autoClose={3000}  />
      <RouterProvider router={router} />
    </>
  );
 
    
}

    export default App;
