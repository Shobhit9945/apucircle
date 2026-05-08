export function getActivityStatus(lastAnnouncementAt) {
  if (!lastAnnouncementAt) {
    return { label: 'Inactive', tone: 'red', daysSinceLastPost: null };
  }

  const daysSinceLastPost = Math.floor((Date.now() - new Date(lastAnnouncementAt).getTime()) / 86400000);

  if (daysSinceLastPost <= 30) {
    return { label: 'Active', tone: 'green', daysSinceLastPost };
  }

  if (daysSinceLastPost <= 90) {
    return { label: 'Quiet', tone: 'yellow', daysSinceLastPost };
  }

  return { label: 'Inactive', tone: 'red', daysSinceLastPost };
}
