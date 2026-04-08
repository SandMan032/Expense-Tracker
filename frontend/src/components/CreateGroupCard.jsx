import { useState } from 'react';
import { PlusIcon, UsersIcon } from './Icons.jsx';

function CreateGroupCard({ onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddMember = () => {
    const normalizedMemberName = memberName.trim();

    if (!normalizedMemberName) {
      setErrorMessage('Enter a member name before adding.');
      return;
    }

    if (members.includes(normalizedMemberName)) {
      setErrorMessage('This member has already been added.');
      return;
    }

    setMembers((currentMembers) => [...currentMembers, normalizedMemberName]);
    setMemberName('');
    setErrorMessage('');
  };

  const handleRemoveMember = (memberToRemove) => {
    setMembers((currentMembers) =>
      currentMembers.filter((member) => member !== memberToRemove),
    );
  };

  const handleMemberKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleAddMember();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (members.length < 2) {
      setErrorMessage('Add at least 2 members to create a group.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName.trim(),
          members,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create group');
      }

      setGroupName('');
      setMemberName('');
      setMembers([]);
      setSuccessMessage(`Group "${data.name}" created successfully.`);
      onGroupCreated?.(data);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border-t-4 border-t-teal-500 bg-white p-8 shadow-xl shadow-slate-200/70">
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
          <UsersIcon className="h-4 w-4" />
          Create Group
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Start a new expense group
        </h1>
        <p className="text-sm text-slate-600">
          Add a group name, then build the member list one person at a time.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="group-name"
          >
            Group name
          </label>
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Weekend Trip"
            className="rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="member-name"
          >
            Add members
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="member-name"
              type="text"
              value={memberName}
              onChange={(event) => setMemberName(event.target.value)}
              onKeyDown={handleMemberKeyDown}
              placeholder="Alex"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100"
            >
              <PlusIcon className="h-4 w-4" />
              Add member
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Add at least two members before creating the group.
          </p>
          <div className="flex flex-wrap gap-3">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member}
                  className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-800"
                >
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="text-slate-400 transition hover:text-rose-500"
                    aria-label={`Remove ${member}`}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
                <div className="w-full rounded-xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-5 text-sm text-slate-500">
                  No members added yet.
                </div>
              )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
        >
          {isSubmitting ? 'Creating group...' : 'Create group'}
        </button>
      </form>

      {successMessage ? (
        <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

export default CreateGroupCard;
