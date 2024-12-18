import express from "express";
import { addHR , deleteHR, getHR, getHRs, updateHR} from "../controller/HRController.js"

const router = express.Router();

router.get("/", roles([Role.HR]), getHRs);
router.post("/", roles([Role.HR]), addHR);
router.get("/:id", roles([Role.HR]), getHR);
router.patch("/:id", roles([Role.HR]), updateHR);
router.delete("/:id", roles([Role.HR]), deleteHR);

export default router;
