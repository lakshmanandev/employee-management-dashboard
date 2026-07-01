import { DEPARTMENTS, STATUSES } from '../constants.js';

/**
 * Search + filter toolbar. Fully controlled by the parent (Dashboard owns the
 * state); this component only renders inputs and reports changes upward. The
 * search box updates on every keystroke, but the parent debounces it before
 * hitting the API.
 */
const FilterBar = ({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  onClear,
}) => {
  // Show the "Clear" button only when at least one filter is active.
  const hasFilters = search || department || status;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Search by name or email */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter by department */}
      <select
        className="input sm:w-48"
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">All Departments</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Filter by status */}
      <select
        className="input sm:w-40"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button className="btn-secondary whitespace-nowrap" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
