'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log(res.data); 

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        router.push('/dashboard');
      } else {
        alert(res.data.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-white to-violet-400 ">
      <div className='bg-white w-1/3 p-12 rounded-lg'>
      <h1 className="text-4xl mb-4 font-semibold text-center">Welcome to <span className='text-violet-700'>Workflo</span>!</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
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
          Login
        </button>
        <div className="mt-4">
          <p className="text-gray-600 text-xl">
            Don't have an account? Create a <Link href="/signup" legacyBehavior><a className="text-violet-600 hover:text-blue-700">new account</a></Link>
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Login;
