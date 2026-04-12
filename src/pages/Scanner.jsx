import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const normalizeDogId = (value) => value.trim().toUpperCase();

const getScanDestination = (decodedText) => {
  const trimmedValue = decodedText.trim();

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.pathname.includes("/lookup")) {
      const scannedDogId = normalizeDogId(
        parsedUrl.searchParams.get("dogId") || ""
      );

      return scannedDogId
        ? `/lookup?dogId=${encodeURIComponent(scannedDogId)}`
        : "/lookup";
    }

    if (parsedUrl.pathname.includes("/dog/")) {
      const scannedDogId = normalizeDogId(
        parsedUrl.pathname.split("/dog/").pop() || ""
      );

      return scannedDogId ? `/dog/${scannedDogId}` : "";
    }
  } catch (error) {
    // Non-URL QR payloads fall through to direct Dog ID parsing.
  }

  const scannedDogId = normalizeDogId(trimmedValue);
  return scannedDogId ? `/dog/${scannedDogId}` : "";
};

function Scanner() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [dogId, setDogId] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanStatus, setScanStatus] = useState("Starting camera...");
  const scannerRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const qrbox = (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight, 320);
        return {
          width: Math.max(180, Math.floor(minEdge * 0.8)),
          height: Math.max(180, Math.floor(minEdge * 0.8)),
        };
      };

      const onScanSuccess = (decodedText) => {
        if (hasNavigatedRef.current) {
          return;
        }

        const destination = getScanDestination(decodedText);

        if (!destination) {
          setScanError("Scanned QR is not a valid PawTrack code.");
          return;
        }

        hasNavigatedRef.current = true;
        navigate(destination);
      };

      try {
        await scanner.start(
          { facingMode: { ideal: "environment" } },
          {
            fps: 10,
            qrbox,
            aspectRatio: 1,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
          },
          onScanSuccess,
          () => {}
        );

        if (!isMounted) {
          return;
        }

        setScanError("");
        setScanStatus("Point your camera at the PawTrack QR code.");
      } catch (initialError) {
        try {
          const devices = await Html5Qrcode.getCameras();

          if (!devices.length) {
            throw initialError;
          }

          const preferredCamera =
            devices.find((device) =>
              /back|rear|environment/i.test(device.label || "")
            ) || devices[0];

          await scanner.start(
            preferredCamera.id,
            {
              fps: 10,
              qrbox,
              aspectRatio: 1,
              rememberLastUsedCamera: true,
              showTorchButtonIfSupported: true,
              showZoomSliderIfSupported: true,
            },
            onScanSuccess,
            () => {}
          );

          if (!isMounted) {
            return;
          }

          setScanError("");
          setScanStatus("Point your camera at the PawTrack QR code.");
        } catch (fallbackError) {
          console.error(fallbackError);

          if (!isMounted) {
            return;
          }

          setScanStatus("Camera unavailable");
          setScanError(
            "Camera access failed on this device. Allow camera permission and reload the page."
          );
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      hasNavigatedRef.current = false;

      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null;

        scanner
          .stop()
          .catch(() => {})
          .finally(() => {
            scanner.clear().catch(() => {});
          });
      }
    };
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedDogId = normalizeDogId(dogId);

    if (!normalizedDogId) {
      setScanError("Enter a dog ID like DOG-1234.");
      return;
    }

    setScanError("");
    navigate(`/dog/${normalizedDogId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: darkMode
          ? "linear-gradient(180deg, #020617 0%, #0f172a 55%, #111827 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          display: "grid",
          gap: "20px",
        }}
      >
        <div
          style={{
            ...panel,
            color: darkMode ? "#e2e8f0" : "#0f172a",
            background: darkMode
              ? "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))"
              : "linear-gradient(180deg, #ffffff, #f8fafc)",
          }}
        >
          <span style={eyebrow}>DOG LOOKUP</span>
          <h1 style={{ margin: "8px 0 10px", fontSize: "32px" }}>
            Find a PawTrack dog by ID or QR
          </h1>
          <p style={{ color: darkMode ? "#94a3b8" : "#64748b", lineHeight: 1.7 }}>
            Enter a unique dog ID manually or scan the universal PawTrack QR to
            open the lookup flow instantly.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                value={dogId}
                onChange={(event) => setDogId(event.target.value)}
                placeholder="DOG-1234"
                style={input}
              />
              <button type="submit" style={button}>
                Find Dog
              </button>
            </div>
          </form>

          {scanError && (
            <p style={{ color: "#ef4444", marginTop: "12px", fontWeight: "600" }}>
              {scanError}
            </p>
          )}
        </div>

        <div
          style={{
            ...panel,
            color: darkMode ? "#e2e8f0" : "#0f172a",
            background: darkMode
              ? "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))"
              : "linear-gradient(180deg, #ffffff, #f8fafc)",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "14px" }}>Scan QR Code</h2>
          <p
            style={{
              color: darkMode ? "#94a3b8" : "#64748b",
              lineHeight: 1.6,
              marginBottom: "14px",
            }}
          >
            {scanStatus}
          </p>
          <div
            id="reader"
            style={{ width: "100%", minHeight: "320px", overflow: "hidden" }}
          />
        </div>
      </div>
    </div>
  );
}

const panel = {
  padding: "24px",
  borderRadius: "22px",
  boxShadow: "0 18px 45px rgba(15,23,42,0.10)",
};

const eyebrow = {
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#14b8a6",
  fontWeight: "700",
};

const input = {
  flex: "1 1 280px",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};

const button = {
  padding: "14px 20px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #0f766e, #14b8a6)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

export default Scanner;
