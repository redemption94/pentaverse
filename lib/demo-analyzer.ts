import { DemoFile } from "demofile";
import axios from "axios";
const bz2 = require("unbzip2-stream");

export async function parseCS2Demo(url: string, targetSteamId: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Descărcăm demo-ul (stream)
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });

      const demoFile = new DemoFile();
      let stats = {
        kills: 0,
        deaths: 0,
        mvps: 0,
        map: "",
        score: { team: 0, enemy: 0 }
      };

      // 2. Extragem datele din header
      demoFile.on("start", () => {
        stats.map = demoFile.header.mapName;
      });

      // 3. Numărăm kill-urile pentru SteamID-ul țintă
      demoFile.gameEvents.on("player_death", (e) => {
        const victim = demoFile.entities.getByUserId(e.userid);
        const attacker = demoFile.entities.getByUserId(e.attacker);

        if (attacker && attacker.steam64Id === targetSteamId) {
          stats.kills++;
        }
        if (victim && victim.steam64Id === targetSteamId) {
          stats.deaths++;
        }
      });

      // 4. Extragem scorul final
      demoFile.gameEvents.on("round_end", (e) => {
        // Actualizăm scorul la fiecare rundă
        // Aceasta este o variantă simplificată
      });

      demoFile.on("end", () => {
        resolve(stats);
      });

      // Pornim procesarea stream-ului decompresat
      response.data.pipe(bz2()).pipe(demoFile);

    } catch (error) {
      reject(error);
    }
  });
}
