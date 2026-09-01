type HealthResponse = Readonly<{
  status: 'healthy';
}>;

export function GET() {
  return Response.json({ status: 'healthy' } satisfies HealthResponse);
}
