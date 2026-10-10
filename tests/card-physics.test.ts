import { describe, expect, it } from "vitest";
import { cardContact, sweptCardContact, springStep, type CardBody, type Vec3 } from "../lib/card-physics";
const body = (center: Vec3, angle = 0): CardBody => ({center, halfSize:[.85,1.214,.008], axes:[[Math.cos(angle),0,-Math.sin(angle)],[0,1,0],[Math.sin(angle),0,Math.cos(angle)]]});
describe("guided card physics", () => {
  it("keeps physically spaced cards out of contact", () => { expect(cardContact(body([0,0,0]),body([0,0,.021]))).toBeNull(); });
  it("separates overlapping faces along their thickness", () => { const a=body([0,0,0]); const b=body([0,0,.01]); const contact=cardContact(a,b)!; expect(contact[2]).toBeGreaterThan(0); b.center=b.center.map((v,i)=>v+contact[i]) as Vec3; expect(cardContact(a,b)).toBeNull(); });
  it("detects an edge crossing a rotated card", () => { expect(cardContact(body([0,0,0]),body([.6,0,0],Math.PI/2))).not.toBeNull(); });
  it("does not collide separated rotated cards", () => { expect(cardContact(body([0,0,0],.7),body([4,0,0],-.3))).toBeNull(); });
  it("prevents a thin card passing completely through another in a single frame", () => {
    const a=body([0,0,0]), b=body([0,0,-.1]);
    expect(cardContact(a,b)).toBeNull();
    const correction=sweptCardContact(a,b,[0,0,0],[0,0,.1])!;
    expect(correction[2]).toBeGreaterThan(.1);
    b.center=b.center.map((v,i)=>v+correction[i]) as Vec3;
    expect(b.center[2]).toBeGreaterThan(0); expect(cardContact(a,b)).toBeNull();
  });
  it("lets a card pass beside another without a false swept contact", () => {
    expect(sweptCardContact(body([0,0,0]),body([3,0,-1]),[0,0,0],[3,0,1])).toBeNull();
  });
  it("converges without overshoot and independently of frame rate", () => {
    const simulate=(fps:number)=>{let p=0,v=0; for(let i=0;i<fps;i++){const next=springStep(p,v,1,12,1/fps);p=next.position;v=next.velocity;expect(p).toBeLessThanOrEqual(1);}return p;};
    expect(simulate(30)).toBeCloseTo(simulate(120),8); expect(simulate(60)).toBeGreaterThan(.999);
  });
  it("remains finite after a long paused frame", () => { const state=springStep(0,0,1,12,10);expect(Number.isFinite(state.position)).toBe(true);expect(state.position).toBeLessThan(1); });
});
