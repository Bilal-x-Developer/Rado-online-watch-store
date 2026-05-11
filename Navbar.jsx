import "./Navbar.css";
import logo from "../assets/image12.png";
import { Link } from "react-router-dom";
import cartIcon from "../assets/carticon.png";

const Navbar = ({ onSearchClick, onCartClick, cartItemCount = 0 }) => {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="logo" />
      </div>

      <nav className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/team">Team</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="navbar__btn">
        <button className="navbar__search-btn" onClick={onSearchClick}>
          Search
        </button>

        <button className="add-to-cart" onClick={onCartClick}>
          <div className="cart-icon-wrapper">
            <img src={cartIcon} alt="cart" className="icon" />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </div>
          <span className="cart-text">Cart</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;