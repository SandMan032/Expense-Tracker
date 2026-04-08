import { ReceiptIcon } from './Icons.jsx';

function EmptyStateCard({ title, description, action }) {
  return (
    <section className="rounded-2xl border border-dashed border-teal-200 bg-white/85 p-8 text-center shadow-xl shadow-slate-200/50">
      <div className="mx-auto max-w-md space-y-3">
        <div className="mx-auto inline-flex rounded-2xl bg-teal-50 p-3 text-teal-600 ring-1 ring-teal-100">
          <ReceiptIcon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
        {action}
      </div>
    </section>
  );
}

export default EmptyStateCard;
