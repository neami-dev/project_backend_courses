const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 4000;
const url =
    "mongodb+srv://abdkabirneami:nodejs@learn-nodejs.ojfrehw.mongodb.net/abdelkbirNodejs";

mongoose.connect(url).then(() => {
    console.log("mongodb server started");
});
app.use(express.json());
const coursesRouter = require("./routes/courses.router");
app.use("/api/courses", coursesRouter);

app.listen(port, () => {
    console.log("started express from port 4000");
});
