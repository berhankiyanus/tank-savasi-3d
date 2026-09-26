// Shared, deterministic reward rules. The caller persists the updated quest state.
export function dailyQuestIds(bestWave, seed) {
  const experienced = bestWave >= 6;
  return [experienced ? 'play3' : 'play1', experienced && seed % 2 ? 'kill30' : 'kill15',
    experienced ? (seed % 3 === 0 ? 'win2' : 'wave6') : 'wave3'];
}

export function collectQuestRewards(quests, definitions, requestedIds) {
  const requested = new Set(requestedIds);
  const claimed = [];
  const result = { coins: 0, xp: 0, seasonXp: 0, tokens: 0, chest: false, claimed };
  for (const q of quests.list) {
    const def = definitions.find(d => d.id === q.id);
    if (!def || !requested.has(q.id) || q.claimed || !(q.prog >= def.goal) || claimed.includes(q.id)) continue;
    q.claimed = true;
    claimed.push(q.id);
    result.coins += def.reward;
    result.xp += 25;
    result.seasonXp += 25;
    result.tokens++;
  }
  if (claimed.length && !quests.chest && quests.list.every(q => q.claimed)) {
    quests.chest = result.chest = true;
    result.coins += 120;
    result.tokens += 2;
  }
  return result;
}

export function isStandardTimeRecord(duration, previous, weekly) {
  return !weekly && Number.isFinite(duration) && duration > 0 && (!previous || duration < previous);
}

export const CAREER_STEPS = [
  { id: 'training', stat: 'tutorialDone', goal: 1, coins: 60, name: { tr: 'İlk emir', en: 'First orders' }, text: { tr: 'Dört eğitim adımını tamamla', en: 'Complete the four tutorial steps' } },
  { id: 'firstkills', stat: 'kills', goal: 10, coins: 100, name: { tr: 'Cepheye hazır', en: 'Combat ready' }, text: { tr: 'Toplam 10 düşman tankı yok et', en: 'Destroy 10 enemy tanks in total' } },
  { id: 'breakthrough', stat: 'bestWave', goal: 3, accessory: 'fieldradio', duplicateCoins: 100, name: { tr: 'Bağlantı kuruldu', en: 'Connection established' }, text: { tr: 'Dalga 3’e ulaş · Saha Telsizi kazan', en: 'Reach wave 3 · earn the Field Radio' } },
  { id: 'fleet', stat: 'owned', goal: 2, tokens: 2, name: { tr: 'Kendi filon', en: 'Your own fleet' }, text: { tr: 'İki farklı tanka sahip ol', en: 'Own two different tanks' } },
  { id: 'victory', stat: 'wins', goal: 1, accessory: 'rescuepack', duplicateCoins: 150, gems: 1, name: { tr: 'İlk zafer', en: 'First victory' }, text: { tr: 'Bir maç kazan · Kurtarma Çantası kazan', en: 'Win a match · earn the Rescue Pack' } },
];

export function careerProgress(profile, step) {
  return Math.min(step.goal, step.stat === 'owned' ? new Set(profile.owned || []).size : Math.max(0, Number(profile[step.stat]) || 0));
}

export function collectCareerReward(profile, id) {
  const step = CAREER_STEPS.find(s => s.id === id);
  if (!step || (profile.careerClaims || []).includes(id) || careerProgress(profile, step) < step.goal) return null;
  const reward = { coins: step.coins || 0, tokens: step.tokens || 0, gems: step.gems || 0, accessory: '' };
  if (step.accessory) {
    profile.accessories ||= [];
    if (profile.accessories.includes(step.accessory)) reward.coins += step.duplicateCoins || 0;
    else { profile.accessories.push(step.accessory); reward.accessory = step.accessory; }
  }
  (profile.careerClaims ||= []).push(id);
  return reward;
}
