import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import API from "../services/api";

const normalizeDogId = (value) => value.trim().toUpperCase();

const getPlaceNameFromAddress = (address = {}) =>
  [
    address.road,
    address.suburb,
    address.neighbourhood,
    address.city_district,
    address.city,
    address.town,
    address.village,
    address.state_district,
  ]
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

const formatLookupDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "Not available";

function Lookup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dogId, setDogId] = useState(searchParams.get("dogId") || "");
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [locationReady, setLocationReady] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [positionData, setPositionData] = useState(null);
  const loggedDogIdsRef = useRef(new Set());

  useEffect(() => {
    const queryDogId = normalizeDogId(searchParams.get("dogId") || "");

    if (!queryDogId) {
      return;
    }

    setDogId(queryDogId);
    fetchDog(queryDogId);
  }, []);

  const fetchDog = async (nextDogId) => {
    setLoading(true);
    setError("");
    setDog(null);
    setPlaceName("");
    setLocationMessage("");
    setLocationReady(false);
    setPositionData(null);

    try {
      const response = await API.get(`/api/dogs/public/${nextDogId}`);
      setDog(response.data);
    } catch (errorResponse) {
      setError(
        errorResponse.response?.data?.msg ||
          "Dog not found. Please check the Dog ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedDogId = normalizeDogId(dogId);

    if (!normalizedDogId) {
      setError("Enter the Dog ID printed below the QR code.");
      setDog(null);
      return;
    }

    setDogId(normalizedDogId);
    setSearchParams({ dogId: normalizedDogId });
    await fetchDog(normalizedDogId);
  };

  useEffect(() => {
    if (!dog?.dogId || loggedDogIdsRef.current.has(dog.dogId)) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage("Enter the area or street name to share where this dog was seen.");
      return;
    }

    let isActive = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isActive) {
          return;
        }

        setPositionData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationReady(true);
        setLocationMessage("Confirm the area or street name, then share the last seen location.");

        try {
          let resolvedPlaceName = "";

          try {
            const reverseResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                position.coords.latitude
              )}&lon=${encodeURIComponent(position.coords.longitude)}&zoom=18&addressdetails=1`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (reverseResponse.ok) {
              const reverseData = await reverseResponse.json();
              resolvedPlaceName =
                getPlaceNameFromAddress(reverseData.address) ||
                reverseData.display_name ||
                "";
            }
          } catch (reverseError) {
            console.error(reverseError);
          }

          if (isActive && resolvedPlaceName) {
            setPlaceName(resolvedPlaceName);
            setLocationMessage("Area detected. Tap share to save it.");
          }
        } catch (locationError) {
          console.error(locationError);
        }
      },
      () => {
        if (isActive) {
          setLocationReady(false);
          setLocationMessage("Location access skipped. You can still look up the dog, but last seen will not be shared.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    return () => {
      isActive = false;
    };
  }, [dog]);

  const handleShareLastSeen = async () => {
    if (!dog?.dogId || !positionData) {
      return;
    }

    const normalizedPlaceName = placeName.trim();

    if (!normalizedPlaceName) {
      setLocationMessage("Enter an area or street name before sharing.");
      return;
    }

    setSharingLocation(true);

    try {
      await API.post("/api/dogs/last-seen", {
        dogId: dog.dogId,
        placeName: normalizedPlaceName,
        latitude: positionData.latitude,
        longitude: positionData.longitude,
        timestamp: new Date().toISOString(),
      });

      loggedDogIdsRef.current.add(dog.dogId);
      setLocationMessage(`Last seen location shared: ${normalizedPlaceName}.`);
    } catch (locationError) {
      console.error(locationError);
      setLocationMessage("Could not share last seen right now. Please try again.");
    } finally {
      setSharingLocation(false);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        <Card className="border-sky-100/80 bg-white/92 p-5 sm:p-7">
          <span className="section-chip">Public Lookup</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a PawTrack dog
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Scan the universal QR, then enter the Dog ID printed on the tag to
            view basic details.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Dog ID
              </span>
              <input
                autoComplete="off"
                autoFocus
                className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-4 text-base text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                inputMode="text"
                onChange={(event) => setDogId(event.target.value)}
                placeholder="DOG-001"
                value={dogId}
              />
            </label>

            <Button
              className="w-full justify-center py-4 text-base"
              loading={loading}
              type="submit"
            >
              Look Up Dog
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}
        </Card>

        {loading && (
          <Card className="border-slate-200/70 bg-white/90 p-5 text-sm text-slate-500">
            Loading dog details...
          </Card>
        )}

        {dog && (
          <Card className="space-y-4 border-emerald-100/80 bg-white/92 p-5 sm:p-7">
            <div>
              <span className="section-chip">Dog Details</span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {dog.dogId}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {dog.name}
              </h2>
            </div>

            <LookupField label="Dog ID" value={dog.dogId} />
            <LookupField
              label="Last Seen Location"
              value={dog.lastSeenLocation || "Not available"}
            />
            <LookupField
              label="Vaccination Status"
              value={dog.vaccinationStatusLabel}
            />
            <LookupField
              label="Neutering Status"
              value={dog.neuteringStatusLabel}
            />
            <LookupField
              label="Important Notes"
              value={dog.notes || "No notes available"}
            />
            <LookupField
              label="Last Shared Update"
              value={formatLookupDate(dog.lastSeenTimestamp)}
            />

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                Health Records
              </p>
              {dog.healthRecords?.length ? (
                <div className="mt-3 space-y-3">
                  {dog.healthRecords.map((record, index) => (
                    <div
                      className="rounded-2xl border border-slate-200/70 bg-white/90 p-4"
                      key={`${record.createdAt || index}-${record.type}`}
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {record.type === "vaccination"
                          ? "Vaccination"
                          : record.treatment || "Treatment"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {record.notes || "No additional notes"}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Recorded:{" "}
                        {formatLookupDate(
                          record.vaccinationDate || record.createdAt
                        )}
                      </p>
                      {record.nextDueDate && (
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Next due: {formatLookupDate(record.nextDueDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No public health records available yet.
                </p>
              )}
            </div>

            {locationReady && !loggedDogIdsRef.current.has(dog.dogId) && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                  Last Seen Place
                </p>
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  onChange={(event) => setPlaceName(event.target.value)}
                  placeholder="Street, area, or landmark"
                  value={placeName}
                />
                <div className="mt-3">
                  <Button
                    className="w-full justify-center"
                    loading={sharingLocation}
                    onClick={handleShareLastSeen}
                    type="button"
                  >
                    Share Last Seen
                  </Button>
                </div>
              </div>
            )}

            {locationMessage && (
              <p className="text-xs font-medium text-slate-500">{locationMessage}</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function LookupField({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default Lookup;
