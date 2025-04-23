  import { Routes, Route } from 'react-router-dom';
  import LoginPage from './pages/LoginPage';
  import RegisterSchool from './pages/RegisterSchool';
  import AllyRegSuccess from './pages/AllyRegSuccess';
  import RegisterAlly from './pages/RegisterAlly';
  import SchoolProfile from './pages/SchoolProfile';
  import AllyProfile from './pages/AllyProfile';
  import EditSchool from './pages/EditSchool';
  import AllyMap from './pages/AllyMap';
  import ListedSchools from './pages/ListedSchools';
  import EditPhysical from './pages/EditPhysical';
  import SignOut from './pages/SignOut';
  import PrivateRoute from './rutas/PrivateRoute';
  import EvidenceTimeline from './pages/EvidenceTimeline';
  import SchoolCard from './pages/SchoolCard';

  function App() {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/register-ally" element={<RegisterAlly />} />
        <Route path="/registration-success" element={<AllyRegSuccess />} />

        {/* ALIADO */}
        <Route path="/aliado/perfil" element={
        <PrivateRoute allowedRoles={['aliado']}>
          <AllyProfile />
        </PrivateRoute>
        } />
        <Route
          path="/aliado/mapa"
          element={
            <PrivateRoute allowedRoles={['aliado']}>
              <AllyMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/listado/escuelas"
          element={
            <PrivateRoute allowedRoles={['aliado']}>
              <ListedSchools />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar/aliado"
          element={
            <PrivateRoute allowedRoles={['aliado']}>
              <EditPhysical />
            </PrivateRoute>
          }
        />

        {/* ESCUELA */}
        <Route
          path="/perfil/escuela"
          element={
            <PrivateRoute allowedRoles={['escuela']}>
              <SchoolProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar/escuela"
          element={
            <PrivateRoute allowedRoles={['escuela']}>
              <EditSchool />
            </PrivateRoute>
          }
        />
        <Route
          path="/aliado/evidencia/:id"
          element={
            <PrivateRoute allowedRoles={['aliado']}>
              <EvidenceTimeline />
            </PrivateRoute>
          }
        />
        <Route
          path="/tarjeta-escuela"
          element={
            <PrivateRoute allowedRoles={['aliado']}>
              <SchoolCard />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<SignOut />} />
        <Route path="/unauthorized" element={<h1>Acceso no autorizado</h1>} />
      </Routes>
    );
  }

  export default App;
