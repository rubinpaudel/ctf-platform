import { Router } from 'express';

import auth from './auth';
import docker from './docker/';
import team from './team';
import round from './round';
import challenge from './challenge';
import user from './user';
import hint from './hint';
import competition from './competition'
import attachment from './attachment';
import flags from './flag';

const router = Router();

router.use('/auth', auth);
router.use('/docker', docker);
router.use('/team', team);
router.use('/hint', hint);
router.use('/round', round);
router.use('/user', user);
router.use('/challenge', challenge);
router.use('/competition', competition);
router.use('/attachment', attachment)
router.use('/flags', flags)

export default router;