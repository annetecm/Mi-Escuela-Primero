import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterSchool from './pages/RegisterSchool';
import AllyRegSuccess from './pages/AllyRegSuccess';
import RegisterAlly from './pages/RegisterAlly'; 
import SchoolProfile from './pages/SchoolProfile';
import AllyProfile from './pages/AllyProfile';
import EditSchool from './pages/EditSchool';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userType, setUserType] = useState(null); // ❌

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
        onRegisterAlly={handleRedirectToRegisterAlly}
        onLoginSuccess={(tipo) => {
        setUserType(tipo);      
        setCurrentPage(tipo === 'escuela' ? 'school-profile' : 'ally-profile'); 
        }}
      />
      )}
      {currentPage === 'register-school' && (
        <RegisterSchool onRegistrationSuccess={handleRegistrationSuccess} />
      )}
      {currentPage === 'register-ally' && (
        <RegisterAlly onRegistrationSuccess={handleRegistrationSuccess}/>
      )}
      {currentPage === 'registration-success' && <AllyRegSuccess />}
      {currentPage === 'school-profile' && (
          <SchoolProfile onEditClick={() => setCurrentPage('edit-school')} />
        )}
      {currentPage === 'edit-school' && <EditSchool />}
      {currentPage === 'ally-profile' && <AllyProfile />}

    </>
  );
}

export default App;