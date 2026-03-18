const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vomkgrykbsvjiijmsazf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbWtncnlrYnN2amlpam1zYXpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzg0MjEwMCwiZXhwIjoyMDg5NDE4MTAwfQ.vs4vkkm_fsHrepf9sOnCjMzbsP_tKFpsxBEzaVXnBhk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BOTS = [
  { name: '🤖 Bot Alisa', score: 0, current_step: 1 },
  { name: '🤖 Bot Somchai', score: 0, current_step: 1 },
  { name: '🤖 Bot Ben', score: 0, current_step: 1 },
  { name: '🤖 Bot Ploy', score: 0, current_step: 1 },
  { name: '🤖 Bot James', score: 0, current_step: 1 },
];

async function simulate() {
  console.log('🚀 Starting Player Simulation...');
  
  // Create bots
  const { data: createdBots, error } = await supabase
    .from('players')
    .insert(BOTS)
    .select();

  if (error) {
    console.error('❌ Failed to create bots:', error);
    return;
  }

  console.log(`✅ Created ${createdBots.length} bots.`);

  // Simulation loop
  setInterval(async () => {
    for (const bot of createdBots) {
      const scoreAdd = Math.floor(Math.random() * 200);
      const stepAdd = Math.random() > 0.8 ? 1 : 0;
      
      const { data } = await supabase
        .from('players')
        .update({ 
          score: bot.score + scoreAdd,
          current_step: Math.min(5, bot.current_step + stepAdd),
          last_active: new Date().toISOString()
        })
        .eq('id', bot.id)
        .select()
        .single();
      
      if (data) {
        bot.score = data.score;
        bot.current_step = data.current_step;
      }
    }
    console.log('🔄 Bots updated scores...');
  }, 5000);
}

simulate();
