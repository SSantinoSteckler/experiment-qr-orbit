export async function GET(
  request: Request,
  { params }: { params: Promise<{ qr_id: string }> },
) {
  try {
    const { qr_id } = await params;
    const qrId = qr_id;
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ||
      "https://experiment-satt.onrender.com/api";

    const response = await fetch(`${API_BASE}/stats/${qrId}`);

    if (!response.ok) {
      return Response.json(
        { error: "Error fetching stats" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/stats/[qr_id]:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
