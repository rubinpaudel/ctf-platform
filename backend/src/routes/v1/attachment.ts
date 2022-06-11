import { Router } from "express";
import { AddChallengeAttachment } from "../../controllers/challenge/AddChallengeAttachments";
import { DeleteAttachment } from "../../controllers/challenge/deleteAttachment";
import { GetAttachmentName } from "../../controllers/challenge/GetAttachmentName";
import { GetChallengeAttachmentById } from "../../controllers/challenge/getChallengeAttachmentById";
import { GetChallengeAttachments } from "../../controllers/challenge/getChallengeAttachments";
import { CheckAdmin } from "../../middleware/checkAdmin";
import { CheckJwt } from "../../middleware/checkJwt";
import { multerUpload } from "../../middleware/mutler";

const router = Router();


router.get('/:id', GetChallengeAttachments);
router.get('/one/:id', GetChallengeAttachmentById);
router.delete('/:id', [CheckJwt, CheckAdmin] ,DeleteAttachment);
router.get('/name/:id', GetAttachmentName);
router.post('/:id', [CheckJwt, CheckAdmin, multerUpload.array("Attachments")], AddChallengeAttachment);


export default router;