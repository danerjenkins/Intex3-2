// PolicyPage.tsx
import React from 'react';

export const PolicyPage: React.FC = () => (
  <div className="min-vh-100 p-4 p-md-5">
    <h1 className="h2 fw-bold mb-4">Privacy Policy</h1>
    <p>
      At CineNiche ("we," "us," "our"), we are committed to protecting your
      privacy and ensuring the security of your personal information. This
      Privacy Policy outlines how we collect, use, and safeguard your data when
      you access and use our streaming service.
    </p>
    <h4>1. Information We Collect</h4>
    <p>When you sign up for our service, we may collect:</p>
    <ul>
      <li>
        <strong>Personal Information:</strong> Such as your name, email address,
        and payment details (processed securely by third-party providers).
      </li>
      <li>
        <strong>Login Credentials:</strong> Your password is stored as a SHA-256
        hash for enhanced security.
      </li>
      <li>
        <strong>Usage Data:</strong> This includes information about your
        interactions with our platform (e.g., content viewed, ratings provided).
      </li>
    </ul>
    <h4>2. How We Use Your Information</h4>
    <p>Your data is used to:</p>
    <ul>
      <li>
        Deliver personalized recommendations through our recommender pipeline
        based on your ratings.
      </li>
      <li>Maintain and enhance the functionality of our platform.</li>
      <li>
        Communicate important updates regarding your account or our service.
      </li>
    </ul>
    <h4>3. Data Security</h4>
    <p>
      We implement advanced security measures to protect your information,
      including encryption protocols and secure storage practices. Passwords are
      never stored in plaintext and are hashed using SHA-256 for security.
    </p>
    <h4>4. Third-Party Services</h4>
    <p>
      We may share information with trusted third-party services for processing
      payments or analyzing data to improve user experiences. These entities
      adhere to stringent privacy and security standards.
    </p>
    <h4>5. User Rights</h4>
    <p>You have the right to:</p>
    <ul>
      <li>Access, update, or delete your personal information.</li>
      <li>Opt out of data collection for non-essential purposes.</li>
    </ul>
    <h4>6. Cookies</h4>
    <p>
      We use cookies to improve functionality and analyze user behavior. You may
      modify your browser settings to control cookie usage.
    </p>
    <h4>7. Updates to the Privacy Policy</h4>
    <p>
      We may revise this Privacy Policy from time to time to reflect changes in
      our practices. We encourage you to review it periodically.
    </p>
    <h4>Contact Us</h4>{' '}
    <p>
      If you have any questions about this Privacy Policy or your personal data,
      please reach out to us at <strong>dontemailus@cineniche.com</strong>.
    </p>
  </div>
);
