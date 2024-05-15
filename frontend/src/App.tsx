import { Route, Routes } from "react-router-dom";
import { Register } from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import { Login } from "./pages/Auth/Login";
import { Todos } from "./pages/todos/Todos";
import { IsVerifiedAccountHook } from "./hooks/IsVerifiedAccountHook";
import { VerifiedAccount } from "./pages/Auth/VerifiedAccount";
import { ChangePassword } from "./pages/Auth/ChangePassword";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { Navbar } from "./components/utils/Navbar";
import { ProfilePage } from "./pages/Auth/ProfilePage";

export function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path={'/register'} element={<Register />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/verified'} element={<VerifiedAccount />} />
        <Route path={'/change-password'} element={<ChangePassword />} />
        <Route path={'/forget-password'} element={<ForgetPassword />} />
        <Route path={'/reset-password'} element={<ResetPassword />} />
        <Route path={'/profile'} element={<ProfilePage />} />

        <Route element={<IsVerifiedAccountHook />} >
          <Route path={'/'} element={<Todos />} />
        </Route>
      </Routes>

      <ToastContainer />
    </div>
  )
}

