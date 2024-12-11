import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { getJwt } from "../services/mainService";

const Layout = () => {

  const protectedRoute = ()=>{
    const jwt = getJwt();
        if(!jwt){
          return window.location('/')
        }
  }

  

  return (
    <>
      <Header />
      <main className="container-fluid">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
