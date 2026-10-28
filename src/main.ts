import { Cache } from "./decorators.js";
import { SpellRepository, WizardRepository } from "./repository.js";
import type { House, SpellCastEvent, Wizard } from "./types.js";

const wizards = new WizardRepository();

const harry = wizards.register({
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
});

const draco = wizards.register({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 4,
  active: true,
});

wizards.register({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 7,
  active: true,
});

console.log(harry);
console.log(draco);
console.log(wizards.findByHouse("Gryffindor"));
console.log(wizards.findByHouse("Ravenclaw"));

function handleSpellCast(event: SpellCastEvent): void {
  console.log(`Wizard ${event.wizardId} cast ${event.spellName}`);
}

handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus",
});

const spells = new SpellRepository();

spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 50,
});

try {
  spells.add({
    id: 103,
    name: "Invalid Spell",
    category: "attack",
    power: -10,
  });
} catch (error) {
  console.log((error as Error).message);
}

console.log(spells.getAll());

class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

const calculator = new SpellCalculator();

console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));

const validHouses: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff",
];

function isHouse(value: unknown): value is House {
  return typeof value === "string" && validHouses.some((house) => house === value);
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

const validData: unknown = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
};

const invalidData: unknown = {
  id: 2,
  name: "Viktor",
  house: "Durmstrang",
  level: 5,
  active: true,
};

console.log(isWizard(validData));
console.log(isWizard(invalidData));
