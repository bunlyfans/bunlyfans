import { ErrorResponse, Route } from "../../../src/types";
import {
  addItem,
  deleteItem,
  findById,
  updateItem,
  users,
} from "../../repository";

// POST /users
export const POST: Route = async (req, route) => {
  const jsonBody = await req.json();
  const user = addItem(users, jsonBody);
  return Response.json(user, { status: 201 });
};

// GET /users/[id]
export const GET: Route = (req, route) => {
  const id = Number(route.params.id);
  const user = findById(users, id);
  if (!user) {
    throw new ErrorResponse(404, "User not found");
  }
  return Response.json(user);
};

// PUT /users/[id]
export const PUT: Route = async (req, route) => {
  const id = Number(route.params.id);
  const jsonBody = await req.json();
  const updatedUser = updateItem(users, id, jsonBody);
  if (!updatedUser) {
    throw new ErrorResponse(404, "User not found");
  }
  return Response.json(updatedUser);
};

// DELETE /users/[id]
export const DELETE: Route = (req, route) => {
  const id = Number(route.params.id);
  const deleted = deleteItem(users, id);
  if (!deleted) {
    throw new ErrorResponse(404, "User not found");
  }
  return new Response("User deleted");
};
