import { Route } from "../../../src/types";
import { addItem, organizations } from "../../repository";

export const POST: Route = async (req) => {
  const jsonBody = await req.json();
  const organization = addItem(organizations, jsonBody);
  return Response.json(organization, { status: 201 });
};
