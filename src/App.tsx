import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BrigadasList from './components/BrigadasList';
import BrigadaForm from './components/BrigadaForm';
import BrigadaCompleteForm from './components/BrigadaCompleteForm';
import BrigadaDetails from './components/BrigadaDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brigadas" element={<BrigadasList />} />
          <Route path="/brigadas/nueva" element={<BrigadaForm />} />
          <Route path="/brigadas/editar/:id" element={<BrigadaForm />} />
          <Route path="/brigadas/completa" element={<BrigadaCompleteForm />} />
          <Route path="/brigadas/editar-completa/:id" element={<BrigadaCompleteForm />} />
          <Route path="/brigadas/:id" element={<BrigadaDetails />} />
          <Route path="/equipamiento" element={<div className="text-center py-12"><h2 className="text-xl font-semibold">Equipamiento - Próximamente</h2></div>} />
          <Route path="/catalogos" element={<div className="text-center py-12"><h2 className="text-xl font-semibold">Catálogos - Próximamente</h2></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
