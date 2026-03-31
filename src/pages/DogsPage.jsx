import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const getDogRouteId = (dog) => dog.dogId || dog._id;

function DogsPage() {
  const [dogs, setDogs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogs = async () => {
      const response = await API.get("/api/dogs");
      setDogs(response.data);
    };

    fetchDogs();
  }, []);

  const filteredDogs = useMemo(
    () =>
      dogs.filter((dog) =>
        dog.name.toLowerCase().includes(search.toLowerCase())
      ),
    [dogs, search]
  );

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-chip">Directory</span>
            <h1 className="section-heading mt-3">Dogs Directory</h1>
            <p className="section-copy mt-2">
              Browse dog IDs, vaccination status, and QR codes in one place.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <Input
              placeholder="Search dogs by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDogs.map((dog) => (
            <Card
              className="group flex h-full flex-col gap-5 border-slate-200/70 bg-white/88 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_50px_rgba(14,165,233,0.12)]"
              key={dog._id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {dog.dogId || "DOG-ID PENDING"}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {dog.name}
                  </h2>
                </div>
                <Badge variant={dog.vaccinated ? "success" : "danger"}>
                  {dog.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                </Badge>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <InfoCell label="Location" value={dog.location || "Unknown"} />
                <InfoCell label="Color" value={dog.color || "Unknown"} />
                <InfoCell
                  label="Last Vaccine"
                  value={formatDate(dog.lastVaccinationDate)}
                />
                <InfoCell
                  label="Next Vaccine"
                  value={formatDate(dog.nextVaccinationDate)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {dog.sterilized && <Badge variant="info">Sterilized</Badge>}
                {dog.alertStatus === "overdue" && (
                  <Badge variant="danger">Overdue</Badge>
                )}
                {dog.alertStatus === "dueSoon" && (
                  <Badge variant="warning">Due Soon</Badge>
                )}
                {dog.alertStatus === "attention" && (
                  <Badge variant="danger">Attention</Badge>
                )}
              </div>

              {dog.qrCode && (
                <div className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      alt={`${dog.name} QR`}
                      className="h-24 w-24 rounded-2xl bg-white p-2 shadow-sm"
                      src={dog.qrCode}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Scan to open profile
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {dog.dogId || "DOG-1234"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto flex justify-end">
                <Button onClick={() => navigate(`/dog/${getDogRouteId(dog)}`)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
        {label}
      </p>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default DogsPage;
