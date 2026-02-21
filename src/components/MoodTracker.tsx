import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

const MOODS = [
  { emoji: "😊", label: "Great", value: 5, colorVar: "--mood-great" },
  { emoji: "🙂", label: "Good", value: 4, colorVar: "--mood-good" },
  { emoji: "😐", label: "Okay", value: 3, colorVar: "--mood-okay" },
  { emoji: "😟", label: "Low", value: 2, colorVar: "--mood-low" },
  { emoji: "😢", label: "Struggling", value: 1, colorVar: "--mood-struggling" },
] as const;

type Day = (typeof DAYS)[number];

const MESSAGES: Record<Day, Record<number, { heading: string; body: string }>> = {
  Monday: {
    5: { heading: "What a way to start the week! 🎉", body: "Your energy is contagious — carry this spark through the whole week!" },
    4: { heading: "Monday's looking bright! ☀️", body: "A good mood on Monday? You're already ahead of most people. Keep it rolling!" },
    3: { heading: "Easing into the week 🌿", body: "Mondays can be slow — and that's perfectly fine. Give yourself grace today." },
    2: { heading: "Monday blues, we see you 💙", body: "It's okay to feel this way. Take it one hour at a time — you've got this." },
    1: { heading: "Hang in there, friend 🤗", body: "Mondays are tough. Be extra kind to yourself today — you deserve it." },
  },
  Tuesday: {
    5: { heading: "Tuesday's treating you well! ✨", body: "You're radiating joy — let it flow into everything you do today!" },
    4: { heading: "Cruising through Tuesday! 🚀", body: "Feeling good mid-week is a gift. Enjoy the momentum!" },
    3: { heading: "A steady Tuesday 🍃", body: "Not every day needs fireworks. A calm Tuesday is a good Tuesday." },
    2: { heading: "Feeling a bit off today? 🌧️", body: "That's okay — tomorrow is a fresh start. Do something small that brings comfort." },
    1: { heading: "Sending you warmth 💛", body: "Tough days happen. Remember, it's okay to reach out and lean on someone." },
  },
  Wednesday: {
    5: { heading: "Hump day hero! 🦸", body: "You're halfway through the week and thriving — absolutely unstoppable!" },
    4: { heading: "Wednesday vibes are good! 🎶", body: "The week's middle point and you're feeling solid. Love that for you!" },
    3: { heading: "Midweek check-in 🧘", body: "You're holding steady. Sometimes okay is more than enough." },
    2: { heading: "Midweek can be heavy 🌫️", body: "You're halfway there. Take a deep breath — the weekend is getting closer." },
    1: { heading: "We're here for you 🫂", body: "Struggling mid-week is hard. Please be gentle with yourself today." },
  },
  Thursday: {
    5: { heading: "Almost-Friday energy! 🔥", body: "Your positivity is lighting up the room. Keep shining bright!" },
    4: { heading: "Thursday's looking up! 🌤️", body: "Good vibes flowing — the weekend is almost within reach!" },
    3: { heading: "Coasting into Thursday ⛵", body: "You're doing just fine. One more day and the weekend awaits." },
    2: { heading: "Feeling the weight today? 🍂", body: "The week can wear you down. Rest if you need to — you've earned it." },
    1: { heading: "Tomorrow's a new day 🌅", body: "Hold on — you're so close to the weekend. Every small step counts." },
  },
  Friday: {
    5: { heading: "Friday feels amazing! 🥳", body: "You made it through the week on a high note — celebrate yourself!" },
    4: { heading: "TGIF and feeling fine! 🎊", body: "Good mood + Friday = the perfect combo. Enjoy every moment!" },
    3: { heading: "Friday, finally 😌", body: "The week's done. Time to unwind and recharge at your own pace." },
    2: { heading: "Rough week, huh? 🫶", body: "You survived it though. Give yourself credit and rest well this weekend." },
    1: { heading: "The weekend will heal 💜", body: "You pushed through a hard week. Take all the time you need to recover." },
  },
  Saturday: {
    5: { heading: "Weekend magic! 🪄", body: "Feeling great on a Saturday — this is what life's about. Savor every second!" },
    4: { heading: "Saturday smiles! 😄", body: "A lovely day to enjoy the little things. What's making you happy today?" },
    3: { heading: "Chill Saturday mode 🛋️", body: "Not every weekend needs to be epic. Sometimes rest is the best adventure." },
    2: { heading: "Taking it slow today? 🌙", body: "Weekends can feel lonely or heavy. Do one small thing that brings you joy." },
    1: { heading: "Wrapping you in comfort 🧸", body: "Even weekends can be hard. You're not alone — take it moment by moment." },
  },
  Sunday: {
    5: { heading: "Sunday bliss! 🌻", body: "What a beautiful way to close the week. Carry this joy into Monday!" },
    4: { heading: "Peaceful Sunday! 🕊️", body: "Feeling good before a new week — you're setting yourself up for success!" },
    3: { heading: "Easy Sunday 🍵", body: "A calm Sunday is a gift. Rest, recharge, and prepare for what's ahead." },
    2: { heading: "Sunday scaries? 😟", body: "The dread of a new week is real. Plan something small to look forward to." },
    1: { heading: "Be gentle with yourself 🌸", body: "Sundays can feel heavy. Tomorrow is a blank page — you get to write it." },
  },
};

const MoodTracker = () => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [logged, setLogged] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMoodData = MOODS.find((m) => m.value === selectedMood);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLog = () => {
    if (selectedMood === null || !selectedDay) return;
    const entry = {
      mood: selectedMood,
      label: selectedMoodData!.label,
      day: selectedDay,
      note,
      date: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("mood_logs") || "[]");
    existing.push(entry);
    localStorage.setItem("mood_logs", JSON.stringify(existing));
    setLogged(true);
  };

  const handleReset = () => {
    setSelectedDay(null);
    setSelectedMood(null);
    setNote("");
    setLogged(false);
  };

  const personalMessage = selectedDay && selectedMood ? MESSAGES[selectedDay][selectedMood] : null;

  if (logged && personalMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="flex flex-col items-center gap-5 text-center max-w-sm"
          style={{ animation: "fade-up 0.5s ease-out" }}
        >
          <div className="animate-check-in flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
            <Check className="h-10 w-10 text-primary" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground leading-snug">
            {personalMessage.heading}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {personalMessage.body}
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-xl">{selectedMoodData?.emoji}</span>
            <span className="text-sm font-semibold text-secondary-foreground">
              {selectedMoodData?.label} · {selectedDay}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          >
            Log Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-7">
        {/* Floating emoji decoration */}
        <div className="animate-float text-5xl">🧠</div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            How are you feeling?
          </h1>
          <p className="mt-1.5 text-muted-foreground font-medium">
            Take a moment to check in with yourself
          </p>
        </div>

        {/* Day Dropdown */}
        <div ref={dropdownRef} className="relative w-full max-w-xs">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between rounded-2xl border border-input bg-card px-5 py-3.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <span className={selectedDay ? "text-foreground" : "text-muted-foreground"}>
              {selectedDay ? `📅 ${selectedDay}` : "What day is it?"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-input bg-card shadow-xl">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                    selectedDay === day
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mood Options */}
        <div className="flex w-full justify-center gap-2 sm:gap-3">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3 transition-all duration-300 ${
                  isSelected
                    ? "animate-bounce-select scale-110 shadow-lg"
                    : "hover:scale-105 hover:bg-secondary/60"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `hsl(var(${mood.colorVar}) / 0.18)`,
                        boxShadow: `0 8px 25px -5px hsl(var(${mood.colorVar}) / 0.3)`,
                      }
                    : undefined
                }
              >
                <span className={`text-3xl sm:text-4xl transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {mood.emoji}
                </span>
                <span
                  className={`text-[11px] font-bold tracking-wide ${
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
          placeholder="Add a note (optional) ✏️"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full max-w-xs rounded-2xl border border-input bg-card px-5 py-3.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:shadow-md"
        />

        {/* CTAs */}
        <div className="flex w-full max-w-xs items-center justify-between gap-4 pt-1">
          <button
            onClick={handleReset}
            className="rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
          >
            Skip
          </button>
          <button
            onClick={handleLog}
            disabled={selectedMood === null || selectedDay === null}
            className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:opacity-35 disabled:shadow-none disabled:hover:scale-100"
          >
            <Sparkles className="h-4 w-4" />
            Log Mood
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
