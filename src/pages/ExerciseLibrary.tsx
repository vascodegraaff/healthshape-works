import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { getExerciseImageUrl } from "@/lib/utils";
import { exercises, exerciseCategories, equipmentTypes, levels, Exercise } from "@/data/exercises";

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
    case 'intermediate':
      return 'bg-amber-950 text-amber-400 border border-amber-800';
    case 'advanced':
      return 'bg-rose-950 text-rose-400 border border-rose-800';
    default:
      return 'bg-accent/10 text-accent border border-accent/20';
  }
};

const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.primaryMuscles.includes(selectedCategory);
    const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;
    const matchesLevel = !selectedLevel || exercise.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesEquipment && matchesLevel;
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="container px-4 py-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Exercise Library</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search exercises..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {exerciseCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-card hover:bg-card/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="p-3 hover:bg-card/80 transition-colors border-border/5 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getExerciseImageUrl(exercise.id)}
                  alt={exercise.name}
                  className="w-16 h-16 rounded-lg object-cover grayscale brightness-75"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold tracking-tight truncate">
                      {exercise.name}
                    </h3>
                  </div>

                  <div className="text-sm text-muted-foreground mb-1.5 truncate">
                    {exercise.primaryMuscles.join(", ")}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {exercise.equipment && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {exercise.equipment}
                      </span>
                    )}
                    {exercise.mechanic && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {exercise.mechanic}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ExerciseLibrary; 