const express = require("express");
const router = express.Router();
const {
  createPersonnel,
  getAllPersonnels,
  updatePersonnel,
  deletePersonnel,
} = require("../controllers/persoController");

// Route POST pour ajouter un personnel
router.post("/", createPersonnel);

// Route GET pour tous les personnels (publics)
router.get("/", getAllPersonnels);

// Route PUT pour modifier
router.put("/:idp", updatePersonnel);

// Route DELETE (optionnelle)
router.delete("/:idp", deletePersonnel);

module.exports = router;
