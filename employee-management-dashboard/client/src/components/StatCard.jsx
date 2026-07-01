// A single KPI card. `loading` renders a small pulse placeholder instead of
// the number so the layout doesn't jump when data arrives.
const StatCard = ({ label, value, hint, accent = 'text-brand', loading }) => {
  return (
    <div className="card">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
      )}
      {hint && !loading && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

export default StatCard;
