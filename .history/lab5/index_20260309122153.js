import PathParameters from "./pathparameters.js";
import QueryParameters from "./queryparameters.js";
import WorkingWithArrays from "./workingwitharrays.js";
import WorkingWithObjects from "./workingwithobjects.js";

export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
  WorkingWithArrays(app);
};