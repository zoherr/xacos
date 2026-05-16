import { describe, expect, it, spyOn } from "bun:test";
import { LogMailer } from "./index";

describe("LogMailer", () => {
  it("renders templates with data", async () => {
    const mailer = new LogMailer();
    const logSpy = spyOn(console, "log");
    
    await mailer.send({
      to: "test@example.com",
      subject: "Hello {{ name }}",
      text: "Welcome to {{ app }}",
      data: { name: "Alice", app: "XAOCS" }
    });

    expect(logSpy).toHaveBeenCalledWith("Subject:", "Hello Alice");
    expect(logSpy).toHaveBeenCalledWith("Text:   ", "Welcome to XAOCS");

    
    logSpy.mockRestore();
  });
});

