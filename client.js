const alt = require("alt-client");
const config = require("./config");

let currentPoints = null;

// HUD für Gangwar
alt.on("render", () => {
    if (currentPoints) {
        alt.drawText2D(`Punkte: ${JSON.stringify(currentPoints)}`, 0.5, 0.05, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
});

// Punktestand aktualisieren
alt.onServer("updateGangwarPoints", (points) => {
    currentPoints = points;
});

// Spieler in Zone eintreten
alt.on("playerEnterColshape", (colshape) => {
    if (colshape.zoneName) {
        alt.emitServer("playerEnterColshape", colshape.zoneName);
    }
});
