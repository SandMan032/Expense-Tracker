import { useEffect, useRef, useState } from 'react';
import { ReceiptIcon } from './Icons.jsx';

function AddExpenseCard({ group, onExpenseAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([]);
  const [billFile, setBillFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const members = group?.members ?? [];

  useEffect(() => {
    setTitle('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
    setBillFile(null);
    setErrors({});
    setSuccessMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [group?._id]);

  const toggleParticipant = (member) => {
    setParticipants((currentParticipants) => {
      if (currentParticipants.includes(member)) {
        return currentParticipants.filter((participant) => participant !== member);
      }

      return [...currentParticipants, member];
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const normalizedTitle = title.trim();
    const numericAmount = Number(amount);

    if (!normalizedTitle) {
      nextErrors.title = 'Enter a title for this expense.';
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than 0.';
    }

    if (!paidBy) {
      nextErrors.paidBy = 'Select who paid for this expense.';
    }

    if (participants.length === 0) {
      nextErrors.participants = 'Select at least one participant.';
    }

    if (!group?._id) {
      nextErrors.form = 'Create a group first to start adding expenses.';
    }

    return nextErrors;
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
    setBillFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setBillFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        bill: 'Select a valid image file.',
      }));
      setBillFile(null);
      event.target.value = '';
      return;
    }

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors.bill;
      return nextErrors;
    });
    setBillFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    setSuccessMessage('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('groupId', group._id);
      formData.append('title', title.trim());
      formData.append('amount', amount);
      formData.append('paidBy', paidBy);
      formData.append('participants', JSON.stringify(participants));

      if (billFile) {
        formData.append('bill', billFile);
      }

      const response = await fetch('/expenses', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add expense');
      }

      resetForm();
      setSuccessMessage('Expense added successfully.');
      onExpenseAdded?.(data);
    } catch (error) {
      setErrors({
        form: error.message || 'Something went wrong while adding the expense.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border-t-4 border-t-amber-400 bg-white p-8 shadow-xl shadow-slate-200/70">
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
          <ReceiptIcon className="h-4 w-4" />
          Expenses
        </div>
        <h2 className="text-3xl font-semibold text-slate-900">Add Expense</h2>
        <p className="text-sm text-slate-600">
          {group?._id
            ? `Adding expenses to ${group.name}.`
            : 'Create a group first, then add expenses for its members.'}
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="expense-title"
          >
            Expense title
          </label>
          <input
            id="expense-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Dinner at the cafe"
            className="rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {errors.title ? (
            <p className="text-sm text-rose-600">{errors.title}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="expense-amount"
          >
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ₹
            </span>
            <input
              id="expense-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-200 py-3 pl-9 pr-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>
          {errors.amount ? (
            <p className="text-sm text-rose-600">{errors.amount}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="paid-by"
          >
            Paid By
          </label>
          <select
            id="paid-by"
            value={paidBy}
            onChange={(event) => setPaidBy(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            disabled={members.length === 0}
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          {errors.paidBy ? (
            <p className="text-sm text-rose-600">{errors.paidBy}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-slate-700">Participants</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {members.length > 0 ? (
              members.map((member) => (
                <label
                  key={member}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:border-teal-300 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={participants.includes(member)}
                    onChange={() => toggleParticipant(member)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{member}</span>
                </label>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Group members will appear here once a group is created.
              </div>
            )}
          </div>
          {errors.participants ? (
            <p className="text-sm text-rose-600">{errors.participants}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="bill">
            Bill image
          </label>
          <input
            id="bill"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-medium file:text-teal-700 hover:file:bg-teal-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {billFile ? (
            <p className="text-sm text-slate-500">Selected file: {billFile.name}</p>
          ) : (
            <p className="text-sm text-slate-500">Upload a JPEG or PNG bill image.</p>
          )}
          {errors.bill ? (
            <p className="text-sm text-rose-600">{errors.bill}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !group?._id}
          className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
        >
          {isSubmitting ? 'Adding expense...' : 'Add expense'}
        </button>
      </form>

      {successMessage ? (
        <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {errors.form ? (
        <p className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errors.form}
        </p>
      ) : null}
    </section>
  );
}

export default AddExpenseCard;
