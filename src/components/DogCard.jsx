dogs.map((dog) => (
  <div
    key={dog._id}
    style={{
      border: "1px solid black",
      padding: "15px",
      margin: "15px",
    }}
  >
    {/* 👇 ADD THIS */}
    <h3>Name: {dog.name}</h3>
    <p>Location: {dog.location}</p>

    {/* 👇 QR CLICKABLE */}
    <Link to={`/dog/${dog._id}`}>
      <img src={dog.qrCode} alt="QR Code" width="120" />
    </Link>
  </div>
))