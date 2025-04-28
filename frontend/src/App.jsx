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
  import ListedSchoolsAdmin from './pages/ListedSchoolAdmin';
  import ListedAllies from './pages/ListedAllies';
  import ListedAlliesAdmin from './pages/ListedAlliesAdmin';
  import EditPhysical from './pages/EditPhysical';
  import SignOut from './pages/SignOut';
  import PrivateRoute from './rutas/PrivateRoute';
  import EvidenceTimeline from './pages/EvidenceTimeline';
  import SchoolCard from './pages/SchoolCard';
  import AdminPage from './pages/PageAdmin';
  import RegisterAdmin from './pages/RegisterAdmin';
  import InformacionUser from './pages/InformacionUser';

  function App() {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/register-ally" element={<RegisterAlly />} />
        <Route path="/registration-success" element={<AllyRegSuccess />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />

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

        {/* Administrador todavia no esta */}
        <Route path="/administrador/perfil" element={
        <PrivateRoute allowedRoles={['administrador']}>
          <AdminPage/>
        </PrivateRoute>
        } />
        <Route
          path="/administrador/escuelas"
          element={
            <PrivateRoute allowedRoles={['administrador']}>
              <ListedSchoolsAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/administrador/aliados"
          element={
            <PrivateRoute allowedRoles={['administrador']}>
              <ListedAlliesAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/administrador/informacion/:identificador/:tipoUsuario"
          element={
            <PrivateRoute allowedRoles={['administrador']}>
              <InformacionUser />
            </PrivateRoute>
          }
        />

        {/* ESCUELA */}
        <Route
          path="/escuela/perfil"
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
        path="/listado/aliados"
        element={
          <PrivateRoute allowedRoles={['escuela']}>
            <ListedAllies />
          </PrivateRoute>
        }
        />

      <Route
        path="/evidencia/:id"
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
