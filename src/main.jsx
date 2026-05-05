import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <h1>Tablero Financiero Gabriel</h1>
      <p>Sistema de libertad financiera en construcción.</p>

      <div className="grid">
        <Card title="Primas cobradas" value="USD 190" />
        <Card title="Deuda tarjetas" value="ARS 976.000" />
        <Card title="Fondo viaje 50 años" value="Bonos argentinos" />
        <Card title="Objetivo" value="Flujo mensual" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
