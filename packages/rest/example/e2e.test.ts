import { afterAll, beforeAll, describe, test } from "bun:test";
import { del, get, post, put } from "./e2e-helpers.test";

const HOST = "http://localhost:3000";

describe("CRUD Users under Organization", () => {
  let organizationId: number;
  let userId: number;

  beforeAll(async () => {
    const organizationData = { name: "Test Organization" };
    const response = await post(HOST + "/organizations", organizationData);
    organizationId = (await response.json()).id;
  });

  afterAll(async () => {
    await del(HOST + `/organizations/${organizationId}`);
  });

  test("CREATE User", async () => {
    const data = { name: "Test User", organizationId };
    const response = await post(HOST + "/users", data);
    userId = (await response.clone().json()).id;
    await response.toMatchObject(data);
    response.hasStatus(201);
  });

  test("READ User", async () => {
    const response = await get(HOST + `/users/${userId}`);
    await response.toMatchObject({ id: userId });
  });

  test("READ All Users under Organization", async () => {
    const response = await get(HOST + `/organizations/${organizationId}/users`);
    await response.toMatchObject([
      {
        id: userId,
        name: "Test User",
        organizationId: 1,
      },
    ]);
  });

  test("UPDATE User", async () => {
    const data = { name: "Updated User", organizationId };
    const response = await put(HOST + `/users/${userId}`, data);
    response.isOk();
    await response.toEqual(data);
  });

  test("DELETE User", async () => {
    const response = await del(HOST + `/users/${userId}`);
    response.isOk();
    await response.toBe("User deleted");
  });

  test("DELETE Org should fail if not exists", async () => {
    const response = await del(HOST + `/organizations/${-1}`);
    response.hasStatus(404);
    await response.toBe("Organization not found");
  });
});
