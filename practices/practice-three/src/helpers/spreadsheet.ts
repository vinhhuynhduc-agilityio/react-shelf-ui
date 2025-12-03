export const colorToArgb = (color = "") => {
  if (!color) return "FF000000";

  if (color.startsWith("rgb(")) {
    const nums = color
      .slice(4, -1)
      .replace(/\s/g, "")
      .split(",")
      .map((n) => parseInt(n, 10));

    return (
      "FF" +
      nums.map((n) => n.toString(16).padStart(2, "0").toUpperCase()).join("")
    );
  }

  // Hex
  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return "FF" + hex.padEnd(6, "0").toUpperCase();
};
