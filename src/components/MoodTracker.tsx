import { useState } from "react";
import { Check } from "lucide-react";

const MOODS = [
  { emoji: "😊", label: "Great", value: 5, colorVar: "--mood-great" },
  { emoji: "🙂", label: "Good", value: 4, colorVar: "--mood-good" },
  { emoji: "😐", label: "Okay", value: 3, colorVar: "--mood-okay" },
  { emoji: "😟", label: "Low", value: 2, colorVar: "--mood-low" },
  { emoji: "😢", label: "Struggling", value: 1, colorVar: "--mood-struggling" },
] as const;

type MoodEntry = {
  mood: number;
  label: string;
  note: string;
  date: string;
};

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [logged, setLogged] = useState(false);

  const selectedMoodData = MOODS.find((m) => m.value === selectedMood);

  const handleLog = () => {
    if (selectedMood === null) return;
    const entry: MoodEntry = {
      mood: selectedMood,
      label: selectedMoodData!.label,
      note,
      date: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("mood_logs") || "[]");
    existing.push(entry);
    localStorage.setItem("mood_logs", JSON.stringify(existing));
    setLogged(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote("");
    setLogged(false);
  };

  if (logged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center animate-[fade-in_0.4s_ease-out]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mood-great/20">
            <Check className="h-10 w-10 text-mood-great" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Mood Logged!</h1>
          <p className="text-lg text-muted-foreground">
            You're feeling <span className="font-bold text-foreground">{selectedMoodData?.label}</span> today.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Log Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">How are you feeling?</h1>
          <p className="mt-2 text-muted-foreground">Tap to select your mood</p>
        </div>

        {/* Mood Options */}
        <div className="flex w-full justify-center gap-3">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-200 ${
                  isSelected
                    ? "animate-bounce-select scale-110 shadow-lg"
                    : "hover:scale-105"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: `hsl(var(${mood.colorVar}) / 0.2)` }
                    : undefined
                }
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note Field */}
        <input
          type="text"
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full max-w-sm rounded-full border border-input bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />

        {/* CTAs */}
        <div className="flex w-full max-w-sm items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </button>
          <button
            onClick={handleLog}
            disabled={selectedMood === null}
            className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            Log Mood
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
