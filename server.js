const alt = require("alt-server");
const config = require("./config");

let activeZones = {}; // Aktuelle Gangwar-Zustände
let factionPoints = {}; // Punkte der Fraktionen

// Hilfsfunktion: Prüfen, ob ein Zeitpunkt innerhalb des Angriffszeitraums liegt
function isAttackTime() {
    const hour = new Date().getHours();
    return hour >= config.attackTime.start && hour <= config.attackTime.end;
}

// Gangwar starten
function startGangwar(zone, attackerFaction, defenderFaction) {
    if (activeZones[zone.name]) return; // Zone ist bereits aktiv
    activeZones[zone.name] = { attackerFaction, defenderFaction, points: { [attackerFaction]: 0, [defenderFaction]: 0 } };

    alt.log(`Gangwar gestartet in ${zone.name} zwischen ${attackerFaction} und ${defenderFaction}`);

    // Spieler in die Dimension versetzen
    alt.Player.all.forEach((player) => {
        if (player.faction === attackerFaction || player.faction === defenderFaction) {
            player.dimension = config.gangwarDimension;
            player.spawn(attackerFaction === player.faction ? config.spawnPoints.gangA : config.spawnPoints.gangB);
        }
    });

    // Punkte-Tracking starten
    alt.setInterval(() => updatePoints(zone), 1000);
}

// Punkte aktualisieren (z. B. basierend auf Kills)
function updatePoints(zone) {
    const zoneData = activeZones[zone.name];
    if (!zoneData) return;

    // Punkte-Berechnung (z. B. zufällige Simulation)
    const attackerPoints = Math.floor(Math.random() * 5);
    const defenderPoints = Math.floor(Math.random() * 5);

    zoneData.points[zoneData.attackerFaction] += attackerPoints;
    zoneData.points[zoneData.defenderFaction] += defenderPoints;

    // Aktuellen Punktestand anzeigen
    alt.log(`Punkte für ${zone.name}: ${JSON.stringify(zoneData.points)}`);
}

// Gangwar beenden
function endGangwar(zone) {
    const zoneData = activeZones[zone.name];
    if (!zoneData) return;

    const winner = zoneData.points[zoneData.attackerFaction] > zoneData.points[zoneData.defenderFaction]
        ? zoneData.attackerFaction
        : zoneData.defenderFaction;

    alt.log(`Gangwar in ${zone.name} beendet. Gewinner: ${winner}`);
    delete activeZones[zone.name];

    // Spieler in die Hauptdimension zurücksetzen
    alt.Player.all.forEach((player) => {
        player.dimension = 0;
    });
}

// Angriff starten
alt.on("playerEnterColshape", (player, colshape) => {
    if (!isAttackTime()) {
        player.notify("Gangwars sind aktuell nicht möglich.");
        return;
    }

    const zone = config.zones.find((z) => z.name === colshape.zoneName);
    if (!zone) return;

    const attackerFaction = player.faction;
    const defenderFaction = activeZones[zone.name]?.defenderFaction;

    if (config.allowedFactions.includes(attackerFaction) && defenderFaction && defenderFaction !== attackerFaction) {
        startGangwar(zone, attackerFaction, defenderFaction);
    }
});
