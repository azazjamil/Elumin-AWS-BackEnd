const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const ec2Routes = require("./routes/ec2Route");
const appStreamRoutes = require("./routes/appStreamRoute");
const workSpace = require("./routes/workSpaceRoute");
const filesRoutes = require("./routes/files");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "hello from api" });
});

app.use("/files", filesRoutes);

app.use("/ec2Routes", ec2Routes);

app.use("/appStreamRoutes", appStreamRoutes);

app.use("/workSpaceRoutes", workSpace);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on post ${PORT}`);
});
