import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import { Login } from "./pages/Auth/Login";
import { Todos } from "./pages/todos/Todos";
import { IsVerifiedAccountHook } from "./hooks/IsVerifiedAccountHook";
import { VerifiedAccount } from "./pages/Auth/VerifiedAccount";
import { ChangePassword } from "./pages/Auth/ChangePassword";

export function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/login'} element={<Login />} />

        <Route element={<IsVerifiedAccountHook />} >
          <Route path={'/todos'} element={<Todos />} />
        </Route>

        <Route path={'/verified'} element={<VerifiedAccount />} />
        <Route path={'/change-password'} element={<ChangePassword />} />
        

      </Routes>

      <ToastContainer />
    </div>
  )
}

