// constants/dates.js
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

export function getGreetingIcon() {
  const hour = new Date().getHours();
  if (hour < 6) return 'moon';
  if (hour < 12) return 'partly-sunny';
  if (hour < 18) return 'sunny';
  return 'moon';
}

export function getTodayLabel() {
  const d = new Date();
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const date = d.getDate();
  return `${day}, ${month} ${date}`;
}