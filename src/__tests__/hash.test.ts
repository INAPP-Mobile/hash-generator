import { describe, it, expect } from "vitest";
import { md5, hexToBase64, arrayBufferToHex, arrayBufferToBase64 } from "@/lib/hash";

describe("md5", () => {
  it("produces correct hash for empty string", () => {
    expect(md5("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  it("produces correct hash for 'abc'", () => {
    expect(md5("abc")).toBe("900150983cd24fb0d6963f7d28e17f72");
  });

  it("produces correct hash for 'hello'", () => {
    expect(md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("produces correct hash for 'The quick brown fox jumps over the lazy dog'", () => {
    expect(md5("The quick brown fox jumps over the lazy dog")).toBe(
      "9e107d9d372bb6826bd81d3542a419d6"
    );
  });

  it("handles unicode characters", () => {
    const result = md5("héllo");
    expect(result).toHaveLength(32);
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });

  it("produces same hash for same input", () => {
    expect(md5("test")).toBe(md5("test"));
  });

  it("produces different hashes for different inputs", () => {
    expect(md5("test")).not.toBe(md5("test1"));
  });
});

describe("hexToBase64", () => {
  it("converts md5 hex to base64 correctly", () => {
    const hex = "5d41402abc4b2a76b9719d911017c592";
    const b64 = hexToBase64(hex);
    expect(b64).toBe("XUFAKrxLKna5cZ2REBfFkg==");
  });

  it("converts empty hex string", () => {
    expect(hexToBase64("")).toBe("");
  });

  it("converts sha256 hex to base64 correctly", () => {
    const hex =
      "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592";
    const b64 = hexToBase64(hex);
    expect(b64).toBe("16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=");
  });
});

describe("arrayBuffer utilities", () => {
  it("arrayBufferToHex produces correct output", () => {
    const buf = new Uint8Array([0x5d, 0x41, 0x40, 0x2a]).buffer;
    expect(arrayBufferToHex(buf)).toBe("5d41402a");
  });

  it("arrayBufferToBase64 produces correct output", () => {
    const buf = new Uint8Array([0x5d, 0x41, 0x40, 0x2a]).buffer;
    expect(arrayBufferToBase64(buf)).toBe("XUFAKg==");
  });

  it("handles empty buffer", () => {
    const buf = new Uint8Array([]).buffer;
    expect(arrayBufferToHex(buf)).toBe("");
    expect(arrayBufferToBase64(buf)).toBe("");
  });
});
