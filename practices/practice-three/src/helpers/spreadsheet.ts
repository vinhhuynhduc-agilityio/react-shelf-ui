export const colorToArgb = (color?: string): string => {
  if (!color) return "FF000000";

  const c = color.trim().toLowerCase();

  if (c.startsWith("rgb")) {
    const nums = c
      .slice(c.indexOf("(") + 1, c.indexOf(")"))
      .replace(/\s/g, "")
      .split(",")
      .slice(0, 3)
      .map((n) => parseInt(n, 10))
      .map((n) => n.toString(16).padStart(2, "0").toUpperCase())
      .join("");

    return "FF" + nums;
  }

  // Hex
  let hex = c.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  hex = hex.padEnd(6, "0").slice(0, 6);

  return "FF" + hex.toUpperCase();
};
