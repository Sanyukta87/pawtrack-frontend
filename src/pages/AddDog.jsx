import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import API from "../services/api";

const initialFormData = {
  name: "",
  location: "",
  color: "",
  gender: "",
  vaccinated: false,
  sterilized: false,
  earNotch: false,
  notes: "",
};

const getDogRouteId = (dog) => dog?.dogId || dog?._id;

function AddDog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [createdDog, setCreatedDog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await API.post("/api/dogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCreatedDog(response.data);
      setFormData(initialFormData);
      toast.success("Dog added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding the dog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-6 border-sky-100/70 bg-white/88">
          <div>
            <span className="section-chip">Create</span>
            <h1 className="section-heading mt-3">Add Dog</h1>
            <p className="section-copy mt-2">
              Capture a new dog profile with clean, structured details.
            </p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              label="Name"
              placeholder="Dog name"
              value={formData.name}
              onChange={handleChange}
              name="name"
            />
            <Input
              label="Location"
              placeholder="Street or zone"
              value={formData.location}
              onChange={handleChange}
              name="location"
            />
            <Input
              label="Color"
              placeholder="Brown, white, black..."
              value={formData.color}
              onChange={handleChange}
              name="color"
            />
            <Input
              as="select"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              name="gender"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Input>
            <div className="md:col-span-2 grid gap-3 rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  checked={formData.vaccinated}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300"
                  name="vaccinated"
                  onChange={handleChange}
                  type="checkbox"
                />
                Vaccinated
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  checked={formData.sterilized}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300"
                  name="sterilized"
                  onChange={handleChange}
                  type="checkbox"
                />
                Sterilized
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  checked={formData.earNotch}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300"
                  name="earNotch"
                  onChange={handleChange}
                  type="checkbox"
                />
                Ear Notch
              </label>
            </div>
            <Input
              as="textarea"
              className="min-h-32 resize-none md:col-span-2"
              label="Notes"
              placeholder="Anything important to remember"
              value={formData.notes}
              onChange={handleChange}
              name="notes"
            />
            <div className="md:col-span-2 flex justify-end">
              <Button
                className="w-full sm:w-auto"
                loading={isSubmitting}
                type="submit"
              >
                Save Dog
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-5 border-emerald-100/70 bg-white/88">
          <div>
            <span className="section-chip">Preview</span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Created Dog Info
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review the generated ID and QR right after saving.
            </p>
          </div>

          {createdDog ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Dog ID"
                  value={createdDog.dogId || "Pending"}
                />
                <InfoItem label="Name" value={createdDog.name} />
                <InfoItem
                  label="Location"
                  value={createdDog.location || "Not provided"}
                />
                <InfoItem
                  label="Color"
                  value={createdDog.color || "Not provided"}
                />
                <InfoItem
                  label="Gender"
                  value={createdDog.gender || "Not provided"}
                />
                <InfoItem
                  label="Status"
                  value={[
                    createdDog.vaccinated ? "Vaccinated" : "Not Vaccinated",
                    createdDog.sterilized ? "Sterilized" : "Not Sterilized",
                    createdDog.earNotch ? "Ear Notch" : "No Ear Notch",
                  ].join(" • ")}
                />
              </div>

              <InfoItem label="Notes" value={createdDog.notes || "No notes"} />

              {createdDog.qrCode && (
                <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50 to-emerald-50 p-4 text-center">
                  <img
                    alt={`${createdDog.name} QR`}
                    className="mx-auto h-48 w-48 rounded-2xl bg-white p-3 shadow-sm"
                    src={createdDog.qrCode}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate(`/dog/${getDogRouteId(createdDog)}`)}>
                  View Details
                </Button>
                <Button onClick={() => navigate("/admin")} variant="secondary">
                  Go to Dashboard
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500">
              Submit the form to view the generated dog ID, QR code, and saved
              profile summary.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default AddDog;
