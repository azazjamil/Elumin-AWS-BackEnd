const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");


const errorHandler = require("./middleware/errorMiddleware");
const routes = require("./routes");

app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const corsOptions = {
  origin: "*",
  allowedHeaders: "Content-Type, Authorization",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on post ${PORT}`);
});
