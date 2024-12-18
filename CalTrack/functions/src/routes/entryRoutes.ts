import {Router} from 'express';
import {createEntry, getEntries} from '../controllers/entryController';

const router = Router();

router.post('/', createEntry);
router.get('/:userId', getEntries);

export default router;
