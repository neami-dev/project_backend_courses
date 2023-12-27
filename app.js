require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");
const usersRouter = require("./routes/users.route");
const coursesRouter = require("./routes/courses.router");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT;
const url = process.env.MONGO_URL;

app.use("/uploads",express.static(path.join(__dirname,"uploads")))
mongoose
    .connect(url)
    .then(() => {
        console.log("mongodb server started");
    })
    .catch((err) => {
        console.log("error ==>", err);
    });
app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: "this resource is not available",
    });
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500,
        data: null,
    });
});

app.listen(port, () => {
    console.log("started express from port 4000");
});
