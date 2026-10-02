import type { CardText } from "./types";

export const EN_TYPES: Record<string, CardText> = {
  "types-barrage-remblai": {
    title: "Embankment dam",
    shortDescription: "It is made of packed earth and rock: a big \"hill\" that holds back the water.",
    location: "Mont-Cenis dam",
    contentMarkdown: `# The embankment dam

### In brief
The embankment dam looks like **a mountain built by humans**. It is made of piled-up earth or stones, with gentle slopes. It is the most common type of dam in the world, because it fits almost every valley.

### How does it work?
Instead of a straight wall, it has the shape of a **big spread-out triangle**:
- **The "shoulders"**: millions of tonnes of rocks and gravel, which give the dam its weight and stability.
- **Watertightness**: since rocks let water through, a barrier is needed. Either a **clay core** (a sticky soil) in the middle, or a concrete or bitumen **facing** on the lake side.
- **The filters**: layers of graded sand stop the water from carrying the soil away.

### Key facts
- It is the family of dams that is **the most widespread** in the world.
- **Mont-Cenis (Savoie)**: 120 meters high, and a lake at 2,000 m altitude.

### Words to know
- **Embankment (remblai)**: a pile of earth or rocks packed down to form a wall or a hill.
- **Crest**: the top of the dam.

> **Did you know?**
> For a standard embankment dam, water passing over the top (called **overtopping**) is a major risk: it can tear the soil away in a few minutes. That is why a well-sized spillway is planned.

### Going further
In an earth dam, a little water always ends up getting through: what matters is that it does not carry the soil with it. The **filters**, layers of sorted sand and gravel, let the water through but hold back the grains of soil; the **drains** collect this water and send it downstream. Without good filters, a tiny passage could widen from the inside.
`,
  },
  "types-barrage-poids": {
    title: "Gravity dam",
    shortDescription: "A wall of concrete or stone: its enormous weight keeps it from being pushed by the water.",
    location: "Moulin Neuf dam",
    contentMarkdown: `# The gravity dam

### In brief
The gravity dam is **the champion of brute force**. It is a wall of concrete or stone so heavy that it holds mainly through its weight, helped by its foundation, without sliding or tipping under the push of the water.

### How does it work?
Think of a big block of stone at the edge of a table: to push it, you need a lot of force!
- The water **pushes** the dam downstream.
- Its **weight** presses it to the ground, with an even bigger force.
- Result: it stays in place. Its shape, wide at the bottom and narrower at the top, looks like a **right triangle**: the lake side is almost straight, the downstream side is sloped.

### Key facts
The tallest gravity dam in the world is **the Grande Dixence** (Switzerland): **285 meters** high, with **15 million tonnes of concrete**.

### Words to know
- **Masonry**: construction with stones joined with mortar.
- **RCC (roller-compacted concrete)**: almost dry concrete, spread by bulldozers and crushed by rollers.

> **Did you know?**
> Today, many gravity dams are made of **roller-compacted concrete**: it is spread like soil, then packed down. It makes building much faster!

### Going further
In a gravity dam, the foundation and the drainage are almost as important as the weight of the concrete. If water seeps under the dam, it lifts it a little and reduces the friction that holds it on the ground. So drains are drilled under the structure, and the water pressure is monitored to make sure it stays low.
`,
  },
  "types-barrage-voute": {
    title: "Arch dam",
    shortDescription: "Its curved shape lets it hold back water by leaning on the cliffs on each side.",
    location: "Quinson dam",
    contentMarkdown: `# The arch dam

### In brief
The arch dam is a dam that is **curved** toward the lake, like an arch. It does not hold mainly through its weight, but by **passing the push of the water on to the cliffs** on each side of the valley.

### How does it work?
It is the same principle as the arches of old bridges or churches, but laid down horizontally:
- The water pushes on the curved wall, which **squeezes itself together** instead of bending.
- Concrete loves being squeezed! The force follows the curve and leans on the rock on both sides: these supports are called **abutments**.
- Modern arches are also curved from top to bottom (*double curvature*), like the hull of a boat, which makes them very thin.

### Key facts
- An arch dam can use **far less concrete** than a comparable gravity dam.
- **Quinson (Verdon)**: a pretty arch 45 meters high.

### Words to know
- **Arch (voûte)**: a curved shape, like a bow.
- **Abutment**: a support of rock or concrete that receives the push.

> **Did you know?**
> When the lake fills, the water pushes harder and the arch **squeezes more tightly against its supports**. Engineers calculate these forces and deformations for every water level.

### Going further
An arch uses little concrete, but in exchange it needs a fairly narrow valley and very solid rock supports, because all the push of the water ends up in the cliffs. That is why it is built mostly in gorges. In a wide valley, an embankment dam or a gravity dam is often better suited.
`,
  },
  "types-canaux": {
    title: "Canals",
    shortDescription: "Rivers dug by humans to bring water from one place to another and let boats sail.",
    location: "Ille-et-Rance Canal",
    contentMarkdown: `# Canals

### In brief
A canal is a **river made by humans**. It is dug across plains and hills to carry goods, bring water to towns or irrigate fields.

### How does it work?
A river runs downhill on its own. A canal, on the other hand, is more like a **staircase of flat stretches of water**:
- **The reach (bief)**: a very watertight stretch, where the water stays calm and at a constant level, so that barges move without fighting a current.
- **The locks**: to climb a hill, boats go from lock to lock, like in an elevator.
- **The canal bridges**: to cross a river or a valley, a bridge is built that carries a canal! The most famous in France is the one at Briare, above the Loire.

### Key facts
- **Ille-et-Rance Canal** (Brittany): 85 km and 48 locks between Rennes and Saint-Malo, opened in 1832.
- France has about **8,500 km** of navigable waterways (canals and improved rivers), one of the longest networks in Europe.

### Words to know
- **Reach (bief)**: a section of canal between two locks.
- **Barge**: a long, flat boat for carrying goods.

> **Did you know?**
> The highest point of a canal (the *summit reach*) is tricky to feed with water, because each lockage lets water flow down. It is supplied with **reservoirs**, channels or pumps, otherwise the canal would dry up!

### Going further
Every passage through a lock uses water: like filling a big box, all the water needed to lift a boat then flows away downstream. So the canal must be fed all the time, especially at its highest point. Some locks have **water-saving basins**, neighboring reservoirs that recover part of this water to give it back to the next passage.
`,
  },
  "types-digue-protection": {
    title: "Flood protection levee",
    shortDescription: "A long structure that protects residents and land against floods.",
    location: "Doménon levee",
    contentMarkdown: `# The flood protection levee

### In brief
A dam blocks a river to make a lake. A levee, instead, is **a long wall that runs along the river or the sea**, sometimes for kilometers, to stop water from flooding towns and fields.

### How does it work?
- **When all is well**: the levee is dry, or the water barely touches its foot.
- **When there is a flood**: the water rises, and the levee keeps it in its bed.
- **The risks being watched**:
  - *overtopping*: water goes over the top and gnaws at the levee from behind;
  - *piping (the "hydraulic fox")*: water slips under the levee and carries away sand, like a small tunnel that keeps getting bigger;
  - *sliding*: the levee, soaked with water, loses strength and slides.
- **A trick**: sometimes a deliberately lower spot is planned where water can spill over toward fields, to **protect the houses**.

### Key facts
In France, **thousands of kilometers of levees** protect millions of people, along the Loire, the Rhône, the Seine and the coast.

### Words to know
- **Flood (inundation)**: when water covers land that is normally dry.
- **Levee (digue)**: a long wall or bank that holds back water.

> **Did you know?**
> The burrows of coypus, badgers or foxes can weaken a levee. That is why workers walk along it regularly, especially after a flood, to spot and fill in these holes.

### Going further
A levee reduces a risk but does not remove it: it is designed to protect up to a certain level of flood. If a bigger flood arrives, the water can go over the top or the levee can fail. That is why we avoid building right behind a levee, and why residents of protected areas must stay informed about the risks.
`,
  },
  "types-step": {
    title: "Pumped-storage station (PSH)",
    shortDescription: "It pumps water uphill when there is too much electricity, then lets it fall back down to produce some when there is not enough.",
    location: "Revin pumped-storage station",
    contentMarkdown: `# The pumped-storage station

### In brief
In French, STEP stands for **Station de Transfert d'Énergie par Pompage** (pumped-storage station). It is like **a giant battery**: electricity is stored in the form of water held high up, and recovered when it is needed.

### How does it work?
A pumped-storage station has two reservoirs at different altitudes: one high up, one low down.
1. **When there is surplus electricity** (at night, or in full sun when solar panels produce a lot): pumps **lift the water** from the lower lake to the upper lake. The extra electricity is put aside!
2. **When there is a shortage** (for example at 7 p.m. in winter, when everyone switches on the light): the gates are opened. The water **comes back down** and spins turbines, which make electricity in less than 3 minutes.

### Key facts
- Pumped-storage stations are one of the main ways to store very large amounts of energy.
- **Grand'Maison** (Isère): the most powerful in Europe, **1,800 MW**.
- **Revin** (Ardennes): 800 MW.

### Words to know
- **MW (megawatt)**: a unit of power. 1 MW is 1,000 kW, the power of about 1,000 radiators of 1 kW.
- **Efficiency**: what you get back compared with what you put in.

> **Did you know?**
> The idea is not new: the first pumped-storage stations were built in Italy and Switzerland at the end of the 19th century, more than 120 years ago!

### Going further
A pumped-storage station does not create energy: it uses some to pump the water uphill, then recovers about 70 to 80% of it when the water comes back down. What it brings is the ability to **store** very large amounts of electricity, for hours, and give them back when the grid needs them.
`,
  },
};
