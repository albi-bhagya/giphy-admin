import Charts from "./components/Charts";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Charts />
    </div>
  );
}
