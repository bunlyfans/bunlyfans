import { Route } from "../../../src/types";
import { addItem, organizations } from "../../repository";

// Same function could be places in ./[id].routes.ts
// But sometimes you may need/want "index" route without any params

//  /organizations
export const POST: Route = async (req) => {
  const jsonBody = await req.json();
  const organization = addItem(organizations, jsonBody);
  return Response.json(organization, { status: 201 });
};
