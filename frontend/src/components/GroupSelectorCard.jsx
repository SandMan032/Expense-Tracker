function GroupSelectorCard({
  groups,
  selectedGroupId,
  onGroupChange,
  isLoading,
  error,
  title,
  description,
}) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Groups
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="group-selector">
          Select group
        </label>
        <select
          id="group-selector"
          value={selectedGroupId}
          onChange={(event) => onGroupChange(event.target.value)}
          disabled={isLoading || groups.length === 0}
          className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          <option value="">
            {isLoading ? 'Loading groups...' : 'Select a group'}
          </option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}

export default GroupSelectorCard;
