import { Router } from 'express';
import { GetImages } from '../../../controllers/docker/getImages';
import { GetPorts } from '../../../controllers/docker/getPorts';
import { GetPortsByChallenge } from '../../../controllers/docker/GetPortsByChallenge';
import { CheckAdmin } from '../../../middleware/checkAdmin';
import { CheckJwt } from '../../../middleware/checkJwt';




const router = Router();

router.get('/', [CheckJwt, CheckAdmin], GetImages);
router.get('/ports/:id', [CheckJwt, CheckAdmin], GetPorts);
router.get('/challenge-ports/:id', [CheckJwt], GetPortsByChallenge);


export default router;