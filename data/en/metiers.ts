import type { CardText } from "./types";

export const EN_METIERS: Record<string, CardText> = {
  "metiers-proprietaire": {
    title: "Owner",
    shortDescription: "The owner pays for the dam to be built, then looks after it for its whole life: upkeep, monitoring, safety.",
    contentMarkdown: `# The owner

### In brief
The owner is the dam's **guardian**. Just like the owner of a house, they pay to keep it standing and in good shape. Except that their "house" holds back millions of liters of water!

### How does it work?
In France, many large dams belong to **the State**. It hands over their operation to a company through a contract called a **concession** (EDF, for example, produces electricity with them). Dams that supply tap water or water fields mostly belong to towns or groups of municipalities.

The owner must:
- **pay** for monitoring and repairs, year after year;
- **imagine the worst**: for the most important dams, they write and update a danger study (what would happen in a huge flood, when the river overflows, or in an earthquake?);
- **work with the State**, which checks that everything is safe for the people living downstream, that is, further down the valley.

### Key facts
- Dams are ranked **A, B or C** depending on their height and the volume of water they hold (for small structures, what lies downstream also counts).
- Class A is the most closely controlled: it starts at **20 meters** high (a 7-story building), but height is not the only criterion.

### Words to know
- **Concession**: a contract by which the State entrusts a company with building or running a hydroelectric facility, for a limited time.
- **Operator**: the one who runs the dam day to day (sometimes the owner, sometimes a concession company).
- **Downstream**: the side of the dam where the river carries on its way.

> **Did you know?**
> The biggest dams have an alert plan for local residents, with **sirens** tested regularly, so that everyone is ready if one day an evacuation were needed.

### Going further
In France, dams are ranked A, B or C mainly according to their height and the amount of water they hold. The dams in the most important classes get more thorough checks and studies. Some very large facilities also have a special emergency plan (called a PPI) that organizes the alert and the protection of residents in case of an accident.
`,
  },
  "metiers-conceptrice": {
    title: "Designer",
    shortDescription: "She invents the shape of the dam and does all the calculations so that it can withstand the water and the ground.",
    contentMarkdown: `# The designer

### In brief
The designer is the dam's **architect-engineer**. Before the first digger arrives, she draws the dam and checks, with math and computers, that it meets the safety rules with generous margins.

### How does it work?
She works in a design office, a team of engineers. She starts by asking: *which shape fits this valley best?* A curved wall? A huge pile of stones? A very heavy wall?

Then she uses some very clever tools:
- **A model inside the computer**: she makes water, cold, heat and even earthquakes "push" on a virtual dam, to see where it struggles.
- **Flood calculation**: she predicts the biggest flood possible, so that the overflow can be let out without going over the top.
- **Choosing materials**: which concrete, which soil, which rocks.

### Key facts
A dam is calculated to withstand **extremely rare** floods, much bigger than the ones we know: the more important the structure, the more exceptional the reference flood.

### Words to know
- **Concrete**: a mix of cement, sand, gravel and water that hardens like stone.
- **Flood**: when the river swells very strongly.

> **Did you know?**
> A French engineer, **André Coyne**, is one of the great pioneers of modern thin arch dams: curved walls that are thin and strong. His dams have been built on several continents.

### Going further
For floods, engineers do not study only the ones already seen. They also calculate very rare floods to check that the dam and its spillway can cope with them. A so-called "thousand-year" flood has about a one-in-1,000 chance of happening each year: it does not necessarily come back every 1,000 years.
`,
  },
  "metiers-constructeur": {
    title: "Builder",
    shortDescription: "He brings the dam out of the ground by following the plans, with hundreds of people and giant machines.",
    contentMarkdown: `# The builder

### In brief
The builder is the **giant site manager**. He turns the plans into a real dam, sometimes high in the mountains, in narrow gorges or in the middle of a river. Hundreds of people work with him.

### How does it work?
Building a large concrete dam takes a lot of patience. Here is an example of the steps (they change depending on the type of dam):
1. **Divert the river.** You cannot build with your feet in the water! The river is first sent through a tunnel dug into the mountain, while a small temporary wall (a *cofferdam*) keeps it away.
2. **Dig down to solid rock.** Just like the foundations of a house, you need a very hard base.
3. **Pour the concrete**, in big blocks. Inside, small pipes of cold water cool it, because concrete heats up as it sets and could crack.

### Key facts
- Depending on the dam, a large site lasts from **a few years to nearly ten years**.
- Depending on the case, **cable cars** are set up on site to carry equipment, along with a concrete plant and machines that crush rock.

### Words to know
- **Cofferdam**: a temporary wall that keeps water away during the work.
- **Foundation**: the part that sinks into the ground to hold the dam up.

> **Did you know?**
> The Hoover Dam, in the United States, contains miles of cold-water pipes. Without them, the concrete would have taken **more than 100 years** to cool down and would have cracked!

### Going further
The machines depend on the place and on the dam being built. In the high mountains, a cable car can carry workers and materials when no road reaches the site. For a large concrete dam, a concrete plant is often set up nearby to make huge amounts of it.
`,
  },
  "metiers-expert-securite": {
    title: "Safety expert",
    shortDescription: "He monitors the dam's health, like a doctor, to spot the slightest problem very early.",
    contentMarkdown: `# The safety expert

### In brief
The safety expert is the dam's **doctor**. He listens to it, measures it and watches over it, day and night, to spot a tiny problem long before it becomes serious. This work is called **monitoring** (or *auscultation*).

### How does it work?
A dam is not completely still: it moves a tiny bit! It expands (gets slightly bigger) when it is hot, and shrinks when it is cold. The expert:
- reads the measurements of a **pendulum**: a long wire hanging inside the dam, which shows how far the wall moves, to a tenth of a millimeter;
- looks at the **pressure of the water** seeping under the dam;
- sends **divers** or small underwater robots to inspect the wall on the lake side.

### Key facts
The dam is **monitored continuously** and visited regularly. The more important it is, the more frequent the checks and reports.

### Words to know
- **Monitoring (auscultation)**: examining the dam with instruments, like a doctor with a stethoscope.
- **Seepage**: water that slowly slips into rock or soil.

> **Did you know?**
> Among the clues that are watched is the **water from the drains**, small pipes that carry away seepage: its quantity and its clarity are tracked (is it clear or cloudy?). If it turns cloudy, perhaps soil is being carried away: it must be checked quickly!

### Going further
- Monitoring reports: every year (class A), every 3 years (class B), every 5 years (class C).
- Instrument reports: every 2 years (class A), every 5 years (classes B and C).
- On top of that come the visits and rules specific to each dam.
- Clear drain water is not enough to conclude that the dam is safe: the flow, the turbidity (is the water cloudy?) and how they change over time are also followed.
`,
  },
  "metiers-hydrologue": {
    title: "Hydrologist",
    shortDescription: "She studies rain, rivers and floods to know how much water is coming, and when.",
    contentMarkdown: `# The hydrologist

### In brief
The hydrologist is **the scientist of the journey of water**. She follows water from the rain or snow down to the river, to predict floods (too much water) and droughts (not enough).

### How does it work?
To make predictions, she investigates:
- **She measures**: stations placed in rivers measure the flow (the amount of water passing by) and radars follow the rain.
- **She compares with history**: what was the biggest flood in 100 years? In 1,000 years? The dam must be able to cope with it.
- **She looks to the future**: climate change alters snow, droughts and some very heavy rains, in different ways depending on the region. She helps manage water well for the decades to come.

### Key facts
Flow is measured in **cubic meters per second** (m³/s). One cubic meter is 1,000 liters, like 10 full bathtubs. During big storms in the Cévennes, the flow of a small river can **increase enormously** in just a few hours!

### Words to know
- **Watershed (drainage basin)**: the whole area where rain ends up in the same river.
- **Evaporation**: when the water of a lake flies off as vapor, thanks to the sun and wind.

> **Did you know?**
> A large lake can lose **several millimeters of water per day** in summer, just through evaporation. Hydrologists measure that too!

### Going further
Hydrologists do not make a single prediction of the future: they compare several models. Depending on the region, climate change can affect rain, snow, droughts and floods in different ways. In France, the Explore2 project studies these changes basin by basin, and also shows what scientists still understand poorly.
`,
  },
  "metiers-geologue": {
    title: "Geologist",
    shortDescription: "Before the work starts, she studies the rocks and the ground to check that the terrain is solid enough.",
    contentMarkdown: `# The geologist

### In brief
A dam is only as good as the ground it stands on! The geologist is **the rock specialist**. She explores the underground of the valley to be sure it will not give way, and will not let the water leak out.

### How does it work?
From the very first studies, she:
- **drills holes** and brings up "cores": long cylinders of rock, to spot cracks and pockets of clay;
- **tests watertightness**: she injects pressurized water into the hole and watches whether it escapes;
- **plans a "grout curtain"**: a curtain of liquid cement pushed into small cracks, to block the paths of the water.

### Key facts
For an arch-shaped dam, the cliffs on each side must bear an **enormous thrust**: the geologist checks that they are strong enough.

### Words to know
- **Geologist**: a person who studies rocks and the history of the Earth.
- **Fault**: a large natural crack in the rock.

> **Did you know?**
> In 1959, the Malpasset dam (France) failed. It was not the concrete of the arch that gave way first: investigations pointed to the role of the **rock** it rested on and the water inside it. Since then, the rock and the underground water are studied much more carefully.

### Going further
The choice of dam depends on several things: the shape of the valley, the strength and watertightness of the rock, the materials available, the floods to be passed and what the dam will be used for. A narrow valley with very solid rock may suit an arch dam well; a wider valley may suit an embankment dam better.
`,
  },
};
