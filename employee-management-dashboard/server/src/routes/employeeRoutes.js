import { Router } from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Every employee route requires a valid JWT.
router.use(protect);

// Stats route is declared before "/:id" so "stats" isn't treated as an id.
router.get('/stats/summary', asyncHandler(getStats));

router.route('/').get(asyncHandler(getEmployees)).post(asyncHandler(createEmployee));

router
  .route('/:id')
  .get(asyncHandler(getEmployee))
  .put(asyncHandler(updateEmployee))
  .delete(asyncHandler(deleteEmployee));

export default router;
