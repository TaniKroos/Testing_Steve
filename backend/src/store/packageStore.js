import { seedPackages } from "../data/seedPackages.js";

let packages = structuredClone(seedPackages);

export const packageStore = {
  list() { return packages; },
  get(id) { return packages.find((travelPackage) => travelPackage.id === id); },
  create(travelPackage) { packages.unshift(travelPackage); return travelPackage; },
  update(id, changes) { const index = packages.findIndex((travelPackage) => travelPackage.id === id); if (index === -1) return null; packages[index] = { ...packages[index], ...changes, id }; return packages[index]; }
};
