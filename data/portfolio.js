// All portfolio content lives here — edit this file to update the site.
// Anything left empty ("" or []) is simply hidden on the page.

export const profile = {
  name: "Dinh Hieu Nguyen",
  shortName: "Dinh Hieu",
  initials: "DH",
  tabTitle: "Din Hiu", // browser tab title
  roles: ["Game Programmer", "Gameplay Developer"],
  tagline: "Game Programmer",
  intro:
    "I'm Hieu — a game programmer who turns ideas into gameplay, systems and interfaces that feel clean, responsive and fun to play. I've shipped features to live games with real players, and I care about the small details — game feel, polish and performance — that keep people coming back.",
  email: "hieunguyendinh2004@gmail.com",
  phone: "+84 905979036",
  location: "Da Nang, Viet Nam",
  birthday: "23 August 2004",
  cv: "/assets/CV.pdf",
  cvFileName: "NguyenDinhHieu_CV.pdf",
  avatar: "/assets/avatar.png",
  // Engines / main tools shown under the hero
  engines: ["Roblox Studio", "Unreal Engine 5", "Luau", "C++"],
  // The four "skills" in the Studio window hotbar
  hotbar: ["Luau", "C++", "Knit", "Roact"],
  // Short tags shown in About: what you focus on as a developer
  focus: ["Gameplay programming", "Game UI implementation", "Game systems", "LiveOps"],
  // Shown in the About info list
  certificates: [{ name: "English", value: "VSTEP B2" }],
};

// Add itch.io / YouTube / Roblox profile here if you have them, e.g. { name: "itch.io", href: "https://you.itch.io" }
export const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/dinh-hieu-nguy%E1%BB%85n-267383363/" },
  { name: "GitHub", href: "https://github.com/DinHill" },
];

export const navLinks = [
  { name: "Work", href: "#work" },
  { name: "Experience", href: "#experience" },
  { name: "Tech Stack", href: "#skills" },
  { name: "About", href: "#about" },
];

// Your real work goes here — copy the example for each project, newest first.
// kind:   "commercial" | "freelance" | "personal" | "game-jam" | "university"   (used for the filters)
// engine: "Roblox" | "Unity" | "Unreal Engine" | ...              (used for the filters)
// Only `title`, `kind`, `engine` and `hook` are required; everything else is optional.
// Images go in /public/assets/projects/. `video` can be a YouTube link.
export const projects = [
  {
    title: "99 Waves in Bermuda",
    kind: "commercial",
    engine: "Roblox",
    year: "2026",
    genre: "Survival",
    status: "Beta",
    hook: "Stranded on a monster island. Build your defenses before nightfall — and survive all 99 waves.",
    context:
      "A multiplayer Roblox survival game where players gather resources, build defenses and hold off waves of sea monsters every night.",
    role: "Gameplay & UI programmer",
    involvement: "215 commits · 05/2026 – 08/2026",
    contributions: [
      {
        title: "Core game systems",
        text: "Built chests and loot rolls (including mimic and ultimate chests), a class gacha with pity and a slot-machine reveal, pets, cooking and food, achievements and daily login rewards.",
      },
      {
        title: "Combat & defenses",
        text: "Added weapons, defensive builds like turrets, poison plants and walls, enemy AI behaviours, a boss encounter and miniboss weapon drops.",
      },
      {
        title: "Onboarding",
        text: "Built the first-time tutorial with saved progress and funnel analytics, plus in-game and lobby loading screens with tips.",
      },
      {
        title: "UI",
        text: "HUD, custom inventory and hotbar, class and upgrade panels, gem shop, matchmaking, and victory, defeat and revive screens — built with Roact and Rodux and scaled for mobile.",
      },
      {
        title: "Multiplayer & reliability",
        text: "Team revive and wipe flow, network optimisations that send effects only to nearby players and replicate less data, server-side validation, and a role-gated debug panel for the team.",
      },
    ],
    tech: ["Luau", "Roblox Studio", "Rojo", "Knit", "Roact", "Rodux"],
    image: "/assets/projects/99-waves-in-bermuda.png",
    links: { play: "https://www.roblox.com/games/81629228238850/99-WAVES-IN-BERMUDA" },
    accent: "#38e2c8",
  },
  {
    title: "Animal Petting",
    kind: "commercial",
    engine: "Roblox",
    year: "2026",
    genre: "Incremental",
    hook: "Befriend 40+ adorable animals across new worlds — from tiny chicks to a massive T-Rex.",
    context:
      "A cozy Roblox incremental game where players earn the trust of animals, train, and travel to new worlds to collect more pets.",
    role: "Gameplay & UI programmer",
    involvement: "64 commits · 03/2026 – 04/2026",
    contributions: [
      {
        title: "HUD & UI",
        text: "HUD and danger overlay, stat displays, shop tabs, crown shop, settings and keybinding screens, and purchase boards across every world.",
      },
      {
        title: "Gameplay",
        text: "Taming flow and visuals, pet taming saved to a live Pet Index, rank and evolution with auto rebirth, and teleporting between worlds.",
      },
      {
        title: "Monetisation & social",
        text: "Starter pack popup, potion purchases (x1 / x10) and an invite-friends training buff.",
      },
      {
        title: "Polish",
        text: "Sound effects, reward and damage-popup animations, and a smoother tutorial reward flow.",
      },
    ],
    tech: ["Luau", "Roblox Studio", "Rojo"],
    image: "/assets/projects/animal-petting.png",
    links: { play: "https://www.roblox.com/games/84694535095284/Animal-Petting" },
    accent: "#a6e85f",
  },
  {
    title: "Villains Card Collection",
    kind: "commercial",
    engine: "Roblox",
    year: "2026",
    genre: "Collection",
    hook: "Break the vault and collect the multiverse's most wanted villains — from street thugs to Mythic world-enders.",
    context:
      "A Roblox card collection game where players open the vault, hunt rare villains and upgrade their gallery for bigger rewards.",
    role: "Gameplay & UI programmer",
    involvement: "41 commits · 01/2026 – 03/2026",
    contributions: [
      {
        title: "Starter pack & A/B testing",
        text: "Built the starter pack popup and ran it as an A/B test driven by remote config, with responsive UI and an animated reward reveal.",
      },
      {
        title: "Live balancing",
        text: "Connected card-pack weights to Roblox remote config so the game can be rebalanced without a new release, and rebalanced packs and income rates.",
      },
      {
        title: "Rewards & UI",
        text: "Integrated the reward system with notification badges, timed and daily rewards, an egg-opening animation and purchase sound feedback.",
      },
      {
        title: "Analytics & stability",
        text: "Added funnel analytics for onboarding, player validation to stop a large class of runtime errors, and fixes to friend invites.",
      },
    ],
    tech: ["Luau", "Roblox Studio", "Rojo", "Knit"],
    image: "/assets/projects/villains-card-collection.png",
    links: { play: "https://www.roblox.com/games/139858102696806/Villains-Card-Collection" },
    accent: "#ff6b9d",
  },
  {
    title: "Dungeons Incremental 2",
    kind: "commercial",
    engine: "Roblox",
    year: "2025–2026",
    genre: "Incremental",
    hook: "Defeat mobs and bosses, unlock powerful swords and upgrades, and cleanse the Everless Realm.",
    context:
      "A live Roblox incremental RPG with regular content updates such as seasonal events and a sword shop.",
    role: "UI, VFX & gameplay programmer",
    contributions: [
      {
        title: "UI",
        text: "Implemented and updated in-game UI for new features and content updates.",
      },
      {
        title: "Training system",
        text: "Built the training system, one of the game's core progression features.",
      },
      {
        title: "VFX",
        text: "Created and integrated visual effects that give players clear, satisfying feedback in-game.",
      },
      {
        title: "LiveOps",
        text: "Delivered updates and fixes to the live game, keeping it fresh for its active player base.",
      },
    ],
    tech: ["Luau", "Roblox Studio"],
    image: "/assets/projects/dungeons-incremental-2.png",
    links: { play: "https://www.roblox.com/games/78148006177939/Dungeons-Incremental-2" },
    accent: "#5ec8ff",
  },
  {
    title: "Undisclosed Game Project",
    kind: "freelance",
    engine: "Unreal Engine 5",
    year: "2024",
    confidential: true, // no screenshots or links; shows the confidentiality notice
    hook: "A professional Unreal Engine 5 game project, where I worked on pipeline tools and gameplay code.",
    role: "Game Developer Intern",
    context: "I joined an Unreal Engine 5 game project as a freelance intern, working remotely.",
    contributions: [
      {
        title: "Pipeline tools",
        text: "Assisted in developing internal tools to support the game production pipeline.",
      },
      {
        title: "Gameplay programming",
        text: "Worked with Python and C++ on minor gameplay programming tasks.",
      },
      {
        title: "Professional experience",
        text: "Gained hands-on experience working in a professional game development environment.",
      },
    ],
    tech: ["Unreal Engine 5", "C++", "Python"],
    accent: "#c3cadb",
  },
  // {
  //   title: "Game name",
  //   kind: "commercial",
  //   engine: "Roblox",
  //   company: "",                  // optional studio name
  //   year: "2026",
  //   teamSize: 3,
  //   genre: "Simulator",
  //   status: "",                       // e.g. "In development"
  //   hook: "One catchy line about the game.",
  //   role: "Gameplay programmer",
  //   context: "What the project is and where it was made.",
  //   contributions: [                // plain strings, or { title, text } pairs
  //     "What you built, e.g. the trading system in Luau.",
  //     "Another concrete thing you did.",
  //   ],
  //   tech: ["Luau", "Roblox Studio"],
  //   image: "/assets/projects/game.png",
  //   links: {
  //     play: "https://www.roblox.com/games/...",
  //     video: "https://www.youtube.com/watch?v=...",
  //     github: "",
  //   },
  //   accent: "#8b7bff",
  // },
];

// Roles are listed newest first. `end: null` means "Present".
// logo: image path for the badge; logoIcon: "unreal" | "unity" | "roblox" uses the engine mark instead.
// highlights: the main areas of your work in that role, e.g. { title: "Gameplay", text: "Built ... in Luau." }
// projects:   titles from `projects` above that you worked on in that role (they link to the case study)
export const experience = [
  {
    company: "Roblox Game Studio",
    logo: "/assets/logos/rivrs.png",
    subtitle: "Live Roblox games",
    roles: [
      {
        title: "Game Programmer",
        start: "04/2026",
        end: null,
        summary: "Develop and maintain live Roblox games in Luau — from UI and gameplay features to LiveOps updates.",
        highlights: [
          {
            title: "Gameplay & UI development",
            text: "Implement game UI and new features in Luau, including trading, multiplayer systems and core gameplay loops.",
          },
          {
            title: "Release & LiveOps",
            text: "Ship features, maps and fixes to live games, testing each update in a separate development place before it goes to production.",
          },
          {
            title: "AI-assisted workflow",
            text: "Use Claude for implementation support, code review and debugging, then playtest in Roblox Studio. Work in English with international teammates.",
          },
        ],
        tools: ["Roblox Studio", "Luau", "Claude"],
        projects: ["99 Waves in Bermuda", "Animal Petting", "Dungeons Incremental 2"],
      },
      {
        title: "Game Programmer Intern",
        start: "11/2025",
        end: "03/2026",
        summary: "Joined the team as an intern programming Roblox games, then moved into a full role.",
        highlights: [],
        tools: ["Roblox Studio", "Luau"],
        projects: ["Villains Card Collection", "Animal Petting"],
      },
    ],
  },
  {
    company: "Undisclosed Game Project",
    subtitle: "Freelance · Remote",
    logoIcon: "unreal",
    roles: [
      {
        title: "Game Developer Intern",
        start: "07/2024",
        end: "10/2024",
        summary: "Contributed to an Unreal Engine 5 game project as a freelance intern.",
        highlights: [
          { title: "Pipeline tools", text: "Assisted in developing internal tools to support the game production pipeline." },
          { title: "Gameplay programming", text: "Worked with Python and C++ on minor gameplay programming tasks." },
        ],
        tools: ["Unreal Engine 5", "C++", "Python"],
        projects: ["Undisclosed Game Project"],
        confidential: true,
      },
    ],
  },
];

// summary, highlights and coursework are optional
export const education = [
  {
    school: "University of Greenwich",
    subtitle: "Alliance with FPT Education",
    logo: "/assets/logos/greenwich.png",
    logoTone: "light", // dark logo, so it sits on a white tile
    degree: "Bachelor of Science – Information Technology",
    years: "08/2022 – 08/2026",
    summary: "Built a solid software foundation alongside my game work — the problem solving, code structure and teamwork I now use every day.",
    highlights: [
      { title: "Programming & OOP", text: "Object-oriented programming in Java and C#, from a console app to a desktop information system." },
      { title: "Web & databases", text: "Full-stack web development with SQL and NoSQL databases." },
      { title: "UI/UX design", text: "Designing and prototyping app interfaces in Axure RP." },
    ],
    coursework: ["London Zoo CMS", "BookStore App", "Task Manager", "Desktop Information System", "Motor Riding App"],
  },
];

// Tech stack, grouped by what each set of tools is used for.
export const skillGroups = [
  {
    name: "Engines",
    summary: "Where I build, test and ship games.",
    color: "#ffb457",
    items: ["Roblox Studio", "Unreal Engine 5"],
  },
  {
    name: "Languages",
    summary: "Luau day to day, plus C++ and Python from Unreal Engine work.",
    color: "#8b7bff",
    items: ["Luau", "C++", "Python"],
  },
  {
    name: "Roblox frameworks",
    summary: "For structuring game services and building reactive UI.",
    color: "#38e2c8",
    items: ["Knit", "Roact", "Rodux"],
  },
  {
    name: "Workflow & tools",
    summary: "How I sync, version, review and ship code with a team.",
    color: "#5ec8ff",
    items: ["Rojo", "Wally", "Git", "Claude"],
  },
];

export const marquee = [
  "Gameplay Programming",
  "Game Systems",
  "UI Implementation",
  "LiveOps",
  "Luau",
  "Roblox Studio",
  "Unreal Engine 5",
  "C++",
  "Problem Solving",
  "Team Player",
];

// Labels for project `kind` values
export const projectKinds = {
  commercial: "Commercial",
  freelance: "Freelance",
  personal: "Personal",
  "game-jam": "Game jam",
  university: "University",
};
