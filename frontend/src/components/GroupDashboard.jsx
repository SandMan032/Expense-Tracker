import { useEffect, useState } from 'react';
import { ArrowsIcon, ReceiptIcon, WalletIcon } from './Icons.jsx';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);

const getBillImageUrl = (billImage) => {
  if (!billImage) {
    return '';
  }

  if (billImage.startsWith('http://') || billImage.startsWith('https://')) {
    return billImage;
  }

  const normalizedPath = billImage.startsWith('/')
    ? billImage
    : `/${billImage.replace(/^\.?\//, '')}`;

  return `http://localhost:5001${normalizedPath}`;
};

function CardSection({ title, children, accentClass, icon }) {
  return (
    <section className={`rounded-2xl border-t-4 bg-white p-6 shadow-xl shadow-slate-200/70 ${accentClass}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ImageLightbox({ imageUrl, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl rounded-2xl bg-white p-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Bill image preview"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow transition hover:bg-slate-100"
        >
          Close
        </button>
        <img
          src={imageUrl}
          alt="Full bill"
          className="max-h-[calc(90vh-1.5rem)] w-full rounded-xl object-contain"
        />
      </div>
    </div>
  );
}

function ExpensesList({ expenses }) {
  const [activeImageUrl, setActiveImageUrl] = useState('');

  if (expenses.length === 0) {
    return <p className="text-sm text-slate-500">No expenses yet</p>;
  }

  return (
    <>
      <ul className="divide-y divide-slate-100">
        {expenses.map((expense) => {
          const imageUrl = getBillImageUrl(expense.billImage);

          return (
            <li
              key={expense._id}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </span>
                <span className="text-sm text-slate-500">
                  Paid by {expense.paidBy}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Participants: {expense.participants.join(', ')}
              </p>
              {expense.billImage ? (
                <button
                  type="button"
                  onClick={() => setActiveImageUrl(imageUrl)}
                  className="mt-2 overflow-hidden rounded-xl border border-amber-100 bg-amber-50/50 shadow-sm transition hover:border-amber-200 hover:shadow"
                >
                  <img
                    src={imageUrl}
                    alt="Uploaded bill"
                    className="max-h-[150px] w-full object-contain"
                  />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      {activeImageUrl ? (
        <ImageLightbox
          imageUrl={activeImageUrl}
          onClose={() => setActiveImageUrl('')}
        />
      ) : null}
    </>
  );
}

function BalancesList({ balances, members }) {
  const items = members.map((member) => ({
    name: member,
    balance: balances[member] ?? 0,
  }));

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Create a group to view balances.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => {
        const toneClass =
          item.balance > 0
            ? 'text-emerald-600'
            : item.balance < 0
              ? 'text-rose-600'
              : 'text-slate-500';

        return (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-700">{item.name}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${toneClass} ${item.balance > 0 ? 'bg-emerald-50' : item.balance < 0 ? 'bg-rose-50' : 'bg-slate-100'}`}>
              {formatCurrency(item.balance)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function SettlementsList({ settlements, hasExpenses }) {
  if (!hasExpenses || settlements.length === 0) {
    return <p className="text-sm text-slate-500">No settlements needed</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {settlements.map((settlement, index) => (
        <li
          key={`${settlement.from}-${settlement.to}-${index}`}
          className="py-4 first:pt-0 last:pb-0"
        >
          <p className="text-sm text-slate-700">
            <span className="font-medium text-slate-900">{settlement.from}</span>{' '}
            pays{' '}
            <span className="font-medium text-slate-900">{settlement.to}</span>{' '}
            <span className="font-semibold text-teal-700">
              {formatCurrency(settlement.amount)}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

function GroupDashboard({ group, expenses, balances, settlements }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <CardSection
        title="Expenses list"
        accentClass="border-t-amber-400"
        icon={<ReceiptIcon className="h-5 w-5" />}
      >
        <ExpensesList expenses={expenses} />
      </CardSection>

      <CardSection
        title="Balances per member"
        accentClass="border-t-emerald-500"
        icon={<WalletIcon className="h-5 w-5" />}
      >
        <BalancesList balances={balances} members={group?.members ?? []} />
      </CardSection>

      <CardSection
        title="Settlement transactions"
        accentClass="border-t-teal-500"
        icon={<ArrowsIcon className="h-5 w-5" />}
      >
        <SettlementsList
          settlements={settlements}
          hasExpenses={expenses.length > 0}
        />
      </CardSection>
    </div>
  );
}

export default GroupDashboard;
