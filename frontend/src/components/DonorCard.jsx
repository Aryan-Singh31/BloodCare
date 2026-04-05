import { useNavigate } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Droplets } from "lucide-react";

const BG_COLORS = {
  "A+":"from-red-500 to-red-600","A-":"from-red-400 to-red-500",
  "B+":"from-rose-500 to-rose-600","B-":"from-rose-400 to-rose-500",
  "O+":"from-orange-500 to-orange-600","O-":"from-orange-400 to-orange-500",
  "AB+":"from-purple-500 to-purple-600","AB-":"from-purple-400 to-purple-500",
};

export default function DonorCard({ donor }) {
  const navigate = useNavigate();
  const initials = donor.fullName?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const grad = BG_COLORS[donor.bloodGroup] || "from-red-500 to-red-600";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="flex items-stretch">
        {/* Blood group panel */}
        <div className={`bg-gradient-to-b ${grad} w-20 flex flex-col items-center justify-center text-white py-4 shrink-0`}>
          <Droplets size={18} className="opacity-70 mb-1" />
          <span className="text-2xl font-extrabold leading-none">{donor.bloodGroup}</span>
        </div>

        {/* Info */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
              {initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{donor.fullName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Available to donate
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><MapPin size={11} />{donor.city}</span>
            <span className="flex items-center gap-1"><Phone size={11} />{donor.phone}</span>
          </div>

          <button onClick={() => navigate(`/chat/${donor._id}`)}
            className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 transition shadow-sm">
            <MessageCircle size={13} /> Chat Now
          </button>
        </div>
      </div>
    </div>
  );
}
