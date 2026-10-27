import { SiRoblox, SiUnity, SiUnrealengine } from "react-icons/si";

const icons = { unreal: SiUnrealengine, unity: SiUnity, roblox: SiRoblox };

// Accepts a key ("unreal") or an engine name ("Unreal Engine 5") and returns its icon, if any
export const engineIcon = (name = "") => {
  const key = name.toLowerCase();
  return icons[key] ?? Object.entries(icons).find(([id]) => key.includes(id))?.[1] ?? null;
};
