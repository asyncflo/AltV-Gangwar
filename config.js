module.exports = {
    zones: [
        { name: "Zone 1", center: { x: 100, y: 100, z: 20 }, radius: 50 },
        { name: "Zone 2", center: { x: 200, y: 200, z: 20 }, radius: 50 },
        { name: "Zone 3", center: { x: 300, y: 300, z: 20 }, radius: 50 },
        { name: "Zone 4", center: { x: 400, y: 400, z: 20 }, radius: 50 },
        { name: "Zone 5", center: { x: 500, y: 500, z: 20 }, radius: 50 },
    ],
    attackTime: { start: 18, end: 23 },
    allowedFactions: ["Gang A", "Gang B", "Gang C"],
    gangwarDimension: 100, // Eigene Dimension für Gangwars
    spawnPoints: {
        gangA: { x: 1000, y: 1000, z: 20 },
        gangB: { x: 1050, y: 1000, z: 20 },
    },
    vehicles: ["sultan", "banshee"], // Fahrzeuge, die gespawnt werden können
};
