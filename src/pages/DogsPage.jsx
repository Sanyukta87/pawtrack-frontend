import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function DogsPage() {
  const [dogs, setDogs] = useState([]);

  // 📥 Fetch all dogs
  const fetchDogs = async () => {
    try {
      const res = await API.get("/api/dogs");
      console.log("DOG DATA 👉", res.data); // 👈 debug
      setDogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  // 🗑 Delete function
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/dogs/${id}`);
      setDogs(dogs.filter((dog) => dog._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🐶 Dog Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dogs.map((dog) => (
          <div
            key={dog._id}
            className="bg-white rounded-xl shadow-md p-4"
          >
            <h2 className="text-xl font-semibold">{dog.name}</h2>
            <p className="text-gray-600">📍 {dog.location}</p>

            {/* QR */}
            {dog.qrCode && (
              <img src={dog.qrCode} alt="QR" className="w-24 mt-3" />
            )}

            <div className="flex gap-2 mt-4">
              <Link
                to={`/dog/${dog._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                View
              </Link>

              <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Edit
              </button>

              <button
                onClick={() => handleDelete(dog._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DogsPage;
