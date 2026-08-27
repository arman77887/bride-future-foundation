import React from 'react';

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
          <h2>404 - Page Not Found</h2>
          <p>The requested page could not be found.</p>
          <a href="/en" style={{ color: 'blue', textDecoration: 'underline' }}>Return Home</a>
        </div>
      </body>
    </html>
  );
}
