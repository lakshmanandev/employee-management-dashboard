// Simple, reusable loading spinner. `fullScreen` centers it in the viewport
// (used while auth state is resolving); otherwise it's inline.
const Spinner = ({ fullScreen = false, label = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
  }
  return <div className="flex justify-center py-10">{spinner}</div>;
};

export default Spinner;
