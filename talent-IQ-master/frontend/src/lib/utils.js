export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

/**
 * Returns color specifications based on problem difficulty
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
 * @returns {{bg: string, text: string, tag: string}} Color object
 */
export const getDifficultyColor = (difficulty) => {
  const diff = difficulty?.toLowerCase();
  if (diff === 'easy') return { bg: '#00E5A015', text: '#00E5A0', tag: 'var(--green)' };
  if (diff === 'medium') return { bg: '#F59E0B15', text: '#F59E0B', tag: 'var(--amber)' };
  if (diff === 'hard') return { bg: '#F8717115', text: '#F87171', tag: 'var(--red)' };
  return { bg: 'var(--surface2)', text: 'var(--text3)', tag: 'var(--text3)' };
};

/**
 * Formats seconds into MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Generates an array of 30 activity levels (0-3) for a heatmap
 * @param {Array} activities - Array of activity objects
 * @returns {number[]} Array of 30 numbers showing activity depth
 */
export const generateActivityHeatmap = (activities = []) => {
  // Mock generic output for empty logic or placeholder - realistic length 30
  const defaultHeatmap = [0,1,0,2,1,0,3,1,0,0,2,1,0,1,3,2,0,1,0,2,1,1,0,3,2,1,0,2,1,2];
  if (!activities || activities.length === 0) return defaultHeatmap;
  
  // Real calculation could map dates to last 30 days
  return defaultHeatmap; 
};

/**
 * Formats a raw session object's details into standardized stats
 * @param {Object} session - Session object
 * @returns {{runtime: string, beats: string, complexity: string, xp: string}} Formatted stats
 */
export const formatSessionStats = (session) => {
  if (!session) return { runtime: '-', beats: '-', complexity: '-', xp: '-' };
  return {
    runtime: session.runtime ? `${session.runtime}ms` : '-',
    beats: session.beats ? `${session.beats}%` : '-',
    complexity: session.complexity || '-',
    xp: session.xp ? `+${session.xp}` : '-'
  };
};

/**
 * Common user achievement badges
 */
export const ACHIEVEMENTS = {
  STREAK_14: { id: 'streak_14', icon: '🔥', label: '14 streak', color: 'var(--green)' },
  SPEED_SOLVER: { id: 'speed_solver', icon: '⚡', label: 'Speed solver', color: '#F59E0B' },
  SESSIONS_10: { id: 'sessions_10', icon: '🧠', label: '10 sessions', color: '#8B7CF6' },
  COLLABORATOR: { id: 'collaborator', icon: '🤝', label: 'Collaborator', color: '#60A5FA' }
};
