import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findOne({ _id: String(userId) });
  const findUserByUsername = (username) => model.findOne({ username: username });
  const findUserByCredentials = (username, password) => model.findOne({ username, password });
  const findUsersByRole = (role) => model.find({ role: role });
  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };
  const updateUser = (userId, user) => {
    const { _id, ...updates } = user;
    return model.updateOne({ _id: String(userId) }, { $set: updates });
  };
  const deleteUser = (userId) => model.findOneAndDelete({ _id: String(userId) });
  return {
    createUser, findAllUsers, findUserById, findUserByUsername,
    findUserByCredentials, findUsersByRole, findUsersByPartialName,
    updateUser, deleteUser
  };
}