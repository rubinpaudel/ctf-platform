import { Router } from 'express';
import { CheckJwt } from '../../middleware/checkJwt';

import { create } from '../../controllers/hint/create';
import { buy } from '../../controllers/hint/buy';
import { filterByUser } from '../../controllers/hint/filterByUser';
import { filterByTeam } from '../../controllers/hint/filterByTeam';
import { filterByChallenge } from '../../controllers/hint/filterByChallenge';
import { isBought } from '../../controllers/hint/isBought';
import { deleteHint } from '../../controllers/hint/deleteHint';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { GetAdminHints } from '../../controllers/hint/getAdminHints';

const router = Router();

router.post('/create', [CheckJwt, CheckAdmin], create);
router.post('/buy', [CheckJwt], buy);
router.post('/delete/:hintId', [CheckJwt], deleteHint);
router.get('/filterByUser/:userId', [CheckJwt], filterByUser);
router.get('/filterByTeam/:teamId', [CheckJwt], filterByTeam);
router.get('/filterByChallenge/:challengeId', [CheckJwt], filterByChallenge);
router.get('/isBought/:hintId', [CheckJwt], isBought)
router.get('/:challenge', [CheckJwt, CheckAdmin], GetAdminHints);


export default router;