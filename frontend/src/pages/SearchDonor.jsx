import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DonorCard from "../components/DonorCard";
import API from "../api";
import blood from "../assets/images/blood.png";

export default function SearchDonor() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchDonors = async () => {
    if (!city && !bloodGroup) {
      alert("Enter city or select blood group");
      return;
    }

    try {
      const res = await API.get("/donors/search", {
        params: { city, bloodGroup },
      });

      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch donors");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 flex flex-col">
      <div className="max-w-4xl mx-auto p-6 w-full flex-grow">

      {/* hero */}
{!searched && (
  <div className="text-center mb-8" data-aos="fade-up">
    <h2 className="text-3xl font-bold text-red-600 mb-3">
      Find a Blood Donor Near You
    </h2>
    <p className="text-gray-600">
      Search by city or blood group and connect instantly.
    </p>

    <img
  src={blood} alt="Donate blood"
  className="w-64 mx-auto mt-6 object-contain drop-shadow-xl"
/>



  </div>
)}


        {/* Search Form */}
        <div className="bg-white shadow-lg rounded-2xl border border-red-200 p-5" data-aos="zoom-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <input
              className="border p-2 rounded w-full outline-red-500"
              placeholder="Enter city (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <select
              className="border p-2 rounded w-full outline-red-500"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-red-700 transition"
              onClick={searchDonors}
            >
              Search
            </button>

          </div>
        </div>

        {/* RESULTS */}
        <div className="mt-8 space-y-3">
          {results.length > 0 ? (
            results.map((donor, index) => (
              <div
                key={donor._id || index}
                className="bg-white rounded-xl shadow border border-gray-200"
                data-aos="fade-up"
              >
                <DonorCard donor={donor} />
              </div>
            ))
          ) : (
            searched && (
              <p className="text-center text-gray-600 mt-4">
                No donors found. Try another filter.
              </p>
            )
          )}
        </div>

      </div>
    </div>
  );
}
