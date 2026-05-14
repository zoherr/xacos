import type { XRequest, XResponse } from "@xaocs/shared";

export abstract class XController {
  protected ok(res: XResponse, data: unknown) {
    return res.status(200).json({ success: true, data });
  }

  protected created(res: XResponse, data: unknown) {
    return res.status(201).json({ success: true, data });
  }

  protected noContent(res: XResponse) {
    return res.status(204).send();
  }

  protected notFound(res: XResponse, message = "Not found") {
    return res.status(404).json({ success: false, error: message });
  }

  protected badRequest(res: XResponse, message = "Bad request") {
    return res.status(400).json({ success: false, error: message });
  }

  protected unauthorized(res: XResponse, message = "Unauthorized") {
    return res.status(401).json({ success: false, error: message });
  }

  protected serverError(res: XResponse, message = "Internal server error") {
    return res.status(500).json({ success: false, error: message });
  }
}
