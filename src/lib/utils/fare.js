export function calculateFare({
  distanceKm,
  durationMin,
  baseFare,
  perKm,
  perMinute,
  minimumFare,
  surgeMultiplier = 1,
}) {
  const raw = baseFare + distanceKm * perKm + durationMin * perMinute;
  const surged = raw * surgeMultiplier;
  return Number(Math.max(surged, minimumFare).toFixed(2));
}
