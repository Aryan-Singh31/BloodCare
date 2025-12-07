export default function DonorCard({ donor }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <p>
        <strong>Name:</strong> {donor.fullName}
      </p>
      <p>
        <strong>Blood Group:</strong> {donor.bloodGroup}
      </p>
      <p>
        <strong>Location:</strong> {donor.city}
      </p>
      <p>
        <strong>Phone:</strong> {donor.phone}
      </p>
    </div>
  );
}
