import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned:", decodedText);

        // Extract dog ID from URL
        const id = decodedText.split("/").pop();

        navigate(`/dog/${id}`);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>📱 Scan Dog QR</h2>
      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
    </div>
  );
};

export default QRScanner;