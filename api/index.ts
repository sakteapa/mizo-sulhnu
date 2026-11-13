import type { IncomingMessage, ServerResponse } from "node:http";
import apiApp from "../server";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return apiApp(req, res);
}
