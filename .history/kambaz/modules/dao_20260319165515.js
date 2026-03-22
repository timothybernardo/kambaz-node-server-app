import { v4 as uuidv4 } from "uuid";
function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  db.modules = [...db.modules, newModule];
  return newModule;
}
return { findModulesForCourse, createModule };
export default function ModulesDao(db) {
  function findModulesForCourse(courseId) {
    const { modules } = db;
    return modules.filter((module) => module.course === courseId);
  }
  return { findModulesForCourse };
}