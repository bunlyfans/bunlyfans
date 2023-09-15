import { Param, res } from "../../../../";
import { users } from "../../../repository";

// GET /organizations/:id/users
export function GET(id: Param<number>) {
  const orgUsers = users.filter((u) => u.organizationId == id);
  return Response.json(orgUsers);
}
