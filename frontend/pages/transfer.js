import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Transfer() {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!token) return;

      const response = await fetch('http://localhost:3001/me/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccounts(data);
      } else {
        setError('Failed to fetch accounts');
      }
    };

    fetchAccounts();
  }, [token]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const response = await fetch('http://localhost:3001/me/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, fromAccountId, toAccountId, amount: parseFloat(amount) }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Transfer successful');
    } else {
      setError(data.message || 'Transfer failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-opacity-80">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Transfer</h1>
      <form onSubmit={handleTransfer} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">From Account</label>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type} - {account.amount}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">To Account</label>
          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type} - {account.amount}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
          Transfer
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </form>
    </div>
  );
}
