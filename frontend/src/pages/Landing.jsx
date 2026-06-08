import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Shield, Clock, Users, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-6 md:px-12">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-brand-500" />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            SecureTask <span className="text-brand-500">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 shadow-sm transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 py-20 text-center md:px-12 md:py-32">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Enterprise Task Management, <span className="text-brand-500">Secured.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-slate-500">
              Manage workflows, track audits, enforce role-based access, and optimize team throughput on a secure-by-default architecture.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 shadow-md transition-all"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white px-6 py-20 md:px-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
              Engineered for Professional Compliance
            </h2>
            <p className="mx-auto mt-2 text-center text-slate-500">
              Built on industry standards for authorization, performance, and monitoring.
            </p>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Role-Based Security</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Granular control separating Standard User task CRUD boundaries from Administrator user listings and audit logs.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Detailed Audit Logs</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Log activity details from creation, updates, and deletes down to the requesting IP, action types, and user identities.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Advanced Analytics</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Dashboard charts summarize tasks counts, status distributions, and priorities ratios in a streamlined visual layout.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} SecureTask Pro. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
