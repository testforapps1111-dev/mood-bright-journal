export const DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export type Day = (typeof DAYS)[number];

export const MESSAGES: Record<Day, Record<number, { heading: string; body: string }>> = {
    Monday: {
        5: { heading: "Unstoppable Monday Energy! 🚀", body: "Starting the week with a 'Great' mood is a superpower. You've set an incredible tone that will ripple through your entire week. Use this momentum to tackle your biggest goals today!" },
        4: { heading: "Steady and Strong Monday! ☀️", body: "You're starting the week on a 'Good' note. That's a solid foundation. Keep this positive momentum going as you navigate your Monday tasks." },
        3: { heading: "Finding Your Monday Flow 🌊", body: "An 'Okay' Monday is a win. You're showing up and easing into the week. Give yourself grace as you find your rhythm today." },
        2: { heading: "Gently Navigating Monday ☁️", body: "Feeling a bit 'Low' on a Monday is completely understandable. The start of the week can be heavy. Take things one step at a time today." },
        1: { heading: "Be Extra Kind Today 🤍", body: "Struggling on a Monday is tough. Please remember you don't have to carry it all. Be gentle with yourself and know that showing up today is enough." },
    },
    Tuesday: {
        5: { heading: "Tuesday Triumph! ✨", body: "You're absolutely thriving today! Carrying that 'Great' energy into Tuesday means you're building real momentum. Keep shining!" },
        4: { heading: "Tuesday's Looking Bright 🌤️", body: "A 'Good' mood today is a gift. You're past the Monday hump and maintaining a positive outlook. Enjoy this steady energy!" },
        3: { heading: "Tuesday Tranquility 🍃", body: "An 'Okay' Tuesday is perfectly fine. You're keeping a steady pace. Take a moment to appreciate the small wins today." },
        2: { heading: "Patience with Yourself today 🌿", body: "If Tuesday feels a bit 'Low', remember that progress isn't always linear. Listen to what your body and mind need right now." },
        1: { heading: "Sending You Strength 🫂", body: "Struggling on a Tuesday can feel isolating, but you're not alone. Reach out if you need to, and prioritize your peace above all else today." },
    },
    Wednesday: {
        5: { heading: "Midweek Masterclass! 🏅", body: "Halfway through the week and feeling 'Great'! You're crushing it. Use this mid-week peak to do something that makes you truly happy." },
        4: { heading: "Hump Day Happiness 🐫", body: "You've made it to Wednesday with a 'Good' vibe. The weekend is coming into view! Keep that positive spirit as you cross the midweek line." },
        3: { heading: "Midweek Balance ⚖️", body: "An 'Okay' Wednesday is a steady anchor. You're balanced and moving forward. Take a deep breath — you're halfway there." },
        2: { heading: "Midweek Softness ☁️", body: "If Wednesday feels 'Low', try to find one tiny thing to look forward to this evening. You've worked hard this week; it's okay to feel tired." },
        1: { heading: "You're Not Alone Today 💜", body: "Struggling in the middle of the week is hard. Give yourself permission to slow down. The weekend will be here before you know it." },
    },
    Thursday: {
        5: { heading: "Thursday Thrill! 🎡", body: "Feeling 'Great' with the weekend so close? That's the best! Finish your week strong with this incredible burst of energy." },
        4: { heading: "Almost There, Thursday! 🌅", body: "A 'Good' Thursday sets you up for a fantastic weekend. You can feel the finish line! Keep that smile going through today's finish." },
        3: { heading: "Steady into Thursday 🕰️", body: "An 'Okay' Thursday is a job well done. You've put in the work all week. Just a little further to go — keep that steady pace." },
        2: { heading: "Thursday Reflection 🍂", body: "If you're feeling 'Low' today, look back at how much you've already accomplished this week. You've come so far; it's okay to be weary." },
        1: { heading: "Gentle Thursday Hug 🧸", body: "Struggling on a Thursday is a sign the week has been long. Be your own best friend today. You're almost at the weekend finish line." },
    },
    Friday: {
        5: { heading: "Fantastic Friday! 🥳", body: "Closing the week in a 'Great' mood — what a victory! You've earned this joy. Let the weekend celebrations begin with this spark!" },
        4: { heading: "Friday Feeling Good! 🎊", body: "A 'Good' Friday is the perfect bridge to the weekend. You've navigated the week successfully. Enjoy the transition into your time." },
        3: { heading: "Friday Ease 😌", body: "An 'Okay' Friday means you've made it through. The pressure is lifting. Take tonight to unwind and let go of the week's stress." },
        2: { heading: "Friday Release 🌊", body: "If Friday feels 'Low', let yourself sink into rest tonight. You've carried a lot this week. It's time to put the heavy things down." },
        1: { heading: "Healing Friday Energy ✨", body: "Struggling as the week ends is a lot to handle. Be proud of yourself for making it to Friday. This weekend is for your recovery." },
    },
    Saturday: {
        5: { heading: "Saturday Splendor! 🌈", body: "A 'Great' Saturday is pure magic. This is your time to shine and enjoy the freedom of the weekend. Make some beautiful memories today!" },
        4: { heading: "Serene Saturday 🏖️", body: "Feeling 'Good' on your day off is a blessing. Whether you're active or resting, enjoy every moment of this positive weekend vibe." },
        3: { heading: "Simple Saturday 🍵", body: "An 'Okay' Saturday is a peaceful plateau. No rush, no pressure. Just existing is enough today. Enjoy the quiet moments." },
        2: { heading: "Saturday Softness 💤", body: "If Saturday feels 'Low', don't feel pressured to 'do the weekend'. If you need to stay in and rest, that is a perfectly valid choice." },
        1: { heading: "Comforting Saturday 🕯️", body: "Struggling on a weekend can feel extra hard. Please be gentle with your heart today. There's no right way to feel, even on a Saturday." },
    },
    Sunday: {
        5: { heading: "Sunday Sunshine! 🌻", body: "A 'Great' Sunday is the ultimate recharge. You're heading into next week with a full heart. Savor this beautiful energy today!" },
        4: { heading: "Gentle Sunday Vibes 🕊️", body: "Feeling 'Good' today sets a peaceful tone for the week ahead. Enjoy the last bit of the weekend with a grateful heart." },
        3: { heading: "Sunday Settling 🍂", body: "An 'Okay' Sunday is a perfect time for reflection and prep. You're steady and ready for whatever comes next. Stay grounded." },
        2: { heading: "Sunday Scaries, Begone 🌙", body: "If Sunday feels 'Low', try to focus on the present moment rather than tomorrow's work. You are safe and supported right now." },
        1: { heading: "Sunday Self-Care 💖", body: "Struggling on a Sunday is more common than you think. Treat yourself with extreme tenderness today. You are worth the extra care." },
    },
};
