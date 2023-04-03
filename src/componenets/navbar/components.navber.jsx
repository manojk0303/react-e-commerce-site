import React from 'react';
import { Link } from 'react-router-dom';
import './components.navbar.css';
import { auth } from '../../firebase/firebase';

const Navbar = ({ cartCount, setIsLoggedIn }) => {
  const logOut = () => {
    auth.signOut();
    localStorage.removeItem('email');
    localStorage.removeItem('uid');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('orderedItems');
    setIsLoggedIn(false);
  };
  return (
    <nav className="navbar">
      <h1>
        <Link to="/" className="navbar__logo">
          E-commerce Site
        </Link>
      </h1>
      <div className="navbar__links">
        <Link to="/ordered" className="navbar__link">
          <h3 style={{marginTop:"0.9rem"}}>Ordered Items</h3>
        </Link>
        <Link to="/checkout" className="navbar__link">
        <h3 style={{marginTop:"0.9rem"}}>Cart ({cartCount})</h3>
 
        </Link>
        <button onClick={logOut} className="navbar__logout">
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
