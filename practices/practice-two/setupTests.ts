import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

jest.mock("@/services/env.ts", () => ({
  API_BASE_URL: "https://mock-api.test",
}));

// Mock logo image import
jest.mock("@/assets/images/logo.webp", () => "logo.webp");

// Fix for TextEncoder and TextDecoder not being available in JSDOM
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
