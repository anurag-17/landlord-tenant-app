import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";
import './App.css';

import Login from "./components/auth/Login";
import AdminDashboard from "./components/AdminDashboard";
import ChangePassword from "./components/auth/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";


function App() {

  function PrivateRoute({ path, element }) {

    const isAuthenticated = JSON.parse(sessionStorage.getItem("sessionToken")) !== null;
  
    return isAuthenticated ? (
      element
    ) : (
      element
      // <Navigate to="/login" />
    );
  }
 
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
      <ToastContainer

      />
    
    </div>
  );
}

export default App;
