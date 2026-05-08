import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

export default function VerifyPage() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, message: '' });

  useEffect(() => {
    api
      .get(`/auth/verify/${token}`)
      .then(({ data }) => setState({ loading: false, message: data.message }))
      .catch((error) => setState({ loading: false, message: error.response?.data?.message || 'Verification failed' }));
  }, [token]);

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-12">
      <section className="card max-w-lg space-y-4 p-6 text-center">
        <h1 className="font-heading text-3xl font-semibold text-navy">
          {state.loading ? 'Verifying account...' : 'Verification status'}
        </h1>
        <p className="text-slate-600">{state.loading ? 'Please wait a moment.' : state.message}</p>
        {!state.loading ? (
          <Link to="/login" className="inline-flex rounded-lg bg-navy px-4 py-3 font-bold text-white">
            Continue to login
          </Link>
        ) : null}
      </section>
    </main>
  );
}
