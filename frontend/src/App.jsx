import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterSchool from './pages/RegisterSchool';
import AllyRegSuccess from './pages/AllyRegSuccess';
import RegisterAlly from './pages/RegisterAlly'; 

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleRedirectToRegisterSchool = () => {
    setCurrentPage('register-school');
  };
  const handleRedirectToRegisterAlly = () => {
    setCurrentPage('register-ally');
  };

  const handleRegistrationSuccess = () => {
    setCurrentPage('registration-success');
  }



  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onRegisterSchool={handleRedirectToRegisterSchool} 
          onRegisterAlly={handleRedirectToRegisterAlly} // 👈 pásalo como prop
        />
      )}
      {currentPage === 'register-school' && (
        <RegisterSchool onRegistrationSuccess={handleRegistrationSuccess} />
      )}
      {currentPage === 'register-ally' && (
        <RegisterAlly onRegistrationSuccess={handleRegistrationSuccess}/>
      )}
      {currentPage === 'registration-success' && <AllyRegSuccess />}
    </>
  );
}

export default App;