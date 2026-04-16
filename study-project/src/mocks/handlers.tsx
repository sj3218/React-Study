import { http, HttpResponse } from "msw";

export const handlers = [
	http.post("/api/login", async ({ request }) => {
		const { id, password } = (await request.json()) as any;

		if (id === "admin" && password === "1234") {
			return HttpResponse.json({
				token: "fake-jwt-token-12345",
				userName: "짱구",
			});
		}
		return new HttpResponse(null, { status: 401 });
	}),

	http.get("/api/status", () => {
		return HttpResponse.json([
			{ name: "Done", value: 85 },
			{ name: "Undone", value: 35 },
		]);
	}),
];
