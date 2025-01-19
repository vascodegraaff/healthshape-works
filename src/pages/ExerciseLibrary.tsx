import { useState } from "react";
import { Search, X, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getExerciseImageUrl } from "@/lib/utils";
import { exercises, exerciseCategories, equipmentTypes, levels, Exercise } from "@/data/exercises";
import FormCheckCamera from "@/components/FormCheckCamera";

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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isFormCheckOpen, setIsFormCheckOpen] = useState(false);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.primaryMuscles.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-background z-10">
        <div className="container px-4 py-4 space-y-4">
          {/* Header */}
          <h1 className="text-2xl font-bold">Exercise Library</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search exercises..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
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
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="container px-4 pt-[168px] pb-20"> {/* Adjust pt value based on header height */}
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="p-3 hover:bg-card/80 transition-colors border-border/5 shadow-lg cursor-pointer"
              onClick={() => setSelectedExercise(exercise)}
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

      {/* Exercise Detail Sheet */}
      {selectedExercise && (
        <Sheet open={true} onOpenChange={() => setSelectedExercise(null)}>
          <SheetContent 
            side="bottom" 
            className="h-[95vh] p-0"
            hideCloseButton
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-border">
                <button 
                  onClick={() => setIsFormCheckOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">{selectedExercise.name}</h2>
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                <div className="p-4 space-y-4">
                  {/* Image */}
                  <img
                    src={getExerciseImageUrl(selectedExercise.id)}
                    alt={selectedExercise.name}
                    className="w-full aspect-video object-cover rounded-lg grayscale brightness-75"
                  />

                  {/* Muscle Groups */}
                  <div>
                    <h3 className="font-semibold mb-1">Target Muscles</h3>
                    <p className="text-muted-foreground">
                      {selectedExercise.primaryMuscles.join(", ")}
                    </p>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <ol className="space-y-2 text-muted-foreground">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-accent">{index + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.equipment && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {selectedExercise.equipment}
                      </span>
                    )}
                    {selectedExercise.mechanic && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {selectedExercise.mechanic}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(selectedExercise.level)}`}>
                      {selectedExercise.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Form Check Camera */}
      <FormCheckCamera 
        open={isFormCheckOpen}
        onOpenChange={setIsFormCheckOpen}
        exerciseName={selectedExercise?.name || ''}
      />

      <BottomNav />
    </div>
  );
};

export default ExerciseLibrary; 