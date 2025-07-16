import { useState } from "react";
import apiClient from "../utils/apiClient";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../components/Loading";

function Register() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState(""); // Add alert state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Frontend validation
    if (
      !form.userName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setAlert("Please fill all the fields.");
      return;
    }
    // Username validation: only letters, numbers, underscores, hyphens, spaces, 2-200 chars
    const usernameRegex = /^[A-Za-z0-9_\-\s]{2,200}$/;
    if (!usernameRegex.test(form.userName)) {
      setAlert(
        "Username can only contain letters, numbers, spaces, underscores, and hyphens, and must be 2-200 characters long."
      );
      return;
    }
    if (form.userName.length > 200) {
      setAlert("Username must be at most 200 characters.");
      return;
    }
    if (!form.email.includes("@")) {
      setAlert("Please enter a valid email address.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setAlert("Passwords do not match.");
      return;
    }

    try {
      const response = await apiClient.post(`/api/auth/register`, {
        userName: form.userName,
        email: form.email,
        password: form.password,
      });

      // The backend returns 201
      if (response.status === 201 && response.data) {
        setAlert("Registration successful!");
        setForm({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setAlert(response.data?.message || "User registration failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";

      setAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      {" "}
      {loading && <Loading />}
      <Form
        className="p-4 rounded shadow"
        style={{ minWidth: 350, background: "#fff" }}
        method="POST"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-center">Register</h2>
        {alert && (
          <div className="alert alert-warning" role="alert">
            {alert}
          </div>
        )}
        <Form.Group className="mb-3" controlId="UserName">
          <Form.Label>UserName</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            placeholder="Enter UserName"
            autoFocus
            value={form.userName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
            value={form.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            type="password"
            placeholder="Password"
            autoComplete="off"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicTerms">
          <Form.Check
            type="checkbox"
            label={
              <>
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
              </>
            }
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </div>
  );
}

export default Register;
