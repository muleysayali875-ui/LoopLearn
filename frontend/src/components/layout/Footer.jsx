import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="page-container">
        <div className="footer-inner">
          {/* Brand & Mission */}
          <div>
            <div className="footer-brand">LoopLearn</div>
            <p className="footer-tagline">
              Pass it on. Learn more. A student-led resource exchange network helping campus
              communities share textbooks, notes, electronics, and academic supplies.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Discover Resources
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="footer-link">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/share" className="footer-link">
                  Share a Resource
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Exchange Notice */}
          <div>
            <h4 className="footer-col-title">Campus Exchange</h4>
            <p style={{ fontSize: '0.88rem', color: '#A9ABA2', lineHeight: '1.6' }}>
              All exchanges and loans are arranged directly between verified students on campus.
              LoopLearn does not process commercial transactions or fees.
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} LoopLearn. Academic Resource Exchange.</span>
          <span>Designed for campus sustainability and collaborative learning.</span>
        </div>
      </div>
    </footer>
  );
};
