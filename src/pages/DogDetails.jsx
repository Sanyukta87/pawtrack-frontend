import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function DogDetails() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [dog, setDog] = useState(null);
  const [report, setReport] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

  const fetchDog = async () => {
    try {
      const res = await API.get(`/api/dogs/${id}`);
      setDog(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDog();
  }, [id]);

  // 🚨 REPORT
  const handleReport = async () => {
    if (!report) return alert("Enter something");

    try {
      await API.post(`/api/dogs/report/${id}`, { message: report });
      alert("Reported successfully 🚨");
      setReport("");
      fetchDog();
    } catch (err) {
      alert("Error submitting report");
    }
  };

  // 🏥 HEALTH RECORD
  const handleAddRecord = async () => {
    if (!treatment) return alert("Enter treatment");

    try {
      await API.post(`/api/dogs/health/${id}`, {
        treatment,
        notes,
        type: "treatment" // default
      });

      alert("Health record added 🏥");
      setTreatment("");
      setNotes("");
      fetchDog();
    } catch (err) {
      alert("Error");
    }
  };

  if (!dog) return <h2>Loading...</h2>;

  // 🚨 STATUS LOGIC
  let status = "safe";

  if (!dog.nextVaccinationDate) {
    status = "no-data";
  } else {
    const diff =
      (new Date(dog.nextVaccinationDate) - new Date()) /
      (1000 * 60 * 60 * 24);

    if (diff < 0) status = "overdue";
    else if (diff <= 7) status = "due-soon";
  }

  const statusColor =
    status === "overdue"
      ? "#ef4444"
      : status === "due-soon"
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f7fa",
        color: darkMode ? "white" : "black",
        padding: "20px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1 style={{ textAlign: "center", color: "#6c5ce7" }}>
        🐶 Dog Details
      </h1>

      <div style={card}>
        <h2 style={{ color: "#6c5ce7" }}>{dog.name}</h2>

        <p>📍 {dog.location}</p>
        <p>🎨 {dog.color}</p>
        <p>👤 {dog.gender}</p>

        {/* 🚨 STATUS */}
        <div style={{ marginTop: "10px" }}>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: statusColor,
              color: "white",
              fontWeight: "500"
            }}
          >
            {status.toUpperCase()}
          </span>
        </div>

        <p style={{ marginTop: "8px" }}>
          Next Vaccination:{" "}
          {dog.nextVaccinationDate
            ? new Date(dog.nextVaccinationDate).toDateString()
            : "No data"}
        </p>

        {/* QR */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          {dog.qrCode && (
            <img src={dog.qrCode} alt="QR Code" width="140" />
          )}
        </div>
      </div>

      {/* 🚨 REPORT */}
      <div style={card}>
        <h3>🚨 Report Issue</h3>

        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Describe issue..."
          style={input}
        />

        <button onClick={handleReport} style={btn}>
          Submit Report
        </button>
      </div>

      {/* 📋 REPORTS */}
      <div style={card}>
        <h3>📋 Reports</h3>

        {dog.reports?.length > 0 ? (
          dog.reports.map((r, i) => (
            <div key={i} style={listItem}>
              ⚠️ {r.message}
            </div>
          ))
        ) : (
          <p>No reports</p>
        )}
      </div>

      {/* 🏥 ADD HEALTH */}
      <div style={card}>
        <h3>🏥 Add Health Record</h3>

        <input
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          placeholder="Treatment"
          style={input}
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          style={input}
        />

        <button onClick={handleAddRecord} style={btn}>
          Add Record
        </button>
      </div>

      {/* 📜 HEALTH HISTORY */}
      <div style={card}>
        <h3>📜 Health History</h3>

        {dog.healthRecords?.length > 0 ? (
          dog.healthRecords
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((rec, i) => (
              <div key={i} style={listItem}>
                💊 <strong>{rec.treatment}</strong>

                {rec.type === "vaccination" && (
                  <>
                    <p>
                      💉 {rec.vaccinationDate
                        ? new Date(rec.vaccinationDate).toDateString()
                        : "-"}
                    </p>
                    <p>
                      📅 Next: {rec.nextDueDate
                        ? new Date(rec.nextDueDate).toDateString()
                        : "-"}
                    </p>
                  </>
                )}

                {rec.notes && <p>📝 {rec.notes}</p>}
              </div>
            ))
        ) : (
          <p>No records</p>
        )}
      </div>
    </div>
  );
}

/* STYLES */
const card = {
  maxWidth: "500px",
  margin: "20px auto",
  padding: "20px",
  borderRadius: "14px",
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const btn = {
  marginTop: "10px",
  padding: "10px",
  width: "100%",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const listItem = {
  marginTop: "10px",
  padding: "10px",
  borderBottom: "1px solid #eee"
};

export default DogDetails;


