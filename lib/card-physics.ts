/** Guided card dynamics: critically damped springs and oriented-box contacts. */
export type Vec3 = [number, number, number];
export interface CardBody { center: Vec3; axes: [Vec3, Vec3, Vec3]; halfSize: Vec3; }
const dot = (a: Vec3, b: Vec3) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const radius = (body: CardBody, axis: Vec3) => body.halfSize.reduce((sum, extent, i) => sum + extent * Math.abs(dot(body.axes[i], axis)), 0);

/** Exact critical spring solution; stable across frame rates, with no target overshoot from rest. */
export function springStep(position: number, velocity: number, target: number, speed: number, delta: number) {
  const dt = Math.max(0, Math.min(delta, .1));
  const displacement = position - target;
  const c = velocity + speed * displacement;
  const decay = Math.exp(-speed * dt);
  return { position: target + (displacement + c * dt) * decay, velocity: (velocity - speed * c * dt) * decay };
}

/** SAT: minimum translation that moves B out of A, including rotated thin card edges. */
export function cardContact(a: CardBody, b: CardBody): Vec3 | null {
  const difference: Vec3 = [b.center[0]-a.center[0], b.center[1]-a.center[1], b.center[2]-a.center[2]];
  const reach = Math.hypot(...a.halfSize) + Math.hypot(...b.halfSize);
  if (dot(difference, difference) > reach * reach) return null;
  const candidates = [...a.axes, ...b.axes];
  for (const axisA of a.axes) for (const axisB of b.axes) candidates.push(cross(axisA, axisB));
  let overlap = Infinity;
  let best: Vec3 | null = null;
  for (const candidate of candidates) {
    const length = Math.hypot(...candidate);
    if (length < 1e-7) continue;
    const axis: Vec3 = candidate.map(value => value / length) as Vec3;
    const distance = dot(difference, axis);
    const penetration = radius(a, axis) + radius(b, axis) - Math.abs(distance);
    if (penetration <= 0) return null;
    if (penetration < overlap) {
      overlap = penetration;
      const sign = distance < 0 ? -1 : 1;
      best = axis.map(value => value * sign * (penetration + .001)) as Vec3;
    }
  }
  return best;
}

/** Swept translation test: prevents thin cards tunnelling through each other between frames. */
export function sweptCardContact(a: CardBody, b: CardBody, previousA: Vec3, previousB: Vec3): Vec3 | null {
  const start: Vec3 = previousB.map((value,i) => value - previousA[i]) as Vec3;
  const end: Vec3 = b.center.map((value,i) => value - a.center[i]) as Vec3;
  const travel: Vec3 = end.map((value,i) => value - start[i]) as Vec3;
  const axes = [...a.axes, ...b.axes];
  for (const x of a.axes) for (const y of b.axes) axes.push(cross(x,y));
  let enter = 0, exit = 1;
  let hitNormal: Vec3 | null = null;
  let hitRadius = 0;
  for (const candidate of axes) {
    const length = Math.hypot(...candidate);
    if (length < 1e-7) continue;
    const axis: Vec3 = candidate.map(value => value / length) as Vec3;
    const r = radius(a,axis) + radius(b,axis);
    const distance = dot(start,axis), speed = dot(travel,axis);
    if (Math.abs(speed) < 1e-9) { if (Math.abs(distance) > r) return null; continue; }
    const t1 = (-r - distance) / speed, t2 = (r - distance) / speed;
    const near = Math.min(t1,t2), far = Math.max(t1,t2);
    if (near > enter) { enter = near; hitNormal = axis.map(value => value * (speed > 0 ? -1 : 1)) as Vec3; hitRadius = r; }
    exit = Math.min(exit, far);
    if (enter > exit) return null;
  }
  if (!hitNormal || enter < 0 || enter > 1 || exit < 0) return null;
  const correction = hitRadius - dot(end,hitNormal) + .001;
  return correction > 0 ? hitNormal.map(value => value * correction) as Vec3 : null;
}
