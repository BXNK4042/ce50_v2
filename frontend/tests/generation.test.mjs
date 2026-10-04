import test from "node:test";
import assert from "node:assert/strict";
import { getStudentGeneration } from "../utils/generation.ts";

test("getStudentGeneration returns CE04 for prefix 67...", () => {
  assert.equal(getStudentGeneration("67200099"), "CE04");
  assert.equal(getStudentGeneration(67200099), "CE04");
  assert.equal(getStudentGeneration("67000000"), "CE04");
});

test("getStudentGeneration returns CE03 for prefix 66...", () => {
  assert.equal(getStudentGeneration("66200123"), "CE03");
  assert.equal(getStudentGeneration(66200123), "CE03");
  assert.equal(getStudentGeneration("66000000"), "CE03");
});

test("getStudentGeneration returns CE02 for prefix 65...", () => {
  assert.equal(getStudentGeneration("65200456"), "CE02");
  assert.equal(getStudentGeneration(65200456), "CE02");
  assert.equal(getStudentGeneration("65000000"), "CE02");
});

test("getStudentGeneration returns CE01 for prefix 64...", () => {
  assert.equal(getStudentGeneration("64200789"), "CE01");
  assert.equal(getStudentGeneration(64200789), "CE01");
  assert.equal(getStudentGeneration("64000000"), "CE01");
});

test("getStudentGeneration defaults properly for unknown prefixes and invalid inputs", () => {
  assert.equal(getStudentGeneration(""), "CE04");
  assert.equal(getStudentGeneration("invalid"), "CE04");
  assert.equal(getStudentGeneration("59123456"), "CE04");
  assert.equal(getStudentGeneration("63123456"), "CE04");
  assert.equal(getStudentGeneration("abc67123"), "CE04");
  assert.equal(getStudentGeneration(0), "CE04");
});
