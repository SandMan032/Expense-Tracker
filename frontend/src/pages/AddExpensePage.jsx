import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AddExpenseCard from '../components/AddExpenseCard.jsx';
import EmptyStateCard from '../components/EmptyStateCard.jsx';
import { ReceiptIcon, UsersIcon } from '../components/Icons.jsx';
import useGroups from '../hooks/useGroups.js';

function AddExpensePage() {
  const { groups, isLoading, error } = useGroups();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGroupId, setSelectedGroupId] = useState(
    searchParams.get('groupId') || '',
  );
  const requestedGroupId = searchParams.get('groupId');

  useEffect(() => {
    if (!requestedGroupId) {
      if (selectedGroupId) {
        setSelectedGroupId('');
      }

      return;
    }

    const groupExists = groups.some((group) => group._id === requestedGroupId);

    if (!groupExists) {
      if (selectedGroupId) {
        setSelectedGroupId('');
      }

      setSearchParams({}, { replace: true });
      return;
    }

    if (requestedGroupId !== selectedGroupId) {
      setSelectedGroupId(requestedGroupId);
    }
  }, [
    groups,
    requestedGroupId,
    selectedGroupId,
    setSearchParams,
  ]);

  const selectedGroup = useMemo(
    () => groups.find((group) => group._id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);

    if (groupId) {
      setSearchParams({ groupId });
      return;
    }

    setSearchParams({});
  };

  if (!isLoading && groups.length === 0) {
    return (
      <EmptyStateCard
        title="No groups available"
        description="Create a group first so you can choose it here and start adding expenses."
        action={
          <Link
            to="/"
            className="inline-flex rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Go to create group
          </Link>
        }
      />
    );
  }

  return (
    <div key={selectedGroup ? `form-${selectedGroup._id}` : 'groups'} className="page-transition">
      {selectedGroup ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 shadow-xl shadow-slate-200/70">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Selected Group
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {selectedGroup.name}
              </h2>
              <p className="text-sm text-slate-600">
                {selectedGroup.members.join(', ')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleGroupChange('')}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Go back to groups
            </button>
          </div>

          <AddExpenseCard group={selectedGroup} />
        </div>
      ) : (
        <section className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
              <ReceiptIcon className="h-4 w-4" />
              Groups
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Choose a group for this expense
            </h2>
            <p className="text-sm text-slate-600">
              Select one of your created groups to move into the expense form.
            </p>
          </div>

          {error ? (
            <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading groups...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => (
                <button
                  key={group._id}
                  type="button"
                  onClick={() => handleGroupChange(group._id)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/40 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {group.name}
                    </h3>

                    <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <UsersIcon className="h-4 w-4 text-teal-600" />
                      {group.members.length} members
                    </p>

                    <p className="text-sm text-slate-600">
                      {group.members.join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default AddExpensePage;
