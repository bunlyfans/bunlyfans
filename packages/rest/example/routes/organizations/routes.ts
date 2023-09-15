import { JSON } from "../../../";
import { addItem, organizations } from "../../repository";

// Same function could be places in ./[id].routes.ts
// But sometimes you may need/want "index" route without any params

//  /organizations
export function POST(jsonBody: JSON<any>) {
  const organization = addItem(organizations, jsonBody);
  return Response.json(organization, { status: 201 });
}
