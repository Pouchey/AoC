import dotenv from 'dotenv';
import { log } from './utils/logger';
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

const LEADERBOARD_URL = `https://adventofcode.com/2025/leaderboard/private/view/${process.env.AOC_LEADERBOARD_ID}.json`;

/**
 * Fetches the leaderboard data from Advent of Code
 */
const fetchLeaderboard = async (): Promise<LeaderboardData> => {
  const res = await fetch(LEADERBOARD_URL, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_COOKIE}`
    }
  });

  if (res.status !== 200) {
    throw new Error(
      `Fetching "${LEADERBOARD_URL}" failed with status ${res.status}:\n${await res.text()}`
    );
  }

  return await res.json();
};

/**
 * Formats timestamp to readable date/time
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Formats time difference in a readable way
 */
const formatTimeDiff = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * Generates a Teams-formatted message from leaderboard data
 */
const generateTeamsMessage = (data: LeaderboardData): string => {
  const members = Object.values(data.members)
    .filter((m) => m.stars > 0)
    .sort((a, b) => b.local_score - a.local_score || b.stars - a.stars);

  if (members.length === 0) {
    return "🎄 Advent of Code 2025 - Leaderboard\n\nAucun participant n'a encore complété de défi.";
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

  message += `\n🔗 Voir le leaderboard complet: ${LEADERBOARD_URL.replace('.json', '')}`;

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
