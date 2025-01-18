import { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkoutCard from "@/components/WorkoutCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [username] = useState("Fitness Enthusiast");
  
  const workouts = [
    {
      title: "Recovery Session",
      duration: 20,
      tags: ["Low Impact", "Stretching"],
      thumbnails: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      intensity: "recovery",
    },
    {
      title: "Full Body Challenge",
      duration: 45,
      tags: ["High Intensity", "Full Body"],
      thumbnails: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      intensity: "hard",
    },
    {
      title: "Balanced Workout",
      duration: 30,
      tags: ["Moderate", "Balanced"],
      thumbnails: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      intensity: "average",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-20">
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-white opacity-80">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white">0</span>
            <div className="w-6 h-6 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hi, {username}!
          </h1>
          <p className="text-white/80">Choose your workout intensity for today</p>
        </div>

        {/* Workout Cards */}
        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <WorkoutCard
              key={index}
              {...workout}
              onClick={() => console.log("Workout clicked:", workout.title)}
            />
          ))}
        </div>

        {/* Custom Workout Button */}
        <Button
          variant="secondary"
          className="w-full mt-6 bg-white/10 text-white hover:bg-white/20"
          onClick={() => console.log("Custom workout clicked")}
        >
          <span>Custom workout</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Goals Section */}
        <div className="mt-8 bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">Get a Strength Goal</h3>
              <p className="text-white/80 text-sm">Complete 2 Gym workouts</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;