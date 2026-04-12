import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

const PIE_COLORS = ["#0ea5e9", "#cbd5e1"];
const BAR_COLORS = ["#f43f5e", "#f59e0b", "#10b981"];

const getDogRouteId = (dog) => dog.dogId || dog._id;
const normalizeDogIdValue = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

function Dashboard() {
  const [dogs, setDogs] = useState([]);
  const [stats, setStats] = useState({
    totalDogs: 0,
    vaccinatedCount: 0,
    overdueVaccinations: 0,
    dueSoonVaccinations: 0,
    safeVaccinations: 0,
    activeReports: 0,
  });
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [dogsResponse, statsResponse] = await Promise.all([
        API.get("/api/dogs"),
        API.get("/api/dogs/stats"),
      ]);

      setDogs(dogsResponse.data);
      setStats(statsResponse.data);
    };

    fetchDashboardData().catch((error) => console.log(error));
  }, []);

  const filteredDogs = useMemo(
    () =>
      dogs.filter((dog) => {
        const normalizedSearch = normalizeDogIdValue(search);

        if (!normalizedSearch) {
          return true;
        }

        return normalizeDogIdValue(dog.dogId).includes(normalizedSearch);
      }),
    [dogs, search]
  );

  const exactMatchDog = useMemo(() => {
    const normalizedSearch = normalizeDogIdValue(search);

    if (!normalizedSearch) {
      return null;
    }

    return (
      dogs.find(
        (dog) => normalizeDogIdValue(dog.dogId) === normalizedSearch
      ) || null
    );
  }, [dogs, search]);

  const handleDogSearch = (event) => {
    event.preventDefault();

    const normalizedSearch = normalizeDogIdValue(search);

    if (!normalizedSearch) {
      setSearchError("Enter a Dog ID first.");
      return;
    }

    const dogToOpen = exactMatchDog || filteredDogs[0];

    if (!dogToOpen) {
      setSearchError("No dog found for that Dog ID.");
      return;
    }

    setSearchError("");
    navigate(`/dog/${getDogRouteId(dogToOpen)}`);
  };

  const vaccinatedPercentage = stats.totalDogs
    ? Math.round((stats.vaccinatedCount / stats.totalDogs) * 100)
    : 0;

  const safeCount =
    typeof stats.safeVaccinations === "number"
      ? stats.safeVaccinations
      : Math.max(
          stats.totalDogs -
            stats.overdueVaccinations -
            stats.dueSoonVaccinations,
          0
        );

  const pieData = [
    { name: "Vaccinated", value: stats.vaccinatedCount },
    {
      name: "Not Vaccinated",
      value: Math.max(stats.totalDogs - stats.vaccinatedCount, 0),
    },
  ];

  const barData = [
    { name: "Overdue", value: stats.overdueVaccinations },
    { name: "Due Soon", value: stats.dueSoonVaccinations },
    { name: "Safe", value: safeCount },
  ];

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border-slate-200/70 bg-white/88">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="section-chip">Dashboard</span>
              <h1 className="section-heading mt-3">PawTrack Overview</h1>
              <p className="section-copy mt-2 max-w-2xl leading-6">
                Monitor dog records, vaccination status, and active field issues
                from one clean workspace.
              </p>
            </div>

            <div className="w-full lg:max-w-2xl">
              <form
                className="flex w-full flex-col gap-3 lg:flex-row"
                onSubmit={handleDogSearch}
              >
                <Input
                  className="bg-white"
                  placeholder="Enter Dog ID"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchError("");
                  }}
                />
                <Button type="submit" variant="secondary">
                  Find Dog
                </Button>
                <Button onClick={() => navigate("/scan")} variant="secondary">
                  Open Scanner
                </Button>
                {role === "admin" && (
                  <Button onClick={() => navigate("/add-dog")}>Add Dog</Button>
                )}
              </form>
              {searchError && (
                <p className="mt-3 text-sm font-medium text-rose-600">
                  {searchError}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            accent="sky"
            helper="Tracked across PawTrack"
            label="Total Dogs"
            value={stats.totalDogs}
          />
          <StatCard
            accent="emerald"
            helper={`${stats.vaccinatedCount} vaccinated`}
            label="Vaccinated %"
            value={`${vaccinatedPercentage}%`}
          />
          <StatCard
            accent="rose"
            helper="Need follow-up"
            label="Overdue"
            value={stats.overdueVaccinations}
          />
          <StatCard
            accent="amber"
            helper="Current open reports"
            label="Active Reports"
            value={stats.activeReports}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Analytics</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Vaccination coverage
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  A quick snapshot of vaccinated versus unvaccinated dogs.
                </p>
              </div>
              <Badge variant="info">Live</Badge>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="min-w-0 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4">
                <div className="h-72 min-w-0 sm:h-80">
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={70}
                        outerRadius={96}
                        paddingAngle={4}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            key={entry.name}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid content-start gap-4 sm:grid-cols-2">
                {pieData.map((item, index) => (
                  <LegendCard
                    color={PIE_COLORS[index]}
                    key={item.name}
                    label={item.name}
                    tone={index === 0 ? "sky" : "slate"}
                    value={item.value}
                  />
                ))}
                <SummaryCard
                  helper="Dogs with current vaccine protection"
                  title="Safe Window"
                  tone="emerald"
                  value={safeCount}
                />
                <SummaryCard
                  helper="Visible results in your current search"
                  title="Visible Dogs"
                  tone="amber"
                  value={filteredDogs.length}
                />
              </div>
            </div>
          </Card>

          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Status</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Vaccination risk
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Overdue, due soon, and safe counts in one view.
                </p>
              </div>
              <Badge variant="success">Updated</Badge>
            </div>

            <div className="mt-6 min-w-0 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4">
              <div className="h-72 min-w-0 sm:h-80">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={barData} barCategoryGap={28}>
                    <CartesianGrid stroke="#dbeafe" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis allowDecimals={false} stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[14, 14, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell
                          fill={BAR_COLORS[index % BAR_COLORS.length]}
                          key={entry.name}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {barData.map((item, index) => (
                <MiniStatus
                  color={BAR_COLORS[index]}
                  key={item.name}
                  label={item.name}
                  value={item.value}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-chip">Directory</span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Dog Profiles
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredDogs.length} visible of {stats.totalDogs} total dogs
            </p>
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
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {dog.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {dog.location || "Location not set"}
                  </p>
                </div>
                <Badge variant={getAlertVariant(dog.alertStatus)}>
                  {getAlertLabel(dog.alertStatus)}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <QuickInfo label="Color" value={dog.color || "Unknown"} />
                <QuickInfo label="Gender" value={dog.gender || "Unknown"} />
                <QuickInfo
                  label="Reports"
                  value={String(dog.reports?.length || 0)}
                />
                <QuickInfo
                  label="Sterilized"
                  value={dog.sterilized ? "Yes" : "No"}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={dog.vaccinated ? "success" : "danger"}>
                  {dog.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                </Badge>
                <Badge variant={dog.sterilized ? "info" : "neutral"}>
                  {dog.sterilized ? "Sterilized" : "Not Sterilized"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Universal lookup QR
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    Pair this shared QR with Dog ID {dog.dogId || "DOG-1234"}
                  </p>
                </div>
                {dog.qrCode && (
                  <img
                    alt={`${dog.name} QR`}
                    className="h-20 w-20 rounded-2xl bg-white p-2 shadow-sm"
                    src={dog.qrCode}
                  />
                )}
              </div>

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

function StatCard({ accent, helper, label, value }) {
  const accentStyles = {
    sky: "border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50",
    emerald:
      "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    rose: "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50",
    amber:
      "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50",
  };

  return (
    <Card className={`border ${accentStyles[accent] || accentStyles.sky} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </Card>
  );
}

function LegendCard({ color, label, tone, value }) {
  const toneStyles = {
    sky: "border-sky-100 bg-sky-50/70",
    slate: "border-slate-200 bg-slate-50/80",
  };

  return (
    <div
      className={`rounded-3xl border p-5 ${toneStyles[tone] || toneStyles.slate}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SummaryCard({ helper, title, tone, value }) {
  const toneStyles = {
    emerald: "border-emerald-100 bg-emerald-50/80",
    amber: "border-amber-100 bg-amber-50/80",
  };

  return (
    <div
      className={`rounded-3xl border p-5 ${toneStyles[tone] || toneStyles.emerald}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function MiniStatus({ color, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function QuickInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function getAlertVariant(status) {
  switch (status) {
    case "overdue":
      return "danger";
    case "dueSoon":
      return "warning";
    case "attention":
      return "danger";
    default:
      return "info";
  }
}

function getAlertLabel(status) {
  switch (status) {
    case "overdue":
      return "Overdue";
    case "dueSoon":
      return "Due Soon";
    case "attention":
      return "Attention";
    default:
      return "Stable";
  }
}

export default Dashboard;
