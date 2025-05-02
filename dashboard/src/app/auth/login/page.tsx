'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push('/dashboard/cafeteria');
    } catch (err: any) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-amber-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Cafe Owner Login</h1>
          <p className="text-amber-600">Welcome back to your cafe dashboard</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
              Email Address
            </label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="your@email.com" 
              onChange={handleChange} 
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-1">
              Password
            </label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition font-medium shadow-md hover:shadow-amber-200"
        >
          Sign In
        </button>

        <div className="text-center text-sm text-amber-600">
          <p>New cafe owner?{' '}
            <button 
              type="button"
              onClick={handleSignUpRedirect}
              className="font-medium text-amber-700 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 rounded px-1"
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;