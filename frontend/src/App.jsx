import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterSchool from './pages/RegisterSchool';
import AllyRegSuccess from './pages/AllyRegSuccess';
import ListedSchools from './pages/ListedSchools';
import EvidenceTimeline from './pages/EvidenceTimeline';
import RegisterAlly from './pages/RegisterAlly';

function App() {
  /*
  const [currentPage, setCurrentPage] = useState('login');

  const handleRedirectToRegister = () => {
    setCurrentPage('register-school');
  };

  const handleRegistrationSuccess = () => {
    setCurrentPage('registration-success');
  }

  */

  return (<RegisterSchool />
    /*
    <>
      {currentPage === 'login' && (
        <LoginPage 
        onRegisterSchool={handleRedirectToRegister} />
      )}
      {currentPage === 'register-school' && (
        <RegisterSchool onRegistrationSuccess={handleRegistrationSuccess} />
      )}
      {currentPage === 'registration-success' && <AllyRegSuccess />}
    </>
    */
  );
}

export default App;