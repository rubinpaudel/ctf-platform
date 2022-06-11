import { Router } from "express";
import { GetFlags } from "../../controllers/challenge/getFlags";
import { SubmitFlag } from "../../controllers/challenge/SubmitFlag";
import { CheckAdmin } from "../../middleware/checkAdmin";
import { CheckJwt } from "../../middleware/checkJwt";


const router = Router();


router.post('/submit/:id', [CheckJwt], SubmitFlag);
router.get('/:id', [CheckJwt, CheckAdmin], GetFlags);


export default router;