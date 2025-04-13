import Image from "next/image";
import LandForm from "../components/LandForm";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* <h1 className="text-3xl font-bold mb-8 text-center text-blue-800 dark:text-blue-400">ລະບົບລົງທະບຽນທີ່ດິນ</h1> */}
      <LandForm />
    </main>
  );
}
