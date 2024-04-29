import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import { Login } from "./pages/Auth/Login";

export function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/login'} element={<Login />} />
      
      </Routes>

      <ToastContainer />
    </div>
  )
}

