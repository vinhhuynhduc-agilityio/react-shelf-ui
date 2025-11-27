import { rearrangeLayoutOnResize } from "../gridLayout";
import type { Layout } from "react-grid-layout";

describe("gridLayout helpers", () => {
  describe("rearrangeLayoutOnResize", () => {
    it("repositions items that overflow right boundary", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 1, i: "1", static: false },
        { x: 3, y: 0, w: 2, h: 1, i: "2", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 5);

      expect(result[1].x).toBeLessThan(4);
      expect(result[1].x + result[1].w).toBeLessThanOrEqual(4);
    });

    it("repositions items that overflow bottom boundary", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 2, i: "1", static: false },
        { x: 0, y: 3, w: 2, h: 2, i: "2", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 4);

      expect(result[1].y + result[1].h).toBeLessThanOrEqual(4);
    });

    it("keeps items in correct position when no overflow", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 1, i: "1", static: false },
        { x: 2, y: 0, w: 2, h: 1, i: "2", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 5);

      expect(result).toEqual(layout);
    });

    it("finds next available position for overflowing items", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 2, i: "1", static: false },
        { x: 2, y: 0, w: 2, h: 2, i: "2", static: false },
        { x: 0, y: 2, w: 2, h: 2, i: "3", static: false },
        { x: 5, y: 0, w: 2, h: 2, i: "4", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 5);

      const position4 = result[3];
      expect(position4.x + position4.w).toBeLessThanOrEqual(4);
      expect(position4.y + position4.h).toBeLessThanOrEqual(5);
    });

    it("does not modify original layout", () => {
      const layout: Layout[] = [
        { x: 5, y: 0, w: 2, h: 1, i: "1", static: false },
      ];
      const layoutCopy = JSON.parse(JSON.stringify(layout));

      rearrangeLayoutOnResize(layout, 4, 5);

      expect(layout).toEqual(layoutCopy);
    });

    it("handles empty layout", () => {
      const result = rearrangeLayoutOnResize([], 4, 5);

      expect(result).toEqual([]);
    });

    it("handles single item within bounds", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 1, i: "1", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 5);

      expect(result).toEqual(layout);
    });

    it("repositions multiple overflowing items sequentially", () => {
      const layout: Layout[] = [
        { x: 0, y: 0, w: 2, h: 2, i: "1", static: false },
        { x: 5, y: 0, w: 2, h: 1, i: "2", static: false },
        { x: 5, y: 1, w: 2, h: 1, i: "3", static: false },
      ];

      const result = rearrangeLayoutOnResize(layout, 4, 4);

      result.forEach((item) => {
        expect(item.x + item.w).toBeLessThanOrEqual(4);
        expect(item.y + item.h).toBeLessThanOrEqual(4);
      });
    });
  });
});
