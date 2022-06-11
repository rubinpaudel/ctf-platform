import { Router } from 'express';
import { CheckJwt } from '../../middleware/checkJwt';

import { create } from '../../controllers/team/create';
import { join } from '../../controllers/team/join';
import { deleteTeam } from '../../controllers/team/deleteTeam';
import { removeUser } from '../../controllers/team/removeUser';
import { listTeamsWithFiltering } from '../../controllers/team/listTeamsWithFiltering';
import { GetMaxTeamSize } from '../../controllers/team/getMaxTeamSize';
import { UpdateMaxTeamSize } from '../../controllers/team/updateMaxTeamSize';
import { getTeam } from '../../controllers/team/getTeam';
import { getPurchasedHints } from '../../controllers/team/getPurchasedHints';
import { removePurchasedHint } from '../../controllers/team/removePurchasedHint';
import { getSolvedChallenges } from '../../controllers/team/getSolvedChallenges';
import { getNumberOfAttempts } from '../../controllers/team/getNumberOfAttempts';
import { getTeamPointsPerRound } from '../../controllers/team/getTeamPointsPerRound';
import { removeSolvedChallenge } from '../../controllers/team/removeSolvedChallenge';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { getTeamIdByUserId } from '../../controllers/team/getTeamIdByUserId';
import { addPointsToTeam } from '../../controllers/team/addPointsToTeam';
import { SubmitFlag } from '../../controllers/challenge/SubmitFlag';

const router = Router();

router.post('/create', [CheckJwt], create);
router.post('/join/:id', [CheckJwt], join);
router.post('/delete/:id', [CheckJwt], deleteTeam);
router.post('/removeUser/:teamid/:userid', [CheckJwt], removeUser);
router.get('/listTeams' ,listTeamsWithFiltering);
router.get('/size', GetMaxTeamSize);
router.post('/size', [CheckJwt, CheckAdmin], UpdateMaxTeamSize);
router.get('/getTeam/:id', getTeam);
router.get('/getTeamPointsPerRound/:id', getTeamPointsPerRound);
router.get('/getPurchasedHints/:id', getPurchasedHints);
router.get('/getSolvedChallenges/:id', getSolvedChallenges);
router.get('/getNumberOfAttempts/:id', getNumberOfAttempts);
router.post('/removePurchasedHint/:purchasedId', [CheckJwt, CheckAdmin], removePurchasedHint);
router.post('/removeSolvedChallenge/:solvedId', [CheckJwt, CheckAdmin], removeSolvedChallenge);
router.get('/getTeamIdByUserId/:id', [CheckJwt], getTeamIdByUserId);
router.post('/addPoints/:id', [CheckJwt, CheckAdmin], addPointsToTeam);



import { CompleteQuiz } from '../../controllers/challenge/CompleteQuiz';
import { filterByChallenge } from '../../controllers/hint/filterByChallenge';
import { EditChallenge } from '../../controllers/challenge/editChallenge';


router.put('/editChallenge/:id', [CheckJwt, CheckAdmin], EditChallenge)
router.post('/completeQuiz/:id', [CheckJwt], CompleteQuiz);
router.get('/filterByChallenge/:challengeId', [CheckJwt], filterByChallenge);

export default router;