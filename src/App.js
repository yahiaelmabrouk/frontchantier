import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ChantierList from "./components/ChantierList";
import ChantierForm from "./components/ChantierForm";
import ChargesForm from "./components/ChargesForm";
import SalarieForm from "./components/SalarieForm";
import SalarieList from "./components/SalarieList";
import FournisseurForm from "./components/FournisseurForm";
import FournisseurList from "./components/FournisseurList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chantiers" element={<ChantierList />} />
            <Route path="/add" element={<ChantierForm />} />
            <Route path="/edit/:id" element={<ChantierForm />} />
            <Route path="/charges/:id" element={<ChargesForm />} />
            <Route path="/salaries" element={<SalarieList />} />
            <Route path="/salaries/add" element={<SalarieForm />} />
            <Route path="/fournisseurs" element={<FournisseurList />} />
            <Route path="/fournisseurs/add" element={<FournisseurForm />} />
            <Route
              path="/fournisseurs/edit/:id"
              element={<FournisseurForm />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
