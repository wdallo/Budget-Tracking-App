const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <span>
          &copy; {new Date().getFullYear()} Personal Finances App. All rights
          reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
