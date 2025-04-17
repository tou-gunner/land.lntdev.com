'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if user was redirected from registration
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setSuccessMessage('ລົງທະບຽນສຳເລັດແລ້ວ. ກະລຸນາເຂົ້າສູ່ລະບົບ');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
        return;
      }

      // Store user data in localStorage or session
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user role
      if (data.user.role === 'ADMIN' || data.user.role === 'MANAGER') {
        router.push('/land-management');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ເຂົ້າສູ່ລະບົບ</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ຊື່ຜູ້ໃຊ້
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ລະຫັດຜ່ານ
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'ກຳລັງດຳເນີນການ...' : 'ເຂົ້າສູ່ລະບົບ'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 space-y-2">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block">
            ກັບຄືນໜ້າຫຼັກ
          </Link>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ຍັງບໍ່ມີບັນຊີບໍ?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              ລົງທະບຽນ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 