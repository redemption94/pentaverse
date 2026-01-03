const handleSyncSteam = async () => {
  setStatus('validating');
  try {
    const res = await fetch(`/api/validate-steam?steamId=${steamId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    
    setPlayerData(data.player);
    setStatus('success');
    setTimeout(() => {
      // Redirecționăm către noul profil bazat pe SteamID
      router.push(`/profile/${steamId}`);
    }, 2000);
  } catch (err: any) {
    setStatus('error');
    setErrorMsg("Te rugăm să te asiguri că profilul tău de Steam și 'Game Details' sunt setate pe PUBLIC.");
  }
};
