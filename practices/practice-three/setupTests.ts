import "@testing-library/jest-dom";

jest.mock("@/services/env", () => ({
  API_BASE_URL: "https://mock-api.test",
}));
