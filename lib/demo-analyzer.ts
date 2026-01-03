import { DemoFile } from "demofile";
import axios from "axios";
// @ts-ignore
import bz2 from "unbzip2-stream";

export async function parseCS2Demo(url: string, targetSteamId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
        timeout: 60000 // Demo-urile sunt mari, lăsăm 60 secunde
      });

      const demoFile = new DemoFile();
      const playersStats = new Map(); // Aici stocăm toți jucătorii

      demoFile.on("start", () => {
        // Inițializăm harta
      });

      // Monitorizăm fiecare kill pentru toți jucătorii
      demoFile.gameEvents.on("player_death", (e) => {
        const victim = demoFile.entities.getByUserId(e.userid);
        const attacker = demoFile.entities.getByUserId(e.attacker);

        if (attacker && attacker.steam64Id) {
          const s = playersStats.get(attacker.steam64Id) || { kills: 0, deaths: 0, nickname: attacker.name, team: attacker.teamNumber };
          s.kills++;
          playersStats.set(attacker.steam64Id, s);
        }
        if (victim && victim.steam64Id) {
          const s = playersStats.get(victim.steam64Id) || { kills: 0, deaths: 0, nickname: victim.name, team: victim.teamNumber };
          s.deaths++;
          playersStats.set(victim.steam64Id, s);
        }
      });

      demoFile.on("end", () => {
        // Convertim Map-ul într-un array de obiecte pentru baza de date
        const allPlayers = Array.from(playersStats.entries()).map(([sid, data]) => ({
          steam_id: sid,
          nickname: data.nickname,
          kills: data.kills,
          deaths: data.deaths,
          // Mapăm teamNumber (2 = T, 3 = CT) la formatul nostru SIDE_A/B
          team: data.team === 2 ? 'SIDE_B' : 'SIDE_A' 
        }));

        resolve({
          map: demoFile.header.mapName,
          players: allPlayers
        });
      });

      response.data.pipe(bz2()).pipe(demoFile);
    } catch (error: any) {
      reject(error);
    }
  });
}
