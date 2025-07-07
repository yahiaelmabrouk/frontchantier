import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ChantierList from "./components/ChantierList";
import ChantierForm from "./components/ChantierForm";
import ChargesForm from "./components/ChargesForm";
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
