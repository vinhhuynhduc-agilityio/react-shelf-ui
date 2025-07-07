import { readFileAsBase64 } from "../fileUtils";

describe("readFileAsBase64", () => {
	it("should read file as base64 string", (done) => {
		const file = new File(["Hello, World!"], "hello.txt", {
			type: "text/plain",
		});

		const onSuccess = (base64: string) => {
			try {
				expect(base64).toMatch(/^data:text\/plain;base64,/);
				done();
			} catch (error) {
				done(error);
			}
		};

		readFileAsBase64(file, onSuccess);
	});
});
