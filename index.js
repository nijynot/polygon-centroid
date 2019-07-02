/**
 * Shifts all points to the positive xy-quadrant.
 *
 * @param {Array} points
 * @returns {Object}
 */
function shiftToPositive(points) {
  const infimumX = Math.min(...points.map(point => point.x));
  const infimumY = Math.min(...points.map(point => point.y));

  let shift = { x: 0, y: 0 };
  let shiftedPoints = points.slice();

  if (infimumX < 0) {
    shift.x = infimumX;
    shiftedPoints = shiftedPoints.map(point => ({
      x: point.x + Math.abs(infimumX),
      y: point.y,
    }));
  }

  if (infimumY < 0) {
    shift.y = infimumY;
    shiftedPoints = shiftedPoints.map(point => ({
      x: point.x,
      y: point.y + Math.abs(infimumY),
    }));
  }

  return { shiftedPoints, shift };
}

/**
 * Returns the centroid of a non-intersecting polygon given it's coordinates.
 *
 * @param {Array} data
 * @returns {Object} centroid
 */
function polygonCentroid(data) {
  const { shiftedPoints, shift } = shiftToPositive(data);
  const pts = shiftedPoints.slice();
  const len = pts.length - 1;

  let A = 0;
  let Sx = 0;
  let Sy = 0;

  for (let i = 0; i < pts.length - 1; i++) {
    A += (pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y);
  }
  A += (pts[len].x * pts[0].y) - (pts[0].x * pts[len].y);
  A = A / 2;

  for (let i = 0; i < pts.length - 1; i++) {
    Sx += (pts[i].x + pts[i + 1].x) * ((pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y));
  }
  Sx += (pts[len].x + pts[0].x) * ((pts[len].x * pts[0].y) - (pts[0].x * pts[len].y));

  for (let i = 0; i < pts.length - 1; i++) {
    Sy += (pts[i].y + pts[i + 1].y) * ((pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y));
  }
  Sy += (pts[len].y + pts[0].y) * ((pts[len].x * pts[0].y) - (pts[0].x * pts[len].y));

  return {
    x: (Sx / (6 * A)) + shift.x,
    y: (Sy / (6 * A)) + shift.y,
  };
}
