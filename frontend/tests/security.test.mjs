import test from "node:test";
import assert from "node:assert/strict";
import { safeExternalUrl } from "../utils/security.ts";

test("safeExternalUrl allows valid http and https URLs", () => {
  assert.equal(safeExternalUrl("https://example.com"), "https://example.com");
  assert.equal(safeExternalUrl("http://example.com/path?a=1"), "http://example.com/path?a=1");
  assert.equal(safeExternalUrl("  https://kmitl.ac.th  "), "https://kmitl.ac.th");
});

test("safeExternalUrl blocks dangerous schemes like javascript: and data:", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), "#");
  assert.equal(safeExternalUrl("data:text/html,<script>alert(1)</script>"), "#");
  assert.equal(safeExternalUrl("vbscript:msgbox(1)"), "#");
  assert.equal(safeExternalUrl(""), "#");
  assert.equal(safeExternalUrl(null), "#");
  assert.equal(safeExternalUrl(undefined), "#");
});
