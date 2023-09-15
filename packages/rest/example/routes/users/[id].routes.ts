import { JSON, Param } from "../../..";
import {
  addItem,
  deleteItem,
  findById,
  updateItem,
  users,
} from "../../repository";
import { UserExistsMiddleware } from "./user-exists.middleware";

// POST /users
export async function POST(jsonBody: JSON<unknown>) {
  const user = addItem(users, jsonBody);
  return Response.json(user, { status: 201 });
}

// GET /users/[id]
/**
 * This is a local middleware that will be applied only to this route.
 */
GET.middlewares = [new UserExistsMiddleware()];
export function GET(id: Param<number>) {
  const user = findById(users, id);
  return Response.json(user);
}

// PUT /users/[id]
PUT.middlewares = [new UserExistsMiddleware()];
export async function PUT(id: Param<number>, user: JSON<unknown>) {
  const updatedUser = updateItem(users, id, user);
  return Response.json(updatedUser);
}

// DELETE /users/[id]
DELETE.middlewares = [new UserExistsMiddleware()];
export function DELETE(id: Param<number>) {
  deleteItem(users, id);
  return new Response("User deleted");
}
