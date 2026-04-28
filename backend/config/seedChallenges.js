import Challenge from "../models/Challenge.js";

const DEFAULT_CHALLENGES = [
  {
    title: "Waste Segregation Day",
    description: "Separate wet and dry waste at home for one full day.",
    points: 25,
  },
  {
    title: "Neighborhood Clean-up",
    description: "Spend 20 minutes cleaning your nearby street or lane.",
    points: 40,
  },
  {
    title: "Carry Reusable Bag",
    description: "Use a reusable bag for all shopping today.",
    points: 15,
  },
  {
    title: "Water Saver",
    description: "Reduce unnecessary tap usage and save water today.",
    points: 20,
  },
];

export async function seedDefaultChallenges() {
  for (const item of DEFAULT_CHALLENGES) {
    await Challenge.updateOne(
      { title: item.title },
      { $setOnInsert: item },
      { upsert: true }
    );
  }
}
