import { Router } from 'express';
import { GetCompetitionName, GetAllowedEmailDomains, GetCompetitionStartDate, UpdateAllowedEmailDomains, UpdateCompetitionName, UpdateCompetitionStartDate, Wipe } from '../../controllers/competition/';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { CheckJwt } from '../../middleware/checkJwt';


const router = Router();

router.get('/name', GetCompetitionName);
router.get('/startDate', GetCompetitionStartDate);
router.get('/allowedEmails', GetAllowedEmailDomains);

router.post('/name', [CheckJwt, CheckAdmin], UpdateCompetitionName);
router.post('/startDate', [CheckJwt, CheckAdmin], UpdateCompetitionStartDate);
router.post('/allowedEmails', [CheckJwt, CheckAdmin], UpdateAllowedEmailDomains);

router.post('/wipe', [CheckJwt, CheckAdmin], Wipe);

export default router;