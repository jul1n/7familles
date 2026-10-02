import type { CardText } from "./types";
import { EN_COMPOSANTS } from "./composants";
import { EN_FRANCE } from "./france";
import { EN_METIERS } from "./metiers";
import { EN_MONDE } from "./monde";
import { EN_TEMPS } from "./temps";
import { EN_TYPES } from "./types-ouvrages";
import { EN_USAGES } from "./usages";

export type { CardText };

export const EN_CARDS: Record<string, CardText> = {
  ...EN_METIERS,
  ...EN_USAGES,
  ...EN_COMPOSANTS,
  ...EN_TYPES,
  ...EN_MONDE,
  ...EN_FRANCE,
  ...EN_TEMPS,
};

export const EN_FAMILIES: Record<string, { name: string; description: string }> = {
  metiers: { name: "Jobs", description: "The women and men who design, build and monitor dams." },
  usages: { name: "Uses", description: "From drinking water to electricity: the many essential missions of reservoirs." },
  composants: { name: "Components", description: "The key parts that make a dam work and keep it safe." },
  "types-ouvrages": { name: "Types of structures", description: "Embankment, gravity, arch, canals or pumped storage: the designs suited to each valley." },
  "dans-le-monde": { name: "Around the world", description: "The giants of hydropower and waterways on a planetary scale." },
  "en-france": { name: "In France", description: "The masterpieces of French water heritage, from mainland France to the overseas territories." },
  "dans-le-temps": { name: "Through time", description: "2,000 years of water history: from Roman Antiquity to the canals of the 21st century." },
};
