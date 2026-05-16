import { describe, it, expect } from "bun:test";
import { MailgunMailer } from "./MailgunMailer";
import { PostmarkMailer } from "./PostmarkMailer";
import { ResendMailer } from "./ResendMailer";

describe("MailgunMailer", () => {
  it("constructs without throwing", () => {
    expect(() => new MailgunMailer({
      apiKey: "key-test",
      domain: "test.example.com",
      from: "test@example.com",
    })).not.toThrow();
  });
});

describe("PostmarkMailer", () => {
  it("constructs without throwing", () => {
    expect(() => new PostmarkMailer({
      serverToken: "token-test",
      from: "test@example.com",
    })).not.toThrow();
  });
});

describe("ResendMailer", () => {
  it("constructs without throwing", () => {
    expect(() => new ResendMailer({
      apiKey: "re_test",
      from: "test@example.com",
    })).not.toThrow();
  });
});


