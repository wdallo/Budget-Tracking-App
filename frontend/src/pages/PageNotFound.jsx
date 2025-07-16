const PageNotFound = () => {
  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-3">Looks like you're lost</h2>
      <p className="mb-4 text-muted">
        The page you are looking for is not available!
      </p>
      <a href="/" className="btn btn-primary">
        Go to Home
      </a>
    </div>
  );
};

export default PageNotFound;
