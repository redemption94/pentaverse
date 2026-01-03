import { DemoFile } from "demofile";
import axios from "axios";
// @ts-ignore
import bz2 from "unbzip2-stream";

/**
 * Parser pentru demo-uri CS2 reparat pentru TypeScript
 */
export async function parseCS2Demo(url: string, targetSteamId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Descărcăm demo-ul
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
        timeout: 45000 // Mărim timpul la 45 secunde pentru fișiere mari
      });

      const demoFile = new DemoFile();
      const stats = {
        kills: 0,
        deaths: 0,
        map: "Unknown",
        score: { team: 0, enemy: 0 }
      };

      // 2. Extragem harta din header
      demoFile.on("start", () => {
        stats.map = demoFile.header.mapName;
      });

      // 3. Gestionăm erorile specifice parserului
      demoFile.on("error", (error) => {
        reject(`Parser Error: ${error}`);
      });

      // 4. Numărăm kill-urile
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

      // 5. Finalizare - am eliminat referința la demoFile.error care dădea eroarea
      demoFile.on("end", () => {
        resolve(stats);
      });

      // Pornim procesarea
      response.data.pipe(bz2()).pipe(demoFile);

    } catch (error: any) {
      reject(`Download/System Error: ${error.message}`);
    }
  });
}
