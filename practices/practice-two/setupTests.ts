import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock the @/config module globally for all tests
jest.mock("@/config", () => ({
	API_BASE_URL: "http://localhost:3001",
}));

// Fix for TextEncoder and TextDecoder not being available in JSDOM
if (typeof global.TextEncoder === "undefined") {
	global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
	global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
