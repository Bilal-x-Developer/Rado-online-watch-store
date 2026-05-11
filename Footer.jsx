import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__overlay"></div>

      <div className="footer__content">
        <div className="footer__brand">
          <h2>Rado</h2>
          <p>Premium Watches For Modern Fashion</p>
        </div>

        <div className="footer__links">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer__contact">
          <h4>Contact</h4>
          <p>Email: info@radostore.com</p>
          <p>Phone: +92 327 0270720</p>
        </div>
      </div>

      <div className="footer__bottom">© Rado is one you trust on</div>
    </footer>
  );
};

export default Footer;
