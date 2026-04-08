import { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateGroupCard from '../components/CreateGroupCard.jsx';

function CreateGroupPage() {
  const [createdGroup, setCreatedGroup] = useState(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <CreateGroupCard onGroupCreated={setCreatedGroup} />

      <section className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Workflow
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Create once, use everywhere
          </h2>
        </div>

        {createdGroup ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-sky-100 bg-sky-50 p-6">
            <div>
              <p className="text-sm font-medium text-sky-700">Latest group</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                {createdGroup.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Members: {createdGroup.members.join(', ')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/expenses?groupId=${createdGroup._id}`}
                className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Add expenses
              </Link>
              <Link
                to={`/dashboard?groupId=${createdGroup._id}`}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8">
            <p className="text-sm text-slate-500">
              Create a group here, then move to the next page to record expenses or review balances.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default CreateGroupPage;
