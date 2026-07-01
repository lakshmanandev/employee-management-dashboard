import mongoose from 'mongoose';

// Departments and statuses are constrained so the filter dropdowns on the
// client always map to known values. Keep this list in sync with the client.
export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Support',
];

export const STATUSES = ['Active', 'Inactive'];

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: { type: String, required: true, enum: DEPARTMENTS },
    designation: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: 'Active' },
    joiningDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Compound text-ish index to speed up the debounced name/email search.
employeeSchema.index({ name: 'text', email: 'text' });

export default mongoose.model('Employee', employeeSchema);
