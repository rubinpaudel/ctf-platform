import { Router } from 'express';
import { CreateContainer } from '../../../controllers/docker/createContainer';
import { GetContainers } from '../../../controllers/docker/getContainers';
import { IsRunning } from '../../../controllers/docker/isRunning';
import { StartContainer } from '../../../controllers/docker/startContainer';
import { StopContainer } from '../../../controllers/docker/stopContainer';
import { CheckAdmin } from '../../../middleware/checkAdmin';
import { CheckJwt } from '../../../middleware/checkJwt';



const router = Router();

router.get('/', GetContainers)

router.post('/create', [CheckJwt, CheckAdmin], CreateContainer);
router.post('/isRunning', [CheckJwt, CheckAdmin], IsRunning)
router.post('/start', [CheckJwt, CheckAdmin], StartContainer)
router.post('/stop', [CheckJwt, CheckAdmin], StopContainer)


export default router;