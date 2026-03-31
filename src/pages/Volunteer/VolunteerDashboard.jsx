import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../services/api";

function VolunteerDashboard() {
  const [dogs, setDogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDog, setSelectedDog] = useState(null);
  const [issue, setIssue] = useState("");

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

  const reportIssue = async () => {
    try {
      await API.post(`/dogs/report/${selectedDog._id}`, { message: issue });
      toast.success("Reported successfully");
      setIssue("");
      setSelectedDog(null);
    } catch (err) {
      toast.error("Failed to report issue");
    }
  };

  const priorityOrder = { attention: 1, overdue: 2, dueSoon: 3, none: 4 };
  const processedDogs = [...dogs].filter((dog) => dog.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => (priorityOrder[a.alertStatus] || 4) - (priorityOrder[b.alertStatus] || 4));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
      <input type="text" placeholder="Search dogs..." className="mb-6 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-purple-400" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {processedDogs.map((dog) => (
          <div key={dog._id} className={`rounded-2xl p-5 shadow-md transition hover:shadow-xl ${dog.alertStatus === "overdue" ? "border border-red-300 bg-red-50" : dog.alertStatus === "dueSoon" ? "border border-yellow-300 bg-yellow-50" : dog.alertStatus === "attention" ? "border border-pink-300 bg-pink-50" : "bg-white"}`}>
            <h2 className="mb-2 text-xl font-semibold">{dog.name}</h2>
            <p className="mb-2 text-gray-600">{dog.location}</p>
            <span className={`rounded-full px-3 py-1 text-sm ${dog.vaccinated ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{dog.vaccinated ? "Vaccinated" : "Not Vaccinated"}</span>
            {dog.alertStatus !== "none" && <div className={`mt-2 text-sm font-semibold ${dog.alertStatus === "overdue" ? "text-red-600" : dog.alertStatus === "dueSoon" ? "text-yellow-600" : "text-pink-600"}`}>{dog.alertMessage}</div>}
            <button onClick={() => setSelectedDog(dog)} className="mt-4 w-full rounded-xl bg-pink-500 py-2 text-white transition hover:bg-pink-600">Report Issue</button>
          </div>
        ))}
      </div>
      {selectedDog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-96 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-3 text-xl font-bold">Report Issue - {selectedDog.name}</h2>
            <textarea placeholder="Describe issue..." className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-pink-400" value={issue} onChange={(e) => setIssue(e.target.value)} />
            <div className="flex justify-between">
              <button onClick={() => setSelectedDog(null)} className="rounded-lg bg-gray-300 px-4 py-2">Cancel</button>
              <button onClick={reportIssue} className="rounded-lg bg-pink-500 px-4 py-2 text-white">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerDashboard;
