const { data: player, error } = await supabase
  .from('players')
  .select('*')
  .eq('steam_id', params.id) // Căutăm după ID-ul de Steam din URL
  .single();
