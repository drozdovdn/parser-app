import { Auth } from 'pages/auth';
import { Signin } from 'pages/auth/signin';
import { Parser } from 'pages/parser';
import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';

import { Signup } from '../pages/auth/signup';

const AuthRedirectGuard = () => {
  const isAuthenticated = Boolean(localStorage.getItem('id'));
  return isAuthenticated ? <Navigate to="/parser" replace /> : <Outlet />;
};

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* обёртка для /auth */}
      <Route path="auth" element={<AuthRedirectGuard />}>
        <Route element={<Auth />}>
          <Route index element={<Navigate to="signin" replace />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>

      <Route path="parser" element={<Parser />} />
    </Routes>
  );
};
