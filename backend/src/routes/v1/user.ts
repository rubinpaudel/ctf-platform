import { Router } from 'express';
import { CheckJwt } from '../../middleware/checkJwt';

import { leaveTeam } from '../../controllers/user/leaveTeam';
import { hasTeam } from '../../controllers/user/hasTeam';
import { listUsersWithFiltering } from '../../controllers/user/listUsersWithFiltering';
import { GetUserCategories } from '../../controllers/user/getUserCategories';
import { AddCategory } from '../../controllers/user/AddCategory';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { DeleteCategory } from '../../controllers/user/DeleteCategory';
import { DeleteUser } from '../../controllers/user/DeleteUser';
import { UpdateCategoryName } from '../../controllers/user/UpdateCategoryName';
import { UpdateCategoryLevel } from '../../controllers/user/UpdateCategoryLevel';
import { nameAvailable } from '../../controllers/user/nameAvailable';

import { myCategory } from '../../controllers/user/myCategory';
import { myName } from '../../controllers/user/myName';
import { myEmail } from '../../controllers/user/myEmail';

const router = Router();

router.post('/leaveTeam', [CheckJwt], leaveTeam);
router.get('/listUsers', listUsersWithFiltering);
router.get('/team', [CheckJwt], hasTeam);
router.get('/nameAvailable/:name', nameAvailable);
router.get('/categories', GetUserCategories);
router.post('/category', [CheckJwt, CheckAdmin], AddCategory);
router.delete('/category/:id', [CheckJwt, CheckAdmin], DeleteCategory);
router.put('/categoryName/:id', [CheckJwt, CheckAdmin], UpdateCategoryName);
router.put('/categoryLevel/:id', [CheckJwt, CheckAdmin], UpdateCategoryLevel);
router.post('/delete/:id', [CheckJwt, CheckAdmin], DeleteUser);

router.get('/myCategory', [CheckJwt], myCategory);
router.get('/myName', [CheckJwt], myName);
router.get('/myEmail', [CheckJwt], myEmail);


export default router;