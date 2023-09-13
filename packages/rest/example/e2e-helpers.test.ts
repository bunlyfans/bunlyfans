import { expect } from "bun:test";

/**
 * Helper methods for e2e testing
 * TODO: move to library/package
 */

export const get = (endpoint: string) => req("get", endpoint);
export const post = (endpoint: string, data?: any) =>
  req("post", endpoint, data);
export const put = (endpoint: string, data?: any) => req("put", endpoint, data);
export const del = (endpoint: string) => req("delete", endpoint);

async function req(method: string, endpoint: string, data?: any) {
  const req = new Request({
    url: endpoint,
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
