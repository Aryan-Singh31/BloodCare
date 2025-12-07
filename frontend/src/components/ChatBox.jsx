export default function ChatBox({ chat }) {
  return (
    <div className="p-4 h-72 overflow-y-scroll bg-gray-100 border rounded shadow">
      {chat.map((msg, i) => (
        <div key={i} className="my-1 bg-white p-2 rounded shadow-sm">
          {msg}
        </div>
      ))}
    </div>
  );
}
