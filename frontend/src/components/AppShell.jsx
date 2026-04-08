import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowsIcon,
  PlusIcon,
  ReceiptIcon,
} from './Icons.jsx';

const navLinkClassName = ({ isActive }) =>
  [
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
    isActive
      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
      : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm',
  ].join(' ');

function AppShell() {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(to_bottom,_#f8fbfb,_#eef5f4)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="rounded-2xl bg-teal-50 p-2 text-teal-600 ring-1 ring-teal-100">
              <ReceiptIcon className="h-5 w-5" />
            </div>
            <p className="text-base font-semibold uppercase tracking-[0.24em] text-teal-700">
              Expense Sharing
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <NavLink className={navLinkClassName} to="/">
              <PlusIcon className="h-4 w-4" />
              Create Group
            </NavLink>
            <NavLink className={navLinkClassName} to="/expenses">
              <ReceiptIcon className="h-4 w-4" />
              Add Expenses
            </NavLink>
            <NavLink className={navLinkClassName} to="/dashboard">
              <ArrowsIcon className="h-4 w-4" />
              View Dashboard
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-32 sm:pt-28">
        <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.18),_transparent_22%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.18),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#042f2e_46%,_#0f766e_100%)] p-8 text-white shadow-2xl shadow-slate-300/60">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 right-24 h-40 w-40 rounded-full border border-teal-300/15 bg-teal-300/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-8 top-12 h-24 w-24 rotate-12 rounded-[2rem] border border-amber-200/20 bg-amber-200/10" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-sm">
              <div className="rounded-2xl bg-white/10 p-2 text-amber-200 ring-1 ring-white/10">
                <ReceiptIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-100">
                Expense Sharing
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-[2.65rem]">
                Manage groups, add expenses, and settle balances with a cleaner workflow.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-200">
                A lightweight expense-sharing workspace with bill uploads, balance tracking, and simplified settlements.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Split equally
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Image bills
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Smart settlements
              </span>
            </div>
          </div>
        </section>

        <div key={location.pathname} className="page-transition mt-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AppShell;
