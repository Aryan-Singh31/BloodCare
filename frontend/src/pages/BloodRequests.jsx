import { useState, useEffect } from "react";
import { Droplets, Plus, X, MapPin, Phone, Clock, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const URGENCY_CONFIG = {
  normal:   { label: "Normal",   color: "bg-green-100 text-green-700 border-green-200",  dot: "bg-green-500" },
  urgent:   { label: "Urgent",   color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700 border-red-200",        dot: "bg-red-500 animate-pulse" },
};

const BG_COLORS = {
  "A+":"bg-red-500","A-":"bg-red-400","B+":"bg-rose-500","B-":"bg-rose-400",
  "O+":"bg-orange-500","O-":"bg-orange-400","AB+":"bg-purple-500","AB-":"bg-purple-400",
};

export default function BloodRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterBG, setFilterBG] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [form, setForm] = useState({
    patientName: "", bloodGroup: "", city: "", hospital: "",
    units: 1, urgency: "normal", contact: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    API.get("/requests", { params: { city: filterCity, bloodGroup: filterBG } })
      .then((r) => setRequests(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterBG, filterCity]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/requests", form);
      setShowForm(false);
      setForm({ patientName: "", bloodGroup: "", city: "", hospital: "", units: 1, urgency: "normal", contact: "", message: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post request");
    } finally { setSubmitting(false); }
  };

  const close_ = async (id) => {
    if (!confirm("Mark this request as fulfilled?")) return;
    await API.put(`/requests/${id}/close`);
    load();
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 pt-10 pb-20 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={20} />
                <span className="text-sm font-medium opacity-80">BloodCare</span>
              </div>
              <h1 className="text-3xl font-extrabold">Blood Requests</h1>
              <p className="text-red-100 text-sm mt-1">Active requests from patients in need</p>
            </div>
            {user && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-white text-red-600 font-semibold px-4 py-2.5 rounded-full shadow-lg hover:bg-red-50 transition text-sm">
                <Plus size={16} /> Post Request
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-10 pb-16">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-gray-400" />
          <input value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
            placeholder="Filter by city..." className="flex-1 min-w-[120px] text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
          <select value={filterBG} onChange={(e) => setFilterBG(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
            <option value="">All Blood Groups</option>
            {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
          </select>
          {(filterCity || filterBG) && (
            <button onClick={() => { setFilterCity(""); setFilterBG(""); }} className="text-xs text-red-600 hover:underline">Clear</button>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Droplets size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No active requests</p>
            <p className="text-sm mt-1">Be the first to post a blood request</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const urg = URGENCY_CONFIG[r.urgency] || URGENCY_CONFIG.normal;
              const isOwner = user?._id === r.userId?._id || user?._id === r.userId;
              return (
                <div key={r._id} data-aos="fade-up"
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  <div className="flex items-stretch">
                    {/* Blood group sidebar */}
                    <div className={`${BG_COLORS[r.bloodGroup] || "bg-red-500"} w-16 flex flex-col items-center justify-center text-white shrink-0`}>
                      <span className="text-xl font-extrabold leading-none">{r.bloodGroup}</span>
                      <span className="text-[10px] opacity-70 mt-0.5">needed</span>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">{r.patientName}</h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${urg.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                              {urg.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><MapPin size={11} />{r.city}{r.hospital ? ` · ${r.hospital}` : ""}</span>
                            <span className="flex items-center gap-1"><Droplets size={11} />{r.units} unit{r.units > 1 ? "s" : ""}</span>
                            <span className="flex items-center gap-1"><Phone size={11} />{r.contact}</span>
                            <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(r.createdAt)}</span>
                          </div>
                          {r.message && <p className="text-xs text-gray-500 mt-2 italic">"{r.message}"</p>}
                        </div>
                        {isOwner && (
                          <button onClick={() => close_(r._id)} title="Mark fulfilled"
                            className="shrink-0 text-green-600 hover:bg-green-50 p-1.5 rounded-full transition">
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Request Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Post Blood Request</h2>
              <button onClick={() => setShowForm(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
              {[
                { name: "patientName", placeholder: "Patient name", required: true },
                { name: "city", placeholder: "City", required: true },
                { name: "hospital", placeholder: "Hospital (optional)" },
                { name: "contact", placeholder: "Contact number", required: true },
              ].map(({ name, placeholder, required }) => (
                <input key={name} name={name} value={form[name]} onChange={handle} placeholder={placeholder} required={required}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
              ))}
              <div className="grid grid-cols-2 gap-3">
                <select name="bloodGroup" value={form.bloodGroup} onChange={handle} required
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
                  <option value="">Blood Group *</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
                </select>
                <select name="urgency" value={form.urgency} onChange={handle}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <input name="units" type="number" min="1" max="10" value={form.units} onChange={handle}
                placeholder="Units needed" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
              <textarea name="message" value={form.message} onChange={handle} rows={2}
                placeholder="Additional message (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none" />
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-rose-700 transition disabled:opacity-60">
                {submitting ? "Posting..." : "Post Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
