import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  const findAllUsers = () => model.find();
  const findUserById = (userId) => {
    const id = isNaN(userId) ? userId : Number(userId);
    return model.findOne({ _id: id });
  };
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
    const id = isNaN(userId) ? userId : Number(userId);
    return model.updateOne({ _id: id }, { $set: user });
  };
  const deleteUser = (userId) => model.findByIdAndDelete(userId);
  return {
    createUser, findAllUsers, findUserById, findUserByUsername,
    findUserByCredentials, findUsersByRole, findUsersByPartialName,
    updateUser, deleteUser
  };
}