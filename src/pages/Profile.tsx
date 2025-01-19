import { useState } from "react";
import { 
  BarChart as BarChartIcon,
  Calendar, 
  Trophy,
  Dumbbell,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

// Helper function to generate dates for past weeks
const getPastWeeks = (numWeeks: number) => {
  const weeks = [];
  const today = new Date();
  
  for (let i = numWeeks - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    weeks.push({
      week: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      }),
      workouts: Math.floor(Math.random() * 4) + 1 // Mock data: 1-4 workouts
    });
  }
  return weeks;
};

// Updated mock data with actual dates
const workoutData = getPastWeeks(6);

const strengthProgress = [
  { date: '2024-01', bench: 60, squat: 80, deadlift: 100 },
  { date: '2024-02', bench: 65, squat: 85, deadlift: 110 },
  { date: '2024-03', bench: 70, squat: 90, deadlift: 120 },
  { date: '2024-04', bench: 72.5, squat: 95, deadlift: 125 },
  { date: '2024-05', bench: 75, squat: 100, deadlift: 130 },
];

const Profile = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Your fitness journey</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">This Week</span>
            </div>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <p className="text-2xl font-bold">5.2</p>
            <p className="text-xs text-muted-foreground">Hours this week</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <p className="text-2xl font-bold">12.5k</p>
            <p className="text-xs text-muted-foreground">kg this week</p>
          </Card>
        </div>

        {/* Updated Workout Frequency Chart */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold">Workout Frequency</h2>
              <p className="text-sm text-muted-foreground">Workouts per week</p>
            </div>
            <BarChartIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-[250px]"> {/* Negative margin to span full width */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={workoutData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis 
                  dataKey="week" 
                  fontSize={12}
                  tickMargin={5}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickMargin={5}
                  domain={[0, 'auto']}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  cursor={{ fill: 'hsl(var(--accent)/0.1)' }}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="hsl(var(--accent))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Updated Strength Progress Chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold">Strength Progress</h2>
              <p className="text-sm text-muted-foreground">Main lifts (kg)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-[250px]"> 
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={strengthProgress}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickMargin={5}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleString('default', { month: 'short' });
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickMargin={5}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bench" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Bench Press"
                  dot={{ fill: "hsl(var(--accent))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="squat" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Squat"
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="deadlift" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Deadlift"
                  dot={{ fill: "hsl(var(--secondary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile; 