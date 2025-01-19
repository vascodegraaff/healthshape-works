import { useState } from "react";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exercises } from "@/data/exercises";
import { getExerciseImageUrl } from "@/lib/utils";

interface AddExerciseSheetProps {
  open: boolean;
  onClose: () => void;
  onAddExercise: (exerciseId: string) => void;
}

const AddExerciseSheet = ({ open, onClose, onAddExercise }: AddExerciseSheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(exercises.flatMap(e => e.primaryMuscles))).sort();

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.primaryMuscles.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>Add Exercise</SheetTitle>
          </SheetHeader>

          <div className="p-4 space-y-4">
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
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  className="w-full text-left"
                  onClick={() => {
                    onAddExercise(exercise.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10">
                    <img
                      src={getExerciseImageUrl(exercise.id)}
                      alt={exercise.name}
                      className="w-16 h-16 rounded-lg object-cover grayscale brightness-75"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {exercise.primaryMuscles.join(", ")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddExerciseSheet; 