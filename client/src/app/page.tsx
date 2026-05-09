import Sidebar from "@/components/Sidebar";

export default async function Home() {
  return (
    <main className="flex w-full">
      <Sidebar />
      <div className="flex items-center justify-center h-screen text-3xl">
        Select a Surah
      </div>
    </main>
  );
}
