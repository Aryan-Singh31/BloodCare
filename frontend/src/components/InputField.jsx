export default function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col mb-3">
      <label className="mb-1 text-gray-700 font-medium">{label}</label>
      <input
        {...props}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
