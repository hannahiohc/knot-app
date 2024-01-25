import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { styled, createGlobalStyle } from "styled-components";
import reset from 'styled-reset';
import { auth } from '@/firebase';

import Layout from "@components/layout";
import LoadingScreen from "@components/loading-screen";
import ProtectedRoute from "@components/protected-route";
import Home from "@routes/home";
import Profile from "@routes/profile";
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

const GlobalStyles = createGlobalStyle`
  ${reset};

  :root {
    --color-1: rgb(255, 255, 255);
    --color-2: rgb(243, 243, 243);
    --color-3: rgb(238, 232, 227);
    --color-4: rgb(170, 71, 58);
    --color-5: rgb(255, 173, 91);
    --white: #ffffff;
    --black: #2c2928;
    --brown: #644d45;
    --grey: #9c9493;
    --lightgrey: #eaeaea;
    --sans-serif: 'Poppins', sans-serif;
    --serif: 'DM Serif Display', serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    ::placeholder, &[type="submit"] {
      font-family: var(--sans-serif);
    }
  }

  body {
    background-color: var(--color-3);
    color: var(--black);
    font-family: var(--sans-serif);
    font-size: 14px;
  }

  a {
    text-decoration: none;
    color: var(--black);
  }

  textarea {
    color: var(--black);
    font-family: var(--sans-serif);
    outline: none;
    resize: none;
    border: none;
  }

  button {
    transition: all 350ms ease; 
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

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
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App;
