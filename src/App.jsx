import React from 'react';
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { PublicRoutes, PrivateRoutes } from './models/routes';
import { AuthGuard } from './guards/auth.guard';
import RoutesWithNotFound from './utils/routes-with-not-found';
import RootPage from './pages/private/root-page/RootPage';
import { Login } from './pages/public/Login/Login';
import { EditorProvider } from './context/EditorContext';

function App() {
  return (
    <Router>
      <EditorProvider>
        <RoutesWithNotFound>
          <Route path="/" element={<Navigate to={`/${PrivateRoutes.CRM}`} replace />} />
          <Route path={`/${PublicRoutes.LOGIN}`} element={<Login />} />
          <Route element={<AuthGuard privateValidation={true} />}>
            <Route path={`/${PrivateRoutes.CRM}`} element={<RootPage />} />
          </Route>
        </RoutesWithNotFound>
      </EditorProvider>
    </Router>
  );
}

export default App; 