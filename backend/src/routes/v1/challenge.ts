import { Router } from 'express';
import { CheckAdmin } from '../../middleware/checkAdmin';
import { CheckJwt } from '../../middleware/checkJwt';
import { multerUpload } from '../../middleware/mutler';
import { EditChallenge } from '../../controllers/challenge/editChallenge';
import { GetChallenges } from '../../controllers/challenge/getChallenges';
import { CreateChallenge } from '../../controllers/challenge/createChallenge'
import { GetChallengeCategory } from '../../controllers/challenge/getChallengeCategory';
import { GetChallengeById } from '../../controllers/challenge/getChallengeById';
import { AddCategory } from '../../controllers/challenge/AddCategory';
import { UpdateCategory } from '../../controllers/challenge/UpdateCategory';
import { DeleteCategory } from '../../controllers/challenge/DeleteCategory';
import { ListChallenges } from '../../controllers/challenge/listChallenges';
import { DeleteChallenge } from '../../controllers/challenge/deleteChallenge';
import { GetChallengeAttachments } from '../../controllers/challenge/getChallengeAttachments';
import { GetChallengeAttachmentById } from '../../controllers/challenge/getChallengeAttachmentById';
import { DeleteAttachment } from '../../controllers/challenge/deleteAttachment'
import { GetFlags } from '../../controllers/challenge/getFlags';
import { SubmitFlag } from '../../controllers/challenge/SubmitFlag';
import { UpdateStatus } from '../../controllers/challenge/UpdateStatus';


const router = Router();

router.post('/create', [CheckJwt, CheckAdmin, multerUpload.array("Attachments")], CreateChallenge);
router.get('/categories', GetChallengeCategory);
router.get('/:round/:category',[CheckJwt], GetChallenges);
router.get('/', ListChallenges);
router.get('/:id', GetChallengeById);
router.post('/category', [CheckJwt, CheckAdmin], AddCategory);
router.post('/submitFlag/:id', [CheckJwt], SubmitFlag);
router.delete('/category/:id', [CheckJwt, CheckAdmin], DeleteCategory);
router.delete('/:id', [CheckJwt, CheckAdmin], DeleteChallenge);
router.put('/category/:id', [CheckJwt, CheckAdmin], UpdateCategory);
router.put('/status/:id', [CheckJwt, CheckAdmin], UpdateStatus)
router.get('/flags/:id', [CheckJwt, CheckAdmin], GetFlags);
router.get('/attachments/:id', GetChallengeAttachments);
router.get('/attachment/:id', GetChallengeAttachmentById);
router.delete('/attachment/:id', DeleteAttachment);

router.put('/editChallenge', [CheckJwt, CheckAdmin], EditChallenge)

export default router;