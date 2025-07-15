import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/Layout";

/// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/// API CONTROL
import {
  setupAxiosInterceptors,
  setNavigateFunction,
} from "./utils/axiosInterceptors";
import { setApiClientNavigate } from "./utils/apiClient";

function AppWithNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors();
    setNavigateFunction(navigate);
    setApiClientNavigate(navigate);
    console.log("🔧 Both global and apiClient interceptors configured");
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<>error 404</>} />
      </Routes>
    </Layout>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppWithNavigate />
    </BrowserRouter>
  );
}
export default App;
