import StatusBadge from './StatusBadge.jsx';
import { formatDate } from '../utils/format.js';

// Column headers reused for both the header row and skeleton widths.
const COLUMNS = ['Name', 'Email', 'Department', 'Designation', 'Status', 'Joining Date', ''];

// Gray placeholder rows shown while data is loading (skeleton UI).
const SkeletonRows = ({ rows = 6 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-t border-gray-100">
      {COLUMNS.map((_, c) => (
        <td key={c} className="px-4 py-3">
          <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  ));

/**
 * Presentational table. All data + handlers come from the parent so this
 * component stays reusable and easy to test. Handles three UI states:
 * loading (skeleton), error, and empty.
 */
const EmployeeTable = ({ employees, loading, error, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Horizontal scroll on small screens keeps the table readable on mobile. */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {COLUMNS.map((c, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <SkeletonRows />}

            {!loading &&
              employees.map((emp) => (
                <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {emp.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{emp.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {emp.department}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {emp.designation}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatDate(emp.joiningDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(emp)}
                        className="text-sm font-medium text-brand hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Error state */}
      {!loading && error && (
        <div className="px-4 py-10 text-center text-sm text-red-600">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && employees.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-sm font-medium text-gray-700">No employees found</p>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your search or filters, or add a new employee.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
