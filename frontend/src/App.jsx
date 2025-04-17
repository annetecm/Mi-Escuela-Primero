import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterSchool from './pages/RegisterSchool';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleRedirectToRegister = () => {
    setCurrentPage('register-school');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onRegisterSchool={handleRedirectToRegister} />
        
      )}
      {currentPage === 'register-school' && <RegisterSchool />}
    </>
  );
}

export default App;