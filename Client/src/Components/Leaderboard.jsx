import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Leaderboard = () => {
  const { user } = useUser();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard', {
          headers: {
            'Authorization': `Bearer ${await user.getToken()}`
          }
        });
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  const isInTop25 = leaderboardData?.top25.some(
    player => player.clerkId === leaderboardData.currentUser.clerkId
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>XP Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top 25 List */}
          <div className="space-y-2">
            {leaderboardData?.top25.map((player, index) => (
              <div
                key={player.clerkId}
                className={`flex items-center justify-between p-2 rounded ${
                  player.clerkId === leaderboardData.currentUser.clerkId
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold w-8">{index + 1}</span>
                  <span>{player.username}</span>
                </div>
                <span className="font-semibold">{player.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>

          {/* Current User Status (if not in top 25) */}
          {!isInTop25 && (
            <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900 p-3 rounded">
                <div className="flex items-center gap-3">
                  <span className="font-bold w-8">
                    {leaderboardData.currentUser.rank}
                  </span>
                  <span>{leaderboardData.currentUser.username} (You)</span>
                </div>
                <span className="font-semibold">
                  {leaderboardData.currentUser.xp.toLocaleString()} XP
                </span>
              </div>
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Keep practicing! You need {
                  leaderboardData.top25[24].xp - leaderboardData.currentUser.xp
                } more XP to reach the top 25!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;