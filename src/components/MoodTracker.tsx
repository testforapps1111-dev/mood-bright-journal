import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

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
    5: { heading: "What a way to start the week! 🎉", body: "Your energy is contagious — carry this spark through the whole week! Starting Monday on a high like this means you're setting the tone for an incredible week ahead. Use this momentum to tackle something you've been putting off — you'll surprise yourself with what you can accomplish. Remember, a great Monday ripples into every day that follows." },
    4: { heading: "Monday's looking bright! ☀️", body: "A good mood on Monday? You're already ahead of most people. Keep it rolling! There's something special about starting the week with a smile — it means you're ready for whatever comes your way. Take this positive energy and channel it into something meaningful today. You've got the perfect foundation to build an awesome week." },
    3: { heading: "Easing into the week 🌿", body: "Mondays can be slow — and that's perfectly fine. Give yourself grace today. Not every week needs to start with a bang; sometimes a gentle beginning is exactly what you need. Take things at your own pace, check in with yourself throughout the day, and remember that 'okay' is a perfectly valid way to feel. You're showing up, and that matters." },
    2: { heading: "Monday blues, we see you 💙", body: "It's okay to feel this way. Take it one hour at a time — you've got this. The start of a new week can feel overwhelming, especially when your heart feels heavy. Be intentional about doing one small thing that brings you comfort today — a warm drink, a favorite song, a short walk. You don't have to conquer the world today; just getting through is enough." },
    1: { heading: "Hang in there, friend 🤗", body: "Mondays are tough. Be extra kind to yourself today — you deserve it. When the week feels like a mountain before it's even begun, remember that you don't have to climb it all at once. It's okay to ask for help, to take breaks, and to lower your expectations for today. Your feelings are valid, and brighter days are ahead — even if they don't feel close right now." },
  },
  Tuesday: {
    5: { heading: "Tuesday's treating you well! ✨", body: "You're radiating joy — let it flow into everything you do today! Carrying great energy into Tuesday means you're building real momentum this week. Share your positivity with someone who might need it — a kind word or a smile can change someone's entire day. You're proof that happiness isn't just for weekends." },
    4: { heading: "Cruising through Tuesday! 🚀", body: "Feeling good mid-week is a gift. Enjoy the momentum! You've made it past Monday and you're still going strong — that's something to celebrate. Use this energy to dive into a project you care about or connect with someone who makes you happy. Days like today are the ones that make a week truly great." },
    3: { heading: "A steady Tuesday 🍃", body: "Not every day needs fireworks. A calm Tuesday is a good Tuesday. There's beauty in the ordinary — in the routine, the familiar, the predictable. Sometimes the most peaceful days are the ones where nothing extraordinary happens but everything feels manageable. Embrace the calm and let it recharge you for the rest of the week." },
    2: { heading: "Feeling a bit off today? 🌧️", body: "That's okay — tomorrow is a fresh start. Do something small that brings comfort. When Tuesday feels like it's dragging, try to identify one thing that's weighing on you and give yourself permission to set it aside, even just for a few hours. Nurture yourself with something gentle — a favorite snack, a calming playlist, or even just a few minutes of quiet. You're doing better than you think." },
    1: { heading: "Sending you warmth 💛", body: "Tough days happen. Remember, it's okay to reach out and lean on someone. Struggling on a Tuesday can feel isolating because it seems like the world is moving on without you. But please know that your pain is real and it matters. Consider talking to someone you trust, writing down your feelings, or simply allowing yourself to rest without guilt. You are not alone in this." },
  },
  Wednesday: {
    5: { heading: "Hump day hero! 🦸", body: "You're halfway through the week and thriving — absolutely unstoppable! Getting to Wednesday feeling this good is a superpower. You've conquered the hardest part of the week with a smile on your face. Use this peak energy to do something bold — start that project, have that conversation, or simply enjoy the feeling of being alive and happy." },
    4: { heading: "Wednesday vibes are good! 🎶", body: "The week's middle point and you're feeling solid. Love that for you! Being in a good headspace on hump day means you're navigating life beautifully. Take a moment to appreciate how far you've come this week and give yourself credit for showing up every single day. The downhill slide to the weekend starts now!" },
    3: { heading: "Midweek check-in 🧘", body: "You're holding steady. Sometimes okay is more than enough. Wednesday can feel like a plateau — you're not at the start anymore, but the weekend still feels far away. That's a perfectly normal place to be. Use this time to pause, breathe, and recalibrate. You don't need to push harder; you just need to keep going at your own pace." },
    2: { heading: "Midweek can be heavy 🌫️", body: "You're halfway there. Take a deep breath — the weekend is getting closer. When the middle of the week feels like wading through fog, remember that every step forward still counts, even the small ones. Try to find one tiny bright spot in your day — it could be a sunset, a good meal, or a message from a friend. These little lights add up." },
    1: { heading: "We're here for you 🫂", body: "Struggling mid-week is hard. Please be gentle with yourself today. When Wednesday feels unbearable, it's okay to admit that you're not okay. You don't have to pretend or power through. Give yourself permission to feel what you're feeling, and know that reaching out for support is a sign of strength, not weakness. You matter, and this feeling won't last forever." },
  },
  Thursday: {
    5: { heading: "Almost-Friday energy! 🔥", body: "Your positivity is lighting up the room. Keep shining bright! Thursday with great vibes means you're riding a wave of pure momentum. The weekend is practically knocking on your door, and you're greeting it with open arms. Use this incredible energy to finish strong — wrap up tasks, make plans, and let your enthusiasm inspire everyone around you." },
    4: { heading: "Thursday's looking up! 🌤️", body: "Good vibes flowing — the weekend is almost within reach! Feeling good on Thursday is like catching a second wind right when you need it most. You've been showing up all week, and it's paying off. Take a moment to plan something fun for the weekend — having something to look forward to makes these final days even sweeter." },
    3: { heading: "Coasting into Thursday ⛵", body: "You're doing just fine. One more day and the weekend awaits. Thursday can feel like the quiet before the weekend storm, and that's a perfectly comfortable place to be. You don't need to sprint to the finish line; a gentle coast works just as well. Give yourself permission to take it easy and save your energy for the things that truly matter to you." },
    2: { heading: "Feeling the weight today? 🍂", body: "The week can wear you down. Rest if you need to — you've earned it. By Thursday, the accumulated weight of the week can feel like carrying stones in your pockets. It's okay to feel tired, overwhelmed, or just plain done. Lighten your load however you can — cancel what's not essential, lean on someone, or simply allow yourself to do the bare minimum. That's enough." },
    1: { heading: "Tomorrow's a new day 🌅", body: "Hold on — you're so close to the weekend. Every small step counts. When Thursday feels like the hardest day of the week, remind yourself of how far you've already come. You've pushed through Monday, Tuesday, and Wednesday — that takes real strength. Just one more day and you can breathe. Be proud of yourself for making it this far, even when everything feels difficult." },
  },
  Friday: {
    5: { heading: "Friday feels amazing! 🥳", body: "You made it through the week on a high note — celebrate yourself! There's no feeling quite like a happy Friday — the world feels lighter, possibilities feel endless, and the weekend stretches out before you like a gift. You earned every bit of this joy by showing up all week long. Go do something that makes your soul sing tonight!" },
    4: { heading: "TGIF and feeling fine! 🎊", body: "Good mood + Friday = the perfect combo. Enjoy every moment! You've navigated another whole week and you're still standing — still smiling, even. That's worth celebrating in whatever way feels right to you. Whether it's a cozy night in or an adventure out, make tonight count. You deserve to end this week on a beautiful note." },
    3: { heading: "Friday, finally 😌", body: "The week's done. Time to unwind and recharge at your own pace. Getting to Friday feeling okay is honestly an achievement in itself — the week asked a lot of you, and you delivered. Now it's your turn to ask something of the weekend: rest, fun, connection, or maybe just sweet, sweet nothing. Whatever you choose, make it yours." },
    2: { heading: "Rough week, huh? 🫶", body: "You survived it though. Give yourself credit and rest well this weekend. It takes real courage to keep going when every day feels like a struggle, and you did exactly that. The weekend is your time to decompress, to let go of what was heavy, and to refill your cup. Be intentional about rest — you've more than earned it." },
    1: { heading: "The weekend will heal 💜", body: "You pushed through a hard week. Take all the time you need to recover. Making it to Friday when every day felt impossible is proof of how strong you really are, even if you don't feel strong right now. Let the weekend wrap around you like a warm blanket. Sleep in, cry if you need to, reach out to someone you love. Healing isn't linear, but rest always helps." },
  },
  Saturday: {
    5: { heading: "Weekend magic! 🪄", body: "Feeling great on a Saturday — this is what life's about. Savor every second! Saturday happiness hits different — there's no alarm clock guilt, no meeting dread, just pure freedom to be yourself. Whether you're out exploring or lounging at home, let this feeling sink deep into your bones. These are the moments you'll look back on and smile about." },
    4: { heading: "Saturday smiles! 😄", body: "A lovely day to enjoy the little things. What's making you happy today? Good Saturday vibes are like sunshine for the soul — warm, bright, and full of possibility. Take this energy and pour it into something you love: a hobby, a friend, an adventure, or simply the pleasure of doing absolutely nothing with a smile on your face." },
    3: { heading: "Chill Saturday mode 🛋️", body: "Not every weekend needs to be epic. Sometimes rest is the best adventure. If your Saturday feels quiet and uneventful, that might be exactly what your mind and body are asking for. There's no rule that says weekends have to be packed with plans. The art of doing nothing is seriously underrated — embrace it fully and let yourself recharge." },
    2: { heading: "Taking it slow today? 🌙", body: "Weekends can feel lonely or heavy. Do one small thing that brings you joy. When Saturday doesn't feel like the escape you hoped for, it's okay to feel disappointed. Try shifting the pressure off yourself by setting just one tiny intention — watch something funny, step outside for fresh air, or text a friend. Small moments of light can brighten even the heaviest days." },
    1: { heading: "Wrapping you in comfort 🧸", body: "Even weekends can be hard. You're not alone — take it moment by moment. The expectation to be happy on weekends can make struggling feel even worse. Please know that it's completely okay to not be okay, no matter what day it is. Surround yourself with whatever brings comfort — blankets, music, a pet, or just the quiet reassurance that this too shall pass." },
  },
  Sunday: {
    5: { heading: "Sunday bliss! 🌻", body: "What a beautiful way to close the week. Carry this joy into Monday! A happy Sunday is the best possible gift to your future self — it means you're heading into a new week feeling refreshed, grateful, and ready. Soak in this feeling, write it down if you can, and remember it on the days that feel harder. You created this happiness, and you can create it again." },
    4: { heading: "Peaceful Sunday! 🕊️", body: "Feeling good before a new week — you're setting yourself up for success! There's something deeply reassuring about ending the weekend on a positive note. It means you've rested well, you've recharged, and you're ready for whatever Monday brings. Take a few minutes tonight to set an intention for the week — you'll thank yourself later." },
    3: { heading: "Easy Sunday 🍵", body: "A calm Sunday is a gift. Rest, recharge, and prepare for what's ahead. Sundays have a rhythm of their own — slower, quieter, sometimes bittersweet. If you're feeling okay, that's a beautiful place to be. Use the remaining hours to do something gentle: prepare a nice meal, organize your space, or simply sit with your thoughts. Tomorrow will come, but right now is yours." },
    2: { heading: "Sunday scaries hitting? 😟", body: "The dread of a new week is real. Plan something small to look forward to. When Sunday evening anxiety creeps in, it can make the whole day feel tainted. Try to ground yourself in the present moment rather than spiraling into Monday's worries. Write down one thing — just one — that you can look forward to this week. Having that anchor can make all the difference." },
    1: { heading: "Be gentle with yourself 🌸", body: "Sundays can feel heavy. Tomorrow is a blank page — you get to write it. When the weight of a new week feels crushing before it even starts, remember that you've survived every single Monday before this one. You are stronger and more resilient than you give yourself credit for. Tonight, just focus on being here. Tomorrow can wait — right now, you deserve peace." },
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

        {/* CTA */}
        <div className="flex w-full max-w-xs justify-center pt-1">
          <button
            onClick={handleLog}
            disabled={selectedMood === null || selectedDay === null}
            className="rounded-full bg-primary px-10 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:opacity-35 disabled:shadow-none disabled:hover:scale-100"
          >
            Log Mood
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
