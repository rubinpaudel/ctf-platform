import { Router } from 'express';

import { Register } from '../../controllers/auth/register';
import { Login } from '../../controllers/auth/login';

import { RegisterValidator } from '../../middleware/validation/auth/registerValidator'
import { LoginValidator } from '../../middleware/validation/auth/loginValidator';
import { ActivateAccount } from '../../controllers/auth/activateAccount';
import { GetResetPasswordCode } from '../../controllers/auth/getResetPasswordCode';
import { ResetPassword } from '../../controllers/auth/resetPassword';
import { RegisterAdmin } from '../../controllers/auth/registerAdmin';
import { ResetValidator } from '../../middleware/validation/auth/resetValidator';
import { CheckJwt } from '../../middleware/checkJwt';
import { CheckAdmin } from '../../middleware/checkAdmin';


const router = Router();

router.post('/register', [RegisterValidator], Register);

router.post('/login', [LoginValidator], Login);

router.get('/activate/:activationCode', ActivateAccount);

router.get('/reset-password/:email', GetResetPasswordCode);

router.post('/reset-password/',[ResetValidator], ResetPassword);

router.post('/registerAdmin', [CheckJwt, CheckAdmin], RegisterAdmin);

export default router;