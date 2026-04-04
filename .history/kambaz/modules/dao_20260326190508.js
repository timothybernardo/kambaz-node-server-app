import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function ModulesDao() {
  const findModulesForCourse = (courseId) => model.find({ course: courseId });
  const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4() };
    return model.create(newModule);
  };
  const deleteModule = (moduleId) => model.findByIdAndDelete(moduleId);
  const updateModule = (moduleId, moduleUpdates) =>
    model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
  return { findModulesForCourse, createModule, deleteModule, updateModule };
}