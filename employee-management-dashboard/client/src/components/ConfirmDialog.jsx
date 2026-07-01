import Modal from './Modal.jsx';

/**
 * Confirmation popup shown before destructive actions (e.g. delete).
 * `loading` disables the buttons while the action is in flight.
 */
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
