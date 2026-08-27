import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { OfficerDirectory } from './pages/OfficerDirectory';
import { Vacancies } from './pages/Vacancies';
import { Donation } from './pages/Donation';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="officers" element={<OfficerDirectory />} />
          <Route path="vacancies" element={<Vacancies />} />
          <Route path="donate" element={<Donation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
