import { Router } from 'express';

import container from './container'
import image from './images'

const router = Router();


router.use('/container', container)
router.use('/image', image)

export default router;