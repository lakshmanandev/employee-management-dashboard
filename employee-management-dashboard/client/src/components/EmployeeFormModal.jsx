import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { DEPARTMENTS, STATUSES } from '../constants.js';
import { toDateInputValue } from '../utils/format.js';

// Empty form used when creating a new employee.
const emptyForm = {
  name: '',
  email: '',
  department: DEPARTMENTS[0],
  designation: '',
  status: 'Active',
  joiningDate: '',
};

/**
 * One modal used for BOTH create and edit. If `employee` is passed, the form
 * is pre-filled and the parent will PUT; otherwise it's blank and POSTs.
 * `onSubmit(payload)` is provided by the parent (which owns the API call so
 * it can refresh the list). `submitError` shows a server-side failure.
 */
const EmployeeFormModal = ({ open, onClose, onSubmit, employee, submitting, submitError }) => {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Re-seed the form whenever the modal opens or the target employee changes.
  // This is what makes the "edit" form arrive pre-filled.
  useEffect(() => {
    if (!open) return;
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || DEPARTMENTS[0],
        designation: employee.designation || '',
        status: employee.status || 'Active',
        joiningDate: toDateInputValue(employee.joiningDate),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [open, employee]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email';
    if (!form.designation.trim()) next.designation = 'Designation is required';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Employee' : 'Add Employee'}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {submitError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@ems.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Department</label>
            <select
              name="department"
              className="input"
              value={form.department}
              onChange={handleChange}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Designation</label>
            <input
              name="designation"
              className="input"
              value={form.designation}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
            {errors.designation && (
              <p className="mt-1 text-xs text-red-600">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              className="input"
              value={form.status}
              onChange={handleChange}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Joining Date</label>
            <input
              name="joiningDate"
              type="date"
              className="input"
              value={form.joiningDate}
              onChange={handleChange}
            />
            {errors.joiningDate && (
              <p className="mt-1 text-xs text-red-600">{errors.joiningDate}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
