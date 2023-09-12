import { ErrorResponse, Route } from "../../../src/types";
import {
  addItem,
  deleteItem,
  findById,
  updateItem,
  users,
} from "../../repository";

// ('/users',
export const POST: Route = async (req, route) => {
  const jsonBody = await req.json();
  const user = addItem(users, jsonBody);
  return Response.json(user, { status: 201 });
};

// ('/users/:id',
export const GET: Route = (req, route) => {
  const id = Number(route.params.id);
  const user = findById(users, id);
  if (!user) {
    throw new ErrorResponse(404, "User not found");
  }
  return Response.json(user);
};

// ('/organizations/:id/users',
// export const GET: Route = (req, res) => {
//     const { id } = req.params;
//     const orgUsers = users.filter(u => u.organizationId == id);
//     res.json(orgUsers);
// });

// ('/users/:id',
export const PUT: Route = async (req, route) => {
  const id = Number(route.params.id);
  const jsonBody = await req.json();
  const updatedUser = updateItem(users, id, jsonBody);
  if (!updatedUser) {
    throw new ErrorResponse(404, "User not found");
  }
  return Response.json(updatedUser);
};

// ('/users/:id',
export const DELETE: Route = (req, route) => {
  const id = Number(route.params.id);
  const deleted = deleteItem(users, id);
  if (!deleted) {
    throw new ErrorResponse(404, "User not found");
  }
  return new Response(undefined, { statusText: "User deleted" });
};
