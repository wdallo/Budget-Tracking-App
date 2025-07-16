import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Loading from "../components/Loading";

function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(""); // Add alert state
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const validate = (vals) => {
    const errs = {};
    if (!vals.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(vals.email)) {
      errs.email = "Email is invalid";
    }
    if (!vals.password) {
      errs.password = "Password is required";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await apiClient.post("/api/auth/login", values);
      const userData = response.data;
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // The backend returns 200
      if (response.status === 200 && response.data) {
        navigate("/");
      } else {
        setAlert(response.data?.msg || "Login Failled.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "An error occurred. Please try again.";

      setAlert(errorMessage);
    } finally {
      window.dispatchEvent(new Event("authChanged"));
      setLoading(false);
      // navigate("/");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      {loading && <Loading />}

      <Form
        className="p-4 rounded shadow"
        style={{ minWidth: 350, background: "#fff" }}
        method="POST"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-center">Sign In</h2>
        {alert && (
          <div className="alert alert-danger w-100 text-center" role="alert">
            {alert}
          </div>
        )}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
            autoComplete="on"
            autoFocus
            value={values.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
            value={values.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          <a href="#" className="small text-primary text-decoration-none">
            Forgot password?
          </a>
        </div>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </div>
  );
}
export default Login;
