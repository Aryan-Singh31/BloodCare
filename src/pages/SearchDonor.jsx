import { useState } from "react";
import DonorCard from "../components/DonorCard";

export default function SearchDonor() {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  function searchDonors() {
    // API call to get donors by location
    setResults([
      { name: "Aryan Singh", blood: "O+", location: "Delhi" }
    ]);
  }

  return (
    <div className="p-5">
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={searchDonors}>
          Search
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {results.map((d, i) => (
          <DonorCard key={i} donor={d} />
        ))}
      </div>
    </div>
  );
}
