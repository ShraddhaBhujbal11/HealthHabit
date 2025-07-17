import React from "react";
import "./Contact.css"; // new CSS file

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2>Contact Us</h2>
        <p className="contact-info">📧 Email: <a href="mailto:support@healthhabit.com">support@healthhabit.com</a></p>
        <p className="contact-info">📞 Phone: <a href="tel:+1234567890">+1‑234‑567‑890</a></p>

        <div className="contact-message">
          <p>We’re here to help! Whether you have a question about features, trials, or anything else — our team is ready to answer all your questions.</p>
        </div>

       <div className="contact-socials">
  <p>Follow us:</p>
  <a href="https://healthhabit.com" target="_blank" rel="noopener noreferrer" className="social-icon">🌐 Website</a> |
  <a href="https://twitter.com/healthhabit" target="_blank" rel="noopener noreferrer" className="social-icon">🐦 Twitter</a> |
  <a href="https://facebook.com/healthhabit" target="_blank" rel="noopener noreferrer" className="social-icon">📘 Facebook</a>
</div>

      </div>
    </div>
  );
}
