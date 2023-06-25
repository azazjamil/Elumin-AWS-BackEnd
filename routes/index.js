const express = require("express");
const router = express.Router();

const ec2Routes = require("./ec2Route");
const appStreamRoutes = require("./appStreamRoute");
const workSpace = require("./workSpaceRoute");
const filesRoutes = require("./files");
const userRoutes = require("./userRoutes");
const authenticate = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.send({ message: "hello from api" });
});

router.get("/session", authenticate, (req, res) => {
  res.status(200).send({
    error: false,
    data: "session is active",
  });
});

router.use("/user", userRoutes);

router.use("/files", filesRoutes);

router.use("/ec2Routes", ec2Routes);

router.use("/appStreamRoutes", appStreamRoutes);

router.use("/workSpaceRoutes", workSpace);

// Export the router
module.exports = router;
