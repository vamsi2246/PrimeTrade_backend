import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Shield, Clock, Users, ArrowRight, Activity, Cpu } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white px-6 md:px-12">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-brand-500" />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            SecureTask <span className="text-brand-500">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link to="/register">
            <Button className="px-4 py-2 text-xs">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="px-6 py-24 text-center md:px-12 md:py-32">
          <div className="mx-auto max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-100 uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5 animate-pulse" /> Production Ready SaaS Platform
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
              Enterprise Task Management, <span className="text-brand-500">Secured.</span>
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-500 leading-relaxed">
              Manage workflows, track activity logs, enforce role-based access, and optimize team throughput on a secure-by-default architecture.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link to="/register">
                <Button className="flex items-center gap-2 px-6 py-3 shadow-lg">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="px-6 py-3 shadow-xs">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white px-6 py-20 border-t border-slate-100 md:px-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
              Engineered for Compliance & Verification
            </h2>
            <p className="mx-auto mt-2 text-center text-slate-500 max-w-md">
              Built on industry standards for authorization, performance, and monitoring logs.
            </p>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-xs mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Role-Based Security</h3>
                <p className="text-sm leading-relaxed text-slate-500 mt-2">
                  Granular control separating Standard User task CRUD boundaries from Administrator user listings and audit logs.
                </p>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-xs mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Detailed Audit Logs</h3>
                <p className="text-sm leading-relaxed text-slate-500 mt-2">
                  Log activity details from creation, updates, and deletes down to the requesting IP, action types, and user identities.
                </p>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-xs mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Advanced Analytics</h3>
                <p className="text-sm leading-relaxed text-slate-500 mt-2">
                  Dashboard charts summarize tasks counts, status distributions, and priorities ratios in a streamlined visual layout.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white py-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} SecureTask Pro. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
export { Landing };
