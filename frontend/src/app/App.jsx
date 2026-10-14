import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { AppRouter } from './router.jsx';
import '../styles/global.css';
import '../styles/components.css';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <AppRouter />
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
