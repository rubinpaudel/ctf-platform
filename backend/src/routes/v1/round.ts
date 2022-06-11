import { Router } from 'express';
import { CreateRound } from '../../controllers/round/CreateRound';
import { EditRound } from '../../controllers/round/EditRound';
import { DeleteRound } from '../../controllers/round/DeleteRound';
import { RoundNameAvailable } from '../../controllers/round/RoundNameAvailable';
import { ListRounds } from '../../controllers/round/ListRounds';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { CheckJwt } from '../../middleware/checkJwt';
import { filterChallengesOnRound } from '../../controllers/round/filterChallengesOnRound';

const router = Router();

router.get('/',[CheckJwt] ,ListRounds);
router.post('/', [CheckJwt, CheckAdmin], CreateRound)
router.get('/nameAvailable/:name', RoundNameAvailable);
router.get('/filterCatOnRound/:roundId', [CheckJwt, CheckAdmin], filterChallengesOnRound)
router.post('/delete/:id', [CheckJwt, CheckAdmin], DeleteRound)
router.put('/:id', [CheckJwt, CheckAdmin], EditRound)

export default router;