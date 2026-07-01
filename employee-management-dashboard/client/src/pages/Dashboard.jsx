import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Analytics from '../components/Analytics.jsx';
import FilterBar from '../components/FilterBar.jsx';
import EmployeeTable from '../components/EmployeeTable.jsx';
import Pagination from '../components/Pagination.jsx';
import EmployeeFormModal from '../components/EmployeeFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useEmployees } from '../hooks/useEmployees.js';
import { useStats } from '../hooks/useStats.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { PAGE_SIZE } from '../constants.js';
import api from '../api/axios.js';

const Dashboard = () => {
  const [page, setPage] = useState(1);

  // --- Search & filter state ---
  const [search, setSearch] = useState(''); // raw input (updates each keystroke)
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  // Debounce the search so we query only after the user pauses typing.
  const debouncedSearch = useDebounce(search, 400);

  // Any filter change should send the user back to page 1, otherwise they
  // could be stranded on, say, page 4 of a now much shorter result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  // Load employees for the current page + active filters.
  const { employees, total, totalPages, loading, error, refresh } = useEmployees({
    page,
    search: debouncedSearch,
    department,
    status,
  });

  // Analytics come from a separate aggregation endpoint (whole dataset).
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useStats();

  // After any mutation we refresh BOTH the table and the analytics so the
  // cards/charts stay in sync with the data.
  const refreshAll = async () => {
    await Promise.all([refresh(), refreshStats()]);
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
  };

  // --- Create / Edit modal state ---
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // --- Delete confirmation state ---
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setSubmitError('');
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setEditing(employee);
    setSubmitError('');
    setFormOpen(true);
  };

  // Handles both create (POST) and edit (PUT) based on whether we're editing.
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      if (editing) {
        await api.put(`/employees/${editing._id}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      setFormOpen(false);
      setEditing(null);
      await refreshAll(); // re-pull table + analytics so everything reflects changes
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Could not save employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget._id}`);
      // If we just removed the last row on a page beyond the first, step back
      // a page so the user isn't left staring at an empty table.
      if (employees.length === 1 && page > 1) {
        setPage((p) => p - 1);
        await refreshStats(); // page change re-fetches the table; stats still need it
      } else {
        await refreshAll();
      }
      setDeleteTarget(null);
    } catch (err) {
      // Surface the failure but keep the dialog open so the user can retry.
      alert(err.response?.data?.message || 'Could not delete employee.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Page header + primary action */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-500">
              {loading ? 'Loading…' : `${total} total employee${total === 1 ? '' : 's'}`}
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            + Add Employee
          </button>
        </div>

        {/* Analytics: KPI cards + department bar, status pie, monthly-joins line. */}
        <Analytics stats={stats} loading={statsLoading} error={statsError} />

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          status={status}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        <EmployeeTable
          employees={employees}
          loading={loading}
          error={error}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        {!loading && !error && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </main>

      {/* Create / Edit modal */}
      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        employee={editing}
        submitting={submitting}
        submitError={submitError}
      />

      {/* Delete confirmation popup */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete employee"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Dashboard;
