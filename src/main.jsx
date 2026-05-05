import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const SHEETS = ["RESUMEN", "SCHWAB", "ECO", "IOL"];

function App() {
  const [sheetId, setSheetId] = useState(localStorage.getItem("sheetId") || "");
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  async function loadData() {
    if (!sheetId) return;
    setError("");

    try {
      const loaded = {};

      for (const sheet of SHEETS) {
        const url = `https://opensheet.elk.sh/${sheetId}/${sheet}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("No se pudo leer " + sheet);
        }

        loaded[sheet] = await res.json();
      }

      setData(loaded);
      localStorage.setItem("sheetId", sheetId);
    } catch (e) {
      setError("Error conectando Google Sheets. Revisá nombres de pestañas y permisos.");
    }
  }

  useEffect(() => {
    if (sheetId) loadData();
  }, []);

  const resumen = data.RESUMEN?.[0] || {};
  const schwab = data.SCHWAB || [];
  const eco = data.ECO || [];
  const iol = data.IOL || [];

  const primas = schwab.reduce((acc, r) => acc + Number(r.primaUSD || 0), 0);
  const ecoTotal = eco.reduce((acc, r) => acc + Number(r.valorARS || 0), 0);
  const iolTotal = iol.reduce((acc, r) => acc + Number(r.valorARS || 0), 0);

  const ggal = eco.find((r) => String(r.activo).toUpperCase() === "GGAL");
  const precioGGAL = Number(ggal?.precioARS || 0);

  let señalGGAL = "HOLD";
  if (precioGGAL >= 9500) señalGGAL = "VENDER FUERTE";
  else if (precioGGAL >= 8000) señalGGAL = "VENDER 30%";
  else if (precioGGAL >= 6800) señalGGAL = "VENDER 20%";

  return (
    <div className="app">
      <h1>Tablero Financiero Gabriel</h1>
      <p>Sistema de libertad financiera conectado a Google Sheets.</p>

      <div className="connector">
        <input
          value={sheetId}
          onChange={(e) => setSheetId(e.target.value)}
          placeholder="Pegá aquí el ID de tu Google Sheet"
        />
        <button onClick={loadData}>Actualizar tablero</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        <Card title="Primas Schwab" value={`USD ${primas || resumen.primasMesUSD || 0}`} />
        <Card title="Deuda tarjetas" value={`ARS ${resumen.deudaTarjetasARS || 0}`} />
        <Card title="ECO + IOL" value={`ARS ${ecoTotal + iolTotal}`} />
        <Card title="Señal GGAL" value={señalGGAL} />
      </div>

      <Section title="Schwab - opciones" rows={schwab} />
      <Section title="ECO" rows={eco} />
      <Section title="IOL" rows={iol} />
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

function Section({ title, rows }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="muted">Sin datos cargados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(rows[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
