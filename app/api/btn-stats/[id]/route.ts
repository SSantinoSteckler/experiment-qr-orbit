export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ||
      "https://experiment-satt.onrender.com/api";

    const response = await fetch(`${API_BASE}/btn-stats/${id}`);

    if (!response.ok) {
      return Response.json(
        { error: "Error fetching btn stats" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/btn-stats/[id]:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
