"use client";

interface User {
  user_name: string;
  full_name: string;
  tel: string;
  responsive: string;
  role_id: number;
  group_id: number;
}

// Function to get the current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userString = localStorage.getItem('user');
  if (!userString) {
    return null;
  }
  
  try {
    return JSON.parse(userString) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Function to check if the user is logged in
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Function to log the user out
export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login';
};

// Function to login the user
export const login = async (user_name: string, password: string): Promise<User | null> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/utility/login`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name,
        password
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data.length > 0) {
      const user = data.data[0];
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}; 