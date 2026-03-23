import { useState, useEffect } from "react";

function App() {
  const [inputs, setInputs] = useState({
    ot: "",
    rf: "",
    mca: "",
    pfa: "",
    ca: "",
  });

  const [result, setResult] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [history, setHistory] = useState([]);
  const [dark, setDark] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.id]: e.target.value,
    });
  };

  // Auto calculation
  useEffect(() => {
    calculateSMV();
  }, [inputs]);

  const validate = () => {
    let err = {};

    if (!inputs.ot) err.ot = true;
    if (!inputs.rf) err.rf = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const calculateSMV = () => {
    if (!validate()) {
      setResult(null);
      return;
    }

    const { ot, rf, mca, pfa, ca } = inputs;

    const basicTime = (ot * rf) / 100;
    const allowances = Number(mca || 0) + Number(pfa || 0) + Number(ca || 0);

    const smv = basicTime + allowances;

    setResult(smv.toFixed(2));

    setBreakdown({
      basicTime: basicTime.toFixed(2),
      allowances: allowances.toFixed(2),
    });

    // Save history
    setHistory((prev) => [
      {
        smv: smv.toFixed(2),
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <h1 className="marquee">
        <span>SMV Calculation • Industrial Tool • Live Analytics •</span>
      </h1>

      {/* Toggle */}
      <button className="toggle" onClick={() => setDark(!dark)}>
        {dark ? "☀ Light" : "🌙 Dark"}
      </button>

      <div className="container">
        <label>Observe Time</label>
        <input
          id="ot"
          type="number"
          onChange={handleChange}
          className={errors.ot ? "error" : ""}
        />

        <label>Rating</label>
        <input
          id="rf"
          type="number"
          onChange={handleChange}
          className={errors.rf ? "error" : ""}
        />

        <label>M/C Allowance</label>
        <input id="mca" type="number" onChange={handleChange} />

        <label>Fatigue</label>
        <input id="pfa" type="number" onChange={handleChange} />

        <label>Contingency</label>
        <input id="ca" type="number" onChange={handleChange} />

        {/* Result */}
        <div className={`result ${result ? "show" : ""}`}>
          {result ? `SMV: ${result}` : "Enter values"}
        </div>

        {/* Breakdown */}
        {breakdown && (
          <div className="breakdown">
            <p>Basic Time: {breakdown.basicTime}</p>
            <p>Allowances: {breakdown.allowances}</p>
          </div>
        )}

        {/* History */}
        <div className="history">
          <h3>History</h3>
          {history.map((item, index) => (
            <div key={index} className="history-item">
              SMV: {item.smv} <span>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
