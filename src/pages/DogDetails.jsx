import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

const initialHealthForm = {
  type: "treatment",
  vaccinationDate: "",
  treatment: "",
  notes: "",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "Not available";

const objectIdPattern = /^[a-f\d]{24}$/i;

function DogDetails() {
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState("");
  const [report, setReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [healthForm, setHealthForm] = useState(initialHealthForm);

  const fetchDog = async () => {
    try {
      setError("");
      const response = await API.get(`/api/dogs/dogid/${dogId}`);
      setDog(response.data);
    } catch (errorResponse) {
      if (objectIdPattern.test(dogId)) {
        try {
          const fallbackResponse = await API.get(`/api/dogs/${dogId}`);
          setDog(fallbackResponse.data);
          setError("");
          return;
        } catch (fallbackError) {
          setDog(null);
          setError(fallbackError.response?.data?.msg || "Dog not found");
          return;
        }
      }

      setDog(null);
      setError(errorResponse.response?.data?.msg || "Dog not found");
    }
  };

  useEffect(() => {
    fetchDog();
  }, [dogId]);

  const handleReport = async () => {
    if (!report.trim()) {
      toast.error("Enter a report message first");
      return;
    }

    setReportLoading(true);

    try {
      await API.post(`/api/dogs/report/${dog._id}`, { message: report });
      toast.success("Report submitted successfully");
      setReport("");
      fetchDog();
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.msg || "Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleHealthChange = (event) => {
    const { name, value } = event.target;
    setHealthForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAddRecord = async () => {
    const isVaccination = healthForm.type === "vaccination";

    if (isVaccination && !healthForm.vaccinationDate) {
      toast.error("Select a vaccination date");
      return;
    }

    if (!isVaccination && !healthForm.treatment.trim() && !healthForm.notes.trim()) {
      toast.error("Add treatment details or notes");
      return;
    }

    setRecordLoading(true);

    try {
      const payload = {
        type: healthForm.type,
        treatment: healthForm.treatment,
        notes: healthForm.notes,
      };

      if (isVaccination) {
        payload.vaccinationDate = healthForm.vaccinationDate;
      }

      await API.post(`/api/dogs/health/${dog._id}`, payload);
      toast.success("Health record added successfully");
      setHealthForm(initialHealthForm);
      fetchDog();
    } catch (errorResponse) {
      toast.error(errorResponse.response?.data?.msg || "Failed to add health record");
    } finally {
      setRecordLoading(false);
    }
  };

  const status = useMemo(() => {
    if (!dog?.nextVaccinationDate) {
      return { label: "No Data", variant: "neutral" };
    }

    const diff =
      (new Date(dog.nextVaccinationDate) - new Date()) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return { label: "Overdue", variant: "danger" };
    }

    if (diff <= 7) {
      return { label: "Due Soon", variant: "warning" };
    }

    return { label: "Safe", variant: "success" };
  }, [dog]);

  const healthRecords = useMemo(
    () =>
      [...(dog?.healthRecords || [])].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      ),
    [dog]
  );

  if (error) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center">
          <span className="section-chip">Not Found</span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Dog Not Found</h1>
          <p className="mt-4 text-sm text-slate-500">
            We could not find a dog for <strong>{dogId}</strong>.
          </p>
        </Card>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-sm text-center text-slate-500">
          Loading dog details...
        </Card>
      </div>
    );
  }

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card className="space-y-6 border-sky-100/70 bg-white/88">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="section-chip">Profile</span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {dog.dogId || "DOG-ID PENDING"}
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {dog.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  {dog.location || "Location not available"}
                </p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="Color" value={dog.color || "Not available"} />
              <InfoCard label="Gender" value={dog.gender || "Not available"} />
              <InfoCard
                label="Last Vaccination"
                value={formatDate(dog.lastVaccinationDate)}
              />
              <InfoCard
                label="Next Vaccination"
                value={formatDate(dog.nextVaccinationDate)}
              />
            </div>

            <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50 to-emerald-50 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                QR Code
              </p>
              {dog.qrCode && (
                <img
                  alt={`${dog.name} QR`}
                  className="mx-auto mt-4 h-48 w-48 rounded-2xl bg-white p-4 shadow-sm"
                  src={dog.qrCode}
                />
              )}
            </div>
          </Card>

          <Card className="space-y-4 border-amber-100/70 bg-white/88">
            <div>
              <span className="section-chip">Reports</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Report Issue</h2>
              <p className="mt-2 text-sm text-slate-500">
                Log a field issue or welfare concern for this dog.
              </p>
            </div>
            <Input
              as="textarea"
              className="min-h-28 resize-none"
              placeholder="Describe the issue"
              value={report}
              onChange={(event) => setReport(event.target.value)}
            />
            <div className="flex justify-end">
              <Button loading={reportLoading} onClick={handleReport}>
                Submit Report
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 bg-white/88">
            <div>
              <span className="section-chip">Timeline</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Reports</h2>
              <p className="mt-2 text-sm text-slate-500">
                Review previous reports connected to this dog.
              </p>
            </div>
            {dog.reports?.length > 0 ? (
              <div className="space-y-3">
                {dog.reports.map((record, index) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                    key={`${record.message}-${index}`}
                  >
                    <p className="font-medium text-slate-900">{record.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(record.date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No reports available.
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 border-emerald-100/70 bg-white/88">
            <div>
              <span className="section-chip">Health</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Add Health Record
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep treatment and vaccination history structured and searchable.
              </p>
            </div>
            <div className="grid gap-4">
              <Input
                as="select"
                label="Record Type"
                name="type"
                value={healthForm.type}
                onChange={handleHealthChange}
              >
                <option value="treatment">Treatment</option>
                <option value="vaccination">Vaccination</option>
              </Input>
              {healthForm.type === "vaccination" && (
                <Input
                  label="Vaccination Date"
                  name="vaccinationDate"
                  onChange={handleHealthChange}
                  type="date"
                  value={healthForm.vaccinationDate}
                />
              )}
              <Input
                label={healthForm.type === "vaccination" ? "Vaccine Name" : "Treatment"}
                name="treatment"
                onChange={handleHealthChange}
                placeholder={
                  healthForm.type === "vaccination"
                    ? "Rabies, booster, etc."
                    : "Treatment name"
                }
                value={healthForm.treatment}
              />
              <Input
                as="textarea"
                className="min-h-28 resize-none"
                label="Notes"
                name="notes"
                onChange={handleHealthChange}
                placeholder="Add medical notes"
                value={healthForm.notes}
              />
            </div>
            <div className="flex justify-end">
              <Button loading={recordLoading} onClick={handleAddRecord}>
                Save Record
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 bg-white/88">
            <div>
              <span className="section-chip">History</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Health History</h2>
              <p className="mt-2 text-sm text-slate-500">
                Review the full timeline of health records.
              </p>
            </div>
            {healthRecords.length > 0 ? (
              <div className="space-y-4">
                {healthRecords.map((record, index) => (
                  <div
                    className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5"
                    key={`${record.createdAt || index}-${index}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge variant={record.type === "vaccination" ? "info" : "neutral"}>
                        {record.type}
                      </Badge>
                      <p className="text-xs text-slate-500">
                        {formatDate(record.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Treatment"
                        value={record.treatment || "Not recorded"}
                      />
                      <InfoCard
                        label="Vaccination Date"
                        value={formatDate(record.vaccinationDate)}
                      />
                      <InfoCard
                        label="Next Due Date"
                        value={formatDate(record.nextDueDate)}
                      />
                      <InfoCard label="Notes" value={record.notes || "No notes"} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No health records available yet.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default DogDetails;
