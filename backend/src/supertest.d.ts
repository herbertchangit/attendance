declare module "supertest" {
  import type { Application } from "express";

  interface Response {
    status: number;
    body: Record<string, unknown>;
  }

  interface Test extends PromiseLike<Response> {
    expect(status: number): Test;
    set(name: string, value: string): Test;
    send(body: unknown): Test;
  }

  interface Agent {
    delete(path: string): Test;
    get(path: string): Test;
    post(path: string): Test;
    put(path: string): Test;
  }

  export default function request(app: Application): Agent;
}
