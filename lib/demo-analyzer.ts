import { DemoFile } from "demofile";
import axios from "axios";
// @ts-ignore
import bz2 from "unbzip2-stream";

/**
 * Parser pentru demo-uri CS2
 * Extrage harta, kills și deaths dintr-un link de download Valve
 */
export async function parseCS2Demo(url: string, targetSteamId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Descărcăm demo-ul ca stream
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
        timeout: 30000 // Timeout după 30 secunde
      });

      const demoFile = new DemoFile();
      const stats = {
        kills: 0,
        deaths: 0,
        map: "Unknown",
        score: { team: 0, enemy: 0 }
      };

      // 2. Citim Header-ul (Harta)
      demoFile.on("start", () => {
        stats.map = demoFile.header.mapName;
      });

      // 3. Monitorizăm evenimentele de kill
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

      // 4. Finalizare și returnare date
      demoFile.on("end", () => {
        if (demoFile.error) {
          reject("Eroare la parsarea fișierului.");
        } else {
          resolve(stats);
        }
      });

      // Procesăm stream-ul decomprimat prin BZ2
      response.data.pipe(bz2()).pipe(demoFile);

    } catch (error: any) {
      reject(`Download Error: ${error.message}`);
    }
  });
}
