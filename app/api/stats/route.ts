export async function GET() {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ||
      "https://experiment-satt.onrender.com/api";

    const response = await fetch(`${API_BASE}/stats`);

    if (!response.ok) {
      return Response.json(
        { error: "Error fetching stats" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/stats:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
