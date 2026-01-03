// Decodor simplificat pentru Match Sharing Codes
export function decodeShareCode(shareCode: string) {
  if (!shareCode.startsWith('CSGO-')) return null;
  
  // În mod normal, aici se folosește un algoritm de tip Byte-Shifting (Base33)
  // Pentru Pentaverse, extragem segmentele necesare identificării în rețeaua Valve
  const parts = shareCode.replace('CSGO-', '').split('-');
  
  return {
    is_valid: parts.length === 5,
    token: shareCode
  };
}
