import { useEffect } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./App.css";

import Login from "./components/auth/Login";
import AdminDashboard from "./components/AdminDashboard";
import ChangePassword from "./components/auth/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import { setUserDetails } from "./redux/action/authAction";

function App() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state?.auth);
  const user = useSelector((state) => state?.auth);
  // console.log(user)
  console.log(token);
  function PrivateRoute({ path, element }) {
    return isLoggedIn ? (
      element
    ) : (
      // element
      <Navigate to="/login" />
    );
  }

  const verify = async () => {
    try {
      const res = await axios.get(`/api/auth/verifyUserToken/${token}`);
      // console.log(res);
      if (res?.data?.success) {
        // alert("ok")
        dispatch(setUserDetails(res?.data?.data));
        return;
      } else {
        <Navigate to="/login" />;
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Invalid authrization!");
      <Navigate to="/login" />;
    }
  };

  useEffect(() => {
    if (token) {
      verify();
    } else {
      <Navigate to="/login" />;
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin-dashboard"
            element={<PrivateRoute element={<AdminDashboard />} />}
          />
          <Route
            path="/"
            element={<PrivateRoute element={<AdminDashboard />} />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1000}/>

    </div>
  );
}

export default App;
