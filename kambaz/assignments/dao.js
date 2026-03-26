import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  const findAssignmentsForCourse = (courseId) => model.find({ course: courseId });
  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };
  const deleteAssignment = (assignmentId) => model.findByIdAndDelete(assignmentId);
  const updateAssignment = (assignmentId, assignmentUpdates) =>
    model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  return { findAssignmentsForCourse, createAssignment, deleteAssignment, updateAssignment };
}