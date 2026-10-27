// Blocky game-character head-and-shoulders, used as the HUD portrait
const BlockAvatar = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* torso */}
      <rect x="5" y="25" width="24" height="12" rx="2" fill="#5ec8ff" />
      <rect x="15" y="25" width="4" height="9" fill="#2a2366" />
      {/* neck shadow + head */}
      <rect x="12" y="22" width="10" height="4" fill="#d9a43a" />
      <rect x="8" y="5" width="18" height="18" rx="3.5" fill="#ffc94d" />
      <rect x="8" y="17" width="18" height="6" rx="3" fill="#f2b632" opacity="0.55" />
      {/* hair */}
      <path d="M8 9.5C8 6.5 10.5 4 13.5 4h7c3 0 5.5 2.5 5.5 5.5V10h-3l-1.5-2.5L19 10H8V9.5Z" fill="#1d1a2e" />
      {/* face */}
      <rect x="12" y="12.2" width="2.4" height="3.4" rx="1.2" fill="#1d1a2e" />
      <rect x="19.6" y="12.2" width="2.4" height="3.4" rx="1.2" fill="#1d1a2e" />
      <path d="M13.2 18.2c1 1.5 2.3 2.2 3.8 2.2s2.8-.7 3.8-2.2" stroke="#1d1a2e" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export default BlockAvatar;
