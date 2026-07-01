import Employee from '../models/Employee.js';

/**
 * GET /api/employees
 * Supports pagination, debounced search (name/email), and filtering by
 * department and status. Query params:
 *   page, limit, search, department, status
 */
export const getEmployees = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const { search, department, status } = req.query;

  // Build the Mongo filter object incrementally so unused filters are skipped.
  const filter = {};

  if (search) {
    // Case-insensitive partial match on either name or email.
    const rx = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (department) filter.department = department;
  if (status) filter.status = status;

  // Run the count and the page query together for speed.
  const [total, employees] = await Promise.all([
    Employee.countDocuments(filter),
    Employee.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({
    data: employees,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  });
};

// GET /api/employees/:id
export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json(employee);
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;
  const employee = await Employee.create({
    name,
    email,
    department,
    designation,
    status,
    joiningDate,
  });
  res.status(201).json(employee);
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document
    runValidators: true, // enforce schema (enums, required) on update
  });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json(employee);
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json({ message: 'Employee deleted', id: req.params.id });
};

/**
 * GET /api/employees/stats/summary
 * Aggregated numbers powering the analytics cards + charts. Computing this
 * on the server (via aggregation) keeps the client light and accurate even
 * when only one page of employees is loaded in the table.
 */
export const getStats = async (req, res) => {
  const [total, active, byDepartment, byStatus, byMonth] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'Active' }),

    // Department-wise count -> bar chart
    Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // Status distribution -> pie chart
    Employee.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

    // Monthly joined employees -> line chart (grouped by year-month)
    Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$joiningDate' },
            month: { $month: '$joiningDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  res.json({
    total,
    active,
    inactive: total - active,
    byDepartment: byDepartment.map((d) => ({ department: d._id, count: d.count })),
    byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
    byMonth: byMonth.map((m) => ({
      // Format as "YYYY-MM" for a stable, sortable x-axis label.
      month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
      count: m.count,
    })),
  });
};
