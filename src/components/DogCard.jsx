dogs.map((dog) => (
  <div
    key={dog._id}
    className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
  >
    {/* 🐶 Name */}
    <h3 className="text-xl font-bold text-gray-800">
      {dog.name}
    </h3>

    {/* 📍 Location */}
    <p className="text-gray-600 mt-1">
      📍 {dog.location}
    </p>

    {/* ❤️ Health Status */}
    <p
      className={`mt-2 font-semibold ${
        dog.healthStatus === "Healthy"
          ? "text-yellow-600"
          : "text-red-500"
      }`}
    >
      {dog.healthStatus || "Unknown"}
    </p>

    {/* 🔳 QR Code */}
    <Link to={`/dog/${dog._id}`}>
      <img
        src={dog.qrCode}
        alt="QR Code"
        className="w-24 mt-3 cursor-pointer"
      />
    </Link>

    {/* 🔘 Actions */}
    <div className="flex gap-2 mt-4">
      <Link
        to={`/dog/${dog._id}`}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        View
      </Link>

      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
      >
        Edit
      </button>

      <button
        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
      >
        Delete
      </button>
    </div>
  </div>
))