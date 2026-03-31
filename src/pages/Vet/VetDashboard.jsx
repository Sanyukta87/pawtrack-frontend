import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../services/api";

function VetDashboard() {
  const [dogs, setDogs] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const res = await API.get("/dogs");
      setDogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHealthRecord = async (dogId) => {
    try {
      await API.post(`/health/${dogId}`, { note });
      toast.success("Record added successfully");
      setNote("");
    } catch (err) {
      toast.error("Failed to add record");
    }
  };

  return (
    <div style={container}>
      <h1>Vet Dashboard</h1>
      {dogs.map((dog) => (
        <div key={dog._id} style={card}>
          <p><b>{dog.name}</b></p>
          <input type="text" placeholder="Enter health note" value={note} onChange={(e) => setNote(e.target.value)} style={input} />
          <button onClick={() => addHealthRecord(dog._id)}>Add Record</button>
        </div>
      ))}
    </div>
  );
}

const container = { padding: "20px" };
const card = { padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "8px" };
const input = { padding: "5px", marginRight: "10px" };

export default VetDashboard;
