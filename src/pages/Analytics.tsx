import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const data = [
  { name: 'Mon', workouts: 2 },
  { name: 'Tue', workouts: 3 },
  { name: 'Wed', workouts: 1 },
  { name: 'Thu', workouts: 4 },
  { name: 'Fri', workouts: 2 },
  { name: 'Sat', workouts: 0 },
  { name: 'Sun', workouts: 1 },
];

const Analytics = () => {
  return (
    <div className="container pb-20">
      <h1 className="text-2xl font-bold my-6">Analytics</h1>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Weekly Workouts</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workouts" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <BottomNav />
    </div>
  );
};

export default Analytics;