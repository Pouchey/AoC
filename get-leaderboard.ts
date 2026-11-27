import dotenv from 'dotenv';
import { log } from './utils/logger';
import { aocFetch } from './utils/aoc';
dotenv.config();

interface LeaderboardMember {
  name: string | null;
  stars: number;
  local_score: number;
  completion_day_level: {
    [day: string]: {
      [part: string]: {
        get_star_ts: number;
      };
    };
  };
}

interface LeaderboardData {
  event: string;
  owner_id: string;
  members: {
    [id: string]: LeaderboardMember;
  };
}

const currentYear = new Date().getFullYear();

const LEADERBOARD_PATH = `/${currentYear}/leaderboard/private/view/${process.env.AOC_LEADERBOARD_ID}.json`;

/**
 * Fetches the leaderboard data from Advent of Code
 */
const fetchLeaderboard = async (): Promise<LeaderboardData> => {
  return JSON.parse(await aocFetch(LEADERBOARD_PATH));
};

/**
 * Generates a Teams-formatted message from leaderboard data
 */
const generateTeamsMessage = (data: LeaderboardData): string => {
  const members = Object.values(data.members)
    .filter((m) => m.stars > 0)
    .sort((a, b) => b.local_score - a.local_score || b.stars - a.stars);

  if (members.length === 0) {
    return `🎄 Advent of Code ${currentYear} - Leaderboard\n\nAucun participant n'a encore complété de défi.`;
  }

  let message = `🎄 Advent of Code ${data.event} - Leaderboard\n\n`;
  message += `📊 Classement (${members.length} participant${members.length > 1 ? 's' : ''})\n\n`;

  // Top 10
  const topMembers = members.slice(0, 10);
  topMembers.forEach((member, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const name = member.name || 'Anonyme';
    message += `${medal} ${name} - ${member.stars} ⭐ (Score: ${member.local_score})\n`;
  });

  if (members.length > 10) {
    message += `\n... et ${members.length - 10} autre${
      members.length - 10 > 1 ? 's' : ''
    } participant${members.length - 10 > 1 ? 's' : ''}\n`;
  }

  // Statistics
  const totalStars = members.reduce((sum, m) => sum + m.stars, 0);
  const avgStars = (totalStars / members.length).toFixed(1);
  const maxStars = Math.max(...members.map((m) => m.stars));

  message += `\n📈 Statistiques\n`;
  message += `• Total d'étoiles: ${totalStars} ⭐\n`;
  message += `• Moyenne: ${avgStars} ⭐ par participant\n`;
  message += `• Record: ${maxStars} ⭐\n`;

  // Recent completions (last 5)
  const allCompletions: Array<{
    name: string;
    day: string;
    part: string;
    timestamp: number;
  }> = [];

  members.forEach((member) => {
    const name = member.name || 'Anonyme';
    Object.entries(member.completion_day_level).forEach(([day, parts]) => {
      Object.entries(parts).forEach(([part, data]) => {
        allCompletions.push({
          name,
          day,
          part,
          timestamp: data.get_star_ts
        });
      });
    });
  });

  allCompletions.sort((a, b) => b.timestamp - a.timestamp);
  const recentCompletions = allCompletions.slice(0, 5);

  if (recentCompletions.length > 0) {
    message += `\n🆕 Dernières complétions\n`;
    recentCompletions.forEach((completion) => {
      message += `• ${completion.name} - Jour ${completion.day}, Partie ${completion.part} \n`;
    });
  }

  message += `\n🔗 Voir le leaderboard complet: https://adventofcode.com${LEADERBOARD_PATH.replace(
    '.json',
    ''
  )}`;

  return message;
};

/**
 * Main function
 */
const main = async () => {
  try {
    log('Récupération du leaderboard...', 'info', 'blue');

    if (!process.env.AOC_SESSION_COOKIE) {
      throw new Error(
        'AOC_SESSION_COOKIE environment variable is not set. Please add it to your .env file.'
      );
    }

    const data = await fetchLeaderboard();
    log(
      `Leaderboard récupéré avec succès! (${Object.keys(data.members).length} membres)`,
      'info',
      'green'
    );

    const teamsMessage = generateTeamsMessage(data);

    console.log('\n' + '='.repeat(60));
    console.log('MESSAGE POUR TEAMS:');
    console.log('='.repeat(60) + '\n');
    console.log(teamsMessage);
    console.log('\n' + '='.repeat(60));

    // Also save to a file for easy copy-paste
    const fs = await import('fs');
    const outputFile = 'leaderboard-teams-message.txt';
    fs.writeFileSync(outputFile, teamsMessage, 'utf-8');
    log(`\nMessage sauvegardé dans ${outputFile}`, 'info', 'cyan');
  } catch (error) {
    if (error instanceof Error) {
      log(error.message, 'error', 'red');
    } else {
      log('Une erreur est survenue lors de la récupération du leaderboard.', 'error', 'red');
    }
    process.exit(1);
  }
};

main();
