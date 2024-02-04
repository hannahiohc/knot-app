import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { auth } from '@/firebase';
import './App.css';

import Layout from "@/components/nav/nav";
import LoadingScreen from "@/components/loading/loading";
import ProtectedRoute from "@/components/protected-route";
import Home from "@/routes/home";
import Profile from "@/routes/profile";
import Login from "@routes/login";
import CreateAccount from "@routes/create-account";
import FindPassword from "@routes/find-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  },
  {
    path: "/find-password",
    element: <FindPassword />
  }
]);

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    await auth.authStateReady();
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
    <div className="wrapper">
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </div>
    </>
  )
}

export default App;
