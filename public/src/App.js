import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registers from "./pages/Registers";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/" element={<Chat />} />
        </Routes>{" "}
      </BrowserRouter>
    </div>
  );
}

export default App;
