import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto pt-12 text-center">
        <h1 className="text-4xl font-bold mb-6">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</h1>
        <p className="text-xl mb-8">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</p>
        
        <Link 
          href="/land-management" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block text-lg"
        >
          ເຂົ້າສູ່ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ
        </Link>
      </div>
    </main>
  );
}
