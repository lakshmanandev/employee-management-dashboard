import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import StatCard from './StatCard.jsx';

// Fixed colors so a status always renders the same hue across charts.
const STATUS_COLORS = { Active: '#22c55e', Inactive: '#9ca3af' };
const BAR_COLOR = '#4f46e5';
const LINE_COLOR = '#4f46e5';

// Wrapper giving every chart a titled card with a consistent height.
const ChartCard = ({ title, children, empty }) => (
  <div className="card">
    <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
    {empty ? (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No data to display
      </div>
    ) : (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

/**
 * Analytics section: four KPI cards + three charts. All numbers come from the
 * server's aggregation endpoint (via the useStats hook in the parent), so they
 * reflect the entire dataset — not just the currently visible table page.
 */
const Analytics = ({ stats, loading, error }) => {
  if (error) {
    return (
      <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  // Safe fallbacks so the charts render (empty) during the initial load.
  const byDepartment = stats?.byDepartment || [];
  const byStatus = stats?.byStatus || [];
  const byMonth = stats?.byMonth || [];

  return (
    <section className="mb-6">
      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Employees" value={stats?.total ?? 0} loading={loading} />
        <StatCard
          label="Active"
          value={stats?.active ?? 0}
          accent="text-green-600"
          loading={loading}
        />
        <StatCard
          label="Inactive"
          value={stats?.inactive ?? 0}
          accent="text-gray-500"
          loading={loading}
        />
        <StatCard
          label="Departments"
          value={byDepartment.length}
          accent="text-brand"
          loading={loading}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Department-wise count -> Bar chart */}
        <ChartCard title="Employees by Department" empty={!loading && byDepartment.length === 0}>
          <BarChart data={byDepartment} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        {/* Status distribution -> Pie chart */}
        <ChartCard title="Status Distribution" empty={!loading && byStatus.length === 0}>
          <PieChart>
            <Pie
              data={byStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(e) => `${e.status}: ${e.count}`}
            >
              {byStatus.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#c7d2fe'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        {/* Monthly joined employees -> Line chart (spans full width) */}
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Joined Employees" empty={!loading && byMonth.length === 0}>
            <LineChart data={byMonth} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke={LINE_COLOR}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
