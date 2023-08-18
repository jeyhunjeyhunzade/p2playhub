import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { io } from "socket.io-client";

import { AppRoutes } from "@app/types/enums";
import Main from "./Main";
import TicTac from "./Tictac";
import Chess from "./Chess";

const PrivateRoute = ({ user }: any) => {
  return user ? <Outlet /> : <Navigate to={AppRoutes.chess} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.main} element={<Main />} />
        <Route path={AppRoutes.tictac} element={<TicTac />} />
        <Route path={AppRoutes.chess} element={<Chess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
