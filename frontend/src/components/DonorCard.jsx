export default function DonorCard({ donor }) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-bold">{donor.name}</h3>
      <p>Blood Group: {donor.blood}</p>
      <p>Location: {donor.location}</p>
      <button className="bg-green-600 text-white px-3 py-1 mt-2 rounded">
        Chat Now
      </button>
    </div>
  );
}
