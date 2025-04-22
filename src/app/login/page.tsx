"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login(username, password);
      
      if (user) {
        // Redirect to home page or dashboard
        router.push("/");
      } else {
        // Handle authentication failure
        setError("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">
              ລະບົບທີ່ດິນ
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            ເຂົ້າສູ່ລະບົບ
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-semibold text-gray-800 dark:text-white">
                ຊື່ຜູ້ໃຊ້
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-semibold text-gray-800 dark:text-white">
                ລະຫັດຜ່ານ
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full rounded border-2 border-gray-400 dark:border-gray-500 p-2 dark:bg-gray-700 dark:text-white"
                placeholder="ປ້ອນລະຫັດຜ່ານ"
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
