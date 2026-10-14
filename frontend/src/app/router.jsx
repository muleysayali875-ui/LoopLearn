import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DiscoverPage } from '../pages/DiscoverPage.jsx';
import { ResourceDetailsPage } from '../pages/ResourceDetailsPage.jsx';
import { CreateResourcePage } from '../pages/CreateResourcePage.jsx';
import { MyListingsPage } from '../pages/MyListingsPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DiscoverPage />} />
      <Route path="/resources/:id" element={<ResourceDetailsPage />} />
      <Route path="/share" element={<CreateResourcePage />} />
      <Route path="/my-listings" element={<MyListingsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
