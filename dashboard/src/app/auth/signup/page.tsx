'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    upi: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;

      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseId: uid,
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          upiId: form.upi,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/cafeteria?setup=true');
      } else {
        setError(data.message || 'Failed to create owner in DB');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-amber-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Create Your Cafe Account</h1>
          <p className="text-amber-600">Start managing your cafe in minutes</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">
              Full Name
            </label>
            <input 
              id="name"
              name="name" 
              placeholder="Your full name" 
              onChange={handleChange} 
              value={form.name}
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
              required 
            />
          </div>

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
              value={form.email}
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
              required 
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-1">
              Phone Number
            </label>
            <input 
              id="phone"
              name="phone" 
              type="tel" 
              placeholder="+91 9876543210" 
              onChange={handleChange} 
              value={form.phone}
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
            />
          </div>

          <div>
            <label htmlFor="upi" className="block text-sm font-medium text-amber-800 mb-1">
              UPI ID
            </label>
            <input 
              id="upi"
              name="upi" 
              placeholder="yourname@upi" 
              onChange={handleChange} 
              value={form.upi}
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
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
              value={form.password}
              className="w-full border border-amber-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-amber-50 placeholder-amber-300 text-amber-800" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition font-medium shadow-md hover:shadow-amber-200"
        >
          Create Account
        </button>

        <div className="text-center text-sm text-amber-600">
          <p>Already have an account?{' '}
            <button 
              type="button"
              onClick={() => router.push('/auth/login')}
              className="font-medium text-amber-700 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 rounded px-1"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;