import { describe, test, expect, beforeAll, afterAll } from "bun:test";

const HOST = "http://localhost:3000";

describe("CRUD Users under Organization", () => {
  let organizationId: number;
  let userId: number;

  beforeAll(async () => {
    const organizationData = { name: "Test Organization" };
    const response = await req("post", "/organizations", organizationData);
    organizationId = (await response.json()).id;
  });

  afterAll(async () => {
    await req("delete", `/organizations/${organizationId}`);
  });

  test("CREATE User", async () => {
    const data = { name: "Test User", organizationId };
    const response = await req("post", "/users", data);
    userId = (await response.clone().json()).id;
    await response.toMatchObject(data);
    response.hasStatus(201);
  });

  test("READ User", async () => {
    const response = await req("get", `/users/${userId}`);
    await response.toMatchObject({ id: userId });
  });

  test("READ All Users under Organization", async () => {
    const response = await req("get", `/organizations/${organizationId}/users`);
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
    const response = await req("put", `/users/${userId}`, data);
    response.isOk();
    await response.toEqual(data);
  });

  test("DELETE User", async () => {
    const response = await req("delete", `/users/${userId}`);
    response.isOk();
    await response.toBe("User deleted");
  });
});

/**
 * Helper methods for e2e testing
 * TODO: move to library/package
 */

async function req(method: string, endpoint: string, data?: any) {
  const req = new Request({
    url: HOST + endpoint,
    method: method.toUpperCase(),
    body: data ? JSON.stringify(data) : undefined,
  });

  const response = await fetch(req);

  return response;
}

declare global {
  interface Response {
    hasStatus(status: number): void;
    isOk(): void;
    toBe(text: string): Promise<void>;
    toMatchObject(obj: any): Promise<void>;
    toEqual(obj: any): Promise<void>;
  }
}

Response.prototype.toBe = async function (text: string) {
  const actualText = await this.text();
  expect(actualText).toBe(text);
};

Response.prototype.toMatchObject = async function (obj: any) {
  const actualJson = await this.json();
  expect(actualJson).toMatchObject(obj);
};

Response.prototype.toEqual = async function (obj: any) {
  const actualJson = await this.json();
  expect(actualJson).toEqual(obj);
};

Response.prototype.hasStatus = function (status: number) {
  expect(this.status).toBe(status);
};

Response.prototype.isOk = function () {
  expect(this.status).toBe(200);
};
