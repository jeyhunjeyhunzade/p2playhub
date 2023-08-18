import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppRoutes } from "@app/types/enums";
import Main from "./Main";
import TicTac from "./Tictac";
import Chess from "./Chess";
import { AppContextShape } from "@app/types/types";

export const AppContext = createContext<AppContextShape | null>(null);

const App = () => {
  const [userName, setUserName] = useState("");
  const [isRoomActive, setIsRoomActive] = useState(false);

  return (
    <AppContext.Provider
      value={{ userName, setUserName, isRoomActive, setIsRoomActive }}
    >
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.main} element={<Main />} />
          <Route path={AppRoutes.tictac} element={<TicTac />} />
          <Route path={AppRoutes.chess} element={<Chess />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
