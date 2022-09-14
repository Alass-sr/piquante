const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauces");

router.post("/", /*auth, multer,*/ sauceCtrl.createSauce);
router.get("/", /*auth, multer,*/ sauceCtrl.getAllSauces);
router.get("/:id", /*auth,*/ sauceCtrl.getOneSauce);
router.put("/:id", /*auth, multer,*/ sauceCtrl.modifySauce);
router.delete("/:id", /*auth,*/ sauceCtrl.deleteSauce);


module.exports = router;