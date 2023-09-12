import { describe, test, expect, beforeAll, afterAll } from "bun:test";

describe("CRUD Users under Organization", () => {
  const root = "http://localhost:3000";
  let organizationId: number;
  let userId: number;

  const apiRequest = async (method: string, endpoint: string, data?: any) => {
    const req = new Request({
      url: root + endpoint,
      method: method.toUpperCase(),
      body: data ? JSON.stringify(data) : undefined,
    });

    const response = await fetch(req);
    const json = await response.json();
    return { response, json };
  };

  beforeAll(async () => {
    const organizationData = { name: "Test Organization" };
    const { json } = await apiRequest(
      "post",
      "/organizations",
      organizationData
    );
    organizationId = json.id;
  });

  afterAll(async () => {
    await apiRequest("delete", `/organizations/${organizationId}`);
  });

  test("qwe", () => {
    expect(1).toBe(1);
  });

  test("CREATE User", async () => {
    const data = { name: "Test User", organizationId };
    const { response, json } = await apiRequest("post", "/users", data);
    expect(response.status).toBe(201);
    expect(json).toMatchObject(data);
    userId = json.id;
  });

  test("READ User", async () => {
    const { json } = await apiRequest("get", `/users/${userId}`);
    expect(json.id).toBe(userId);
  });

  test("READ All Users under Organization", async () => {
    const { json } = await apiRequest(
      "get",
      `/organizations/${organizationId}/users`
    );
    expect(Array.isArray(json)).toBe(true);
    expect(json).toMatchObject([
      {
        id: userId,
        name: "Test User",
        organizationId: 1,
      },
    ]);
    // expect(json).toEqual(expect.arrayContaining([expect.objectContaining({ id: userId })]));
  });

  test("UPDATE User", async () => {
    const data = { name: "Updated User", organizationId };
    const { json } = await apiRequest("put", `/users/${userId}`, data);
    expect(json).toEqual(data);
  });

  test("DELETE User", async () => {
    const { response } = await apiRequest("delete", `/users/${userId}`);
    expect(response.status).toBe(200);
  });
});
