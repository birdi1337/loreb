import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ItemDetail from './pages/ItemDetail';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/item/:id" element={<ItemDetail />} />

          {isDevelopment && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
