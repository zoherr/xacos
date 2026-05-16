import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { Spinner } from "./components/Spinner";
import { Navbar, NavLink } from "./components/Navbar";

describe("@xacos/ui", () => {
  it("exports renderable primitives", () => {
    expect(renderToStaticMarkup(<Button type="button">Hi</Button>)).toContain("Hi");
    expect(renderToStaticMarkup(<Badge>v</Badge>)).toContain("v");
    expect(renderToStaticMarkup(<Spinner size="sm" />)).toContain("animate-spin");
    expect(
      renderToStaticMarkup(
        <Navbar brand={<span>X</span>} actions={<NavLink href="/a">Login</NavLink>}>
          <NavLink href="/">Home</NavLink>
        </Navbar>,
      ),
    ).toContain('href="/a"');
  });
});

