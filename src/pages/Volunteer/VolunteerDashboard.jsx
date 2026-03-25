import { useEffect, useState } from "react";
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
      await API.post(`/dogs/report/${selectedDog._id}`, {
        message: issue,
      });
      alert("Reported successfully ✅");
      setIssue("");
      setSelectedDog(null);
    } catch (err) {
      alert("Failed ❌");
    }
  };

  // 🔥 FILTER + SORT (IMPORTANT)
  const priorityOrder = {
    attention: 1,
    overdue: 2,
    dueSoon: 3,
    none: 4,
  };

  const processedDogs = [...dogs]
    .filter((dog) =>
      dog.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      return (
        (priorityOrder[a.alertStatus] || 4) -
        (priorityOrder[b.alertStatus] || 4)
      );
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🙋 Volunteer Dashboard
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search dogs..."
        className="w-full p-3 mb-6 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* DOG LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedDogs.map((dog) => (
          <div
            key={dog._id}
            className={`rounded-2xl p-5 shadow-md hover:shadow-xl transition
              ${
                dog.alertStatus === "overdue"
                  ? "bg-red-50 border border-red-300"
                  : dog.alertStatus === "dueSoon"
                  ? "bg-yellow-50 border border-yellow-300"
                  : dog.alertStatus === "attention"
                  ? "bg-pink-50 border border-pink-300"
                  : "bg-white"
              }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              🐕 {dog.name}
            </h2>

            <p className="text-gray-600 mb-2">📍 {dog.location}</p>

            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                dog.vaccinated
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {dog.vaccinated ? "Vaccinated" : "Not Vaccinated"}
            </span>

            {/* 🚨 ALERT MESSAGE */}
            {dog.alertStatus !== "none" && (
              <div
                className={`mt-2 text-sm font-semibold ${
                  dog.alertStatus === "overdue"
                    ? "text-red-600"
                    : dog.alertStatus === "dueSoon"
                    ? "text-yellow-600"
                    : "text-pink-600"
                }`}
              >
                {dog.alertMessage}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={() => setSelectedDog(dog)}
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition"
            >
              ⚠️ Report Issue
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedDog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-3">
              Report Issue - {selectedDog.name}
            </h2>

            <textarea
              placeholder="Describe issue..."
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setSelectedDog(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={reportIssue}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerDashboard;