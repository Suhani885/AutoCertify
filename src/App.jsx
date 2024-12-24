import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Cert from "./Pages/Cert";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Cert />} />
      </Routes>
    </>
  );
}

export default App;
