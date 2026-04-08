import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyStateCard from '../components/EmptyStateCard.jsx';
import GroupDashboard from '../components/GroupDashboard.jsx';
import { ArrowsIcon, UsersIcon } from '../components/Icons.jsx';
import useGroups from '../hooks/useGroups.js';

function DashboardPage() {
  const { groups, isLoading, error, refreshGroups } = useGroups();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGroupId, setSelectedGroupId] = useState(
    searchParams.get('groupId') || '',
  );
  const requestedGroupId = searchParams.get('groupId');
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [dashboardError, setDashboardError] = useState('');
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState('');

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

  useEffect(() => {
    const loadDashboard = async () => {
      if (!selectedGroupId) {
        setExpenses([]);
        setBalances({});
        setSettlements([]);
        setDashboardError('');
        return;
      }

      try {
        setIsDashboardLoading(true);
        setDashboardError('');

        const [expensesResponse, balancesResponse, settlementsResponse] =
          await Promise.all([
            fetch(`/groups/${selectedGroupId}/expenses`),
            fetch(`/groups/${selectedGroupId}/balances`),
            fetch(`/groups/${selectedGroupId}/settlements`),
          ]);

        const [expensesData, balancesData, settlementsData] = await Promise.all([
          expensesResponse.json(),
          balancesResponse.json(),
          settlementsResponse.json(),
        ]);

        if (!expensesResponse.ok) {
          throw new Error(expensesData.message || 'Failed to fetch expenses');
        }

        if (!balancesResponse.ok) {
          throw new Error(balancesData.message || 'Failed to fetch balances');
        }

        if (!settlementsResponse.ok) {
          throw new Error(
            settlementsData.message || 'Failed to fetch settlements',
          );
        }

        setExpenses(expensesData);
        setBalances(balancesData);
        setSettlements(settlementsData);
      } catch (loadError) {
        setDashboardError(loadError.message || 'Failed to load dashboard');
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadDashboard();
  }, [selectedGroupId]);

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

  const handleDeleteGroup = async (event, groupId) => {
    event.stopPropagation();

    const groupToDelete = groups.find((group) => group._id === groupId);

    if (!groupToDelete) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${groupToDelete.name}" and all its expenses?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingGroupId(groupId);
      setDashboardError('');

      const response = await fetch(`/groups/${groupId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete group');
      }

      if (selectedGroupId === groupId) {
        handleGroupChange('');
      }

      await refreshGroups();
    } catch (deleteError) {
      setDashboardError(deleteError.message || 'Failed to delete group');
    } finally {
      setDeletingGroupId('');
    }
  };

  if (!isLoading && groups.length === 0) {
    return (
      <EmptyStateCard
        title="No groups available"
        description="Create a group first so you can choose one here and inspect balances and settlements."
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
    <div
      key={selectedGroup ? `dashboard-${selectedGroup._id}` : 'groups'}
      className="page-transition"
    >
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

          {dashboardError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {dashboardError}
            </p>
          ) : null}

          {isDashboardLoading ? (
            <section className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
              <p className="text-sm text-slate-500">Loading dashboard...</p>
            </section>
          ) : (
            <GroupDashboard
              group={selectedGroup}
              expenses={expenses}
              balances={balances}
              settlements={settlements}
            />
          )}
        </div>
      ) : (
        <section className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
              <ArrowsIcon className="h-4 w-4" />
              Groups
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Choose a group to view its dashboard
            </h2>
            <p className="text-sm text-slate-600">
              Select a group to open its balances and settlements, or delete groups you no longer need.
            </p>
          </div>

          {error ? (
            <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {dashboardError ? (
            <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {dashboardError}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading groups...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => (
                <article
                  key={group._id}
                  onClick={() => handleGroupChange(group._id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleGroupChange(group._id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 pr-14 text-left transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50/30 hover:shadow-lg hover:shadow-slate-200/60 focus:outline-none focus:ring-4 focus:ring-teal-100"
                >
                  <button
                    type="button"
                    onClick={(event) => handleDeleteGroup(event, group._id)}
                    disabled={deletingGroupId === group._id}
                    className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-slate-300"
                    aria-label={`Delete ${group.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.75A1.5 1.5 0 0 1 10.5 2.25h3A1.5 1.5 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5h-.538l-.853 12.214A2.25 2.25 0 0 1 15.116 20.25H8.884a2.25 2.25 0 0 1-2.243-2.036L5.788 6H5.25a.75.75 0 0 1 0-1.5H9v-.75ZM10.5 4.5h3v-.75h-3v.75Zm-1.28 4.22a.75.75 0 0 1 1.5.06l-.25 7a.75.75 0 1 1-1.499-.06l.249-7Zm5.56 0a.75.75 0 1 0-1.5.06l.25 7a.75.75 0 1 0 1.499-.06l-.249-7Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

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
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
