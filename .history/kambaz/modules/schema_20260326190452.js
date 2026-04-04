import mongoose from "mongoose";
const moduleSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    course: String,
    lessons: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { collection: "modules" }
);
export default moduleSchema;