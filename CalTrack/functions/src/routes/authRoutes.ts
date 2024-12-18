import {Router} from 'express';
import {registerUser, loginUser} from '../controllers/authController';
import {validate} from '../middlewares/validate';
import {userLoginSchema, userRegistrationSchema} from '../schemas/userSchema';

const router = Router();

router.post('/register', validate(userRegistrationSchema), registerUser);
router.post('/login', validate(userLoginSchema), loginUser);

export default router;
