import { ErrorResponse, Route } from "../../../src/types";
import { deleteItem, organizations } from "../../repository";

export const DELETE: Route = (req, route) => {
  const id = Number(route.params.id);
  const deleted = deleteItem(organizations, id);
  if (!deleted) {
    throw new ErrorResponse(404, "Organization not found");
  }
  return new Response(null, {
    statusText: "Organization deleted",
  });
};
