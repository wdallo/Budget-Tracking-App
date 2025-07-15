const Home = () => {
  return (
    <div className="landing-page d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-3 mb-4">Welcome to Personal Finances App</h1>
        <p className="lead mb-5">
          Take control of your finances. Track your expenses, set budgets, and
          achieve your financial goals.
        </p>
        <a href="/budgets" className="btn btn-primary btn-lg mx-2">
          Get Started
        </a>
        <a href="/expenses" className="btn btn-outline-secondary btn-lg mx-2">
          Learn More
        </a>
      </div>
    </div>
  );
};

export default Home;
