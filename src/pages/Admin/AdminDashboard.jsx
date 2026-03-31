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
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import API from "../../services/api";

const PIE_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"];
const BAR_COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e"];

const getDogRouteId = (dog) => dog?.dogId || dog?._id;

function AdminDashboard() {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const [dogsResponse, statsResponse] = await Promise.all([
          API.get("/api/dogs"),
          API.get("/api/dogs/stats"),
        ]);

        setDogs(dogsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error(error);
        setLoadError("We could not load the admin overview right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredDogs = useMemo(
    () =>
      dogs.filter((dog) =>
        dog.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [dogs, search]
  );

  const safeCount =
    typeof stats.safeVaccinations === "number"
      ? stats.safeVaccinations
      : Math.max(
          stats.totalDogs -
            stats.overdueVaccinations -
            stats.dueSoonVaccinations,
          0
        );

  const vaccinatedPercentage = stats.totalDogs
    ? Math.round((stats.vaccinatedCount / stats.totalDogs) * 100)
    : 0;

  const unvaccinatedCount = Math.max(
    stats.totalDogs - stats.vaccinatedCount,
    0
  );

  const attentionCount = dogs.filter(
    (dog) => getAlertLevel(dog) === "attention"
  ).length;

  const attentionDogs = useMemo(
    () =>
      dogs
        .filter((dog) => getAlertLevel(dog) !== "safe")
        .sort((left, right) => {
          const alertRank = {
            overdue: 0,
            dueSoon: 1,
            attention: 2,
            safe: 3,
          };

          return (
            alertRank[getAlertLevel(left)] - alertRank[getAlertLevel(right)]
          );
        })
        .slice(0, 4),
    [dogs]
  );

  const recentDogs = useMemo(
    () =>
      [...filteredDogs]
        .sort(
          (left, right) =>
            new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
        )
        .slice(0, 6),
    [filteredDogs]
  );

  const pieData = [
    { name: "Vaccinated", value: stats.vaccinatedCount },
    { name: "Unvaccinated", value: unvaccinatedCount },
    { name: "Due Soon", value: stats.dueSoonVaccinations },
    { name: "Overdue", value: stats.overdueVaccinations },
  ];

  const barData = [
    { name: "Safe", value: safeCount },
    { name: "Due Soon", value: stats.dueSoonVaccinations },
    { name: "Overdue", value: stats.overdueVaccinations },
    { name: "Attention", value: attentionCount },
  ];

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border-slate-200/70 bg-white/88">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="section-chip">Admin</span>
              <h1 className="section-heading mt-3">PawTrack Command Center</h1>
              <p className="section-copy mt-2 max-w-2xl leading-6">
                Stay on top of vaccination coverage, open issues, and the dogs
                that need action first.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row">
              <Input
                className="bg-white"
                placeholder="Search dogs by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button onClick={() => navigate("/dogs")} variant="secondary">
                View Directory
              </Button>
              <Button onClick={() => navigate("/add-dog")}>Add Dog</Button>
            </div>
          </div>
        </Card>

        {loadError && (
          <Card className="border-rose-200 bg-rose-50/90">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-rose-700">Load error</p>
                <p className="mt-1 text-sm text-rose-600">{loadError}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="danger">
                Retry
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            accent="sky"
            helper="Tracked in the system"
            label="Total Dogs"
            value={stats.totalDogs}
          />
          <StatCard
            accent="emerald"
            helper={`${stats.vaccinatedCount} protected right now`}
            label="Coverage"
            value={`${vaccinatedPercentage}%`}
          />
          <StatCard
            accent="amber"
            helper="Vaccinations due in 7 days"
            label="Due Soon"
            value={stats.dueSoonVaccinations}
          />
          <StatCard
            accent="rose"
            helper="Urgent follow-up needed"
            label="Overdue"
            value={stats.overdueVaccinations}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Coverage</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Vaccination landscape
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  High-level health status across all tracked dogs.
                </p>
              </div>
              <Badge variant={loadError ? "danger" : "success"}>
                {isLoading ? "Refreshing" : "Live"}
              </Badge>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4">
                <div className="h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={68}
                        outerRadius={102}
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
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Priority</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Action queue
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Dogs that should be reviewed first by the admin team.
                </p>
              </div>
              <Badge variant="warning">{attentionDogs.length} flagged</Badge>
            </div>

            <div className="mt-6 space-y-3">
              {attentionDogs.length > 0 ? (
                attentionDogs.map((dog) => {
                  const alertLevel = getAlertLevel(dog);

                  return (
                    <button
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50/80 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white"
                      key={dog._id}
                      onClick={() => navigate(`/dog/${getDogRouteId(dog)}`)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                            {dog.dogId || "DOG-ID PENDING"}
                          </p>
                          <h3 className="mt-2 text-lg font-bold text-slate-900">
                            {dog.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {dog.location || "Location not available"}
                          </p>
                        </div>
                        <Badge variant={getAlertVariant(alertLevel)}>
                          {getAlertLabel(alertLevel)}
                        </Badge>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500">
                  No urgent dogs are flagged right now.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Risk</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Follow-up status
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Compare stable dogs with records needing attention.
                </p>
              </div>
              <Badge variant="info">Overview</Badge>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4">
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={barData} barCategoryGap={24}>
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
          </Card>

          <Card className="border-slate-200/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Recent</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  Latest dog records
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Quick access to recently added or visible dogs.
                </p>
              </div>
              <Badge variant="neutral">{recentDogs.length} visible</Badge>
            </div>

            <div className="mt-6 grid gap-3">
              {recentDogs.length > 0 ? (
                recentDogs.map((dog) => {
                  const alertLevel = getAlertLevel(dog);

                  return (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
                      key={dog._id}
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {dog.dogId || "DOG-ID PENDING"}
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {dog.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {dog.location || "Location not available"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={getAlertVariant(alertLevel)}>
                          {getAlertLabel(alertLevel)}
                        </Badge>
                        <Button
                          onClick={() => navigate(`/dog/${getDogRouteId(dog)}`)}
                          variant="secondary"
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500">
                  No dogs match your current search.
                </div>
              )}
            </div>
          </Card>
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
    amber:
      "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    rose: "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50",
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

function LegendCard({ color, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
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

function getAlertLevel(dog) {
  if (dog?.alertStatus) {
    return dog.alertStatus;
  }

  if (!dog?.vaccinated) {
    return "attention";
  }

  if (!dog?.nextVaccinationDate) {
    return "safe";
  }

  const diffInDays =
    (new Date(dog.nextVaccinationDate) - new Date()) / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return "overdue";
  }

  if (diffInDays <= 7) {
    return "dueSoon";
  }

  return "safe";
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
      return "success";
  }
}

function getAlertLabel(status) {
  switch (status) {
    case "overdue":
      return "Overdue";
    case "dueSoon":
      return "Due Soon";
    case "attention":
      return "Needs Review";
    default:
      return "Safe";
  }
}

export default AdminDashboard;
