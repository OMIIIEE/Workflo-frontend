'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://workflo-backend-kf6g.onrender.com/api/auth/signup", { username, email, password });
      if (res.data.success) {
        alert(res.data.message);
        router.push('/login');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Error during signup:', err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-white to-violet-400">
      <div className='bg-white w-1/3 p-12 rounded-lg'>
      <h1 className="text-4xl mb-4 font-semibold text-center">Welcome to <span className='text-violet-700'>Workflo</span>!</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded bg-gray-100"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded bg-gray-100"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded bg-gray-100"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Signup
        </button>
        <div className="mt-4">
          <p className="text-gray-600 text-xl">
            Already have an account? <Link href="/login" legacyBehavior><a className="text-violet-600 hover:text-blue-700">Log in</a></Link>
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Signup;
