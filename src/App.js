import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsNintendoSwitch } from 'react-icons/bs';
import Tetris from 'react-tetris';
import {
  FaNewspaper,
  FaShoppingBag,
  FaImages,
  FaWifi,
  FaPowerOff,
  FaBatteryThreeQuarters,
  FaGamepad,
  FaCog,
} from 'react-icons/fa';

// Default hover (Klick) sound
const HOVER_SOUND_URL = 'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/cvbstnhx/Klick.mp3';

// Icon click sounds
const ICON_CLICK_SOUNDS = [
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/ovvkjyda/Home.mp3', // Nintendo Online
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/gqsvtkbc/News.mp3', // News
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/kwjiznam/Eshop.mp3', // eShop
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/jnxuzlwb/Album.mp3', // Album
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/cusagemg/Controller.mp3', // Controllers
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/udkyavrh/Settings.mp3', // Settings
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/eqrizipe/Standby.mp3', // Power
];

const GAME_LAUNCH_SOUND_URL =
  'https://eta.vgmtreasurechest.com/soundtracks/nintendo-switch-sound-effects/dcxoadjr/Popup%20%2B%20Run%20Title.mp3';

const TETRIS_KEYBOARD_CONTROLS = {
  down: 'MOVE_DOWN',
  left: 'MOVE_LEFT',
  right: 'MOVE_RIGHT',
  space: 'HARD DROP',
  z: 'FLIP_COUNTERCLOCKWISE',
  x: 'FLIP_CLOCKWISE',
  up: 'FLIP_CLOCKWISE',
  p: 'TOGGLE_PAUSE',
  c: 'HOLD',
  shift: 'HOLD',
};

// Custom CSS styles for Tetris blocks
const customTetrisStyles = `
.game-block {
  margin: 0;
  padding: 0;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid #ddd;
}
.piece-i {
  background-color: #ec858b;
}
.piece-j {
  background-color: #f1b598;
}
.piece-l {
  background-color: #f8efae;
}
.piece-o {
  background-color: #b5a677;
}
.piece-s {
  background-color: #816e56;
}
.piece-t {
  background-color: #b77c72;
}
.piece-z {
  background-color: #e3be58;
}
.piece-preview {
  background-color: #eee;
}
`;

// Games array
const games = [
  {
    name: 'Super Smash Bros. Ultimate',
    image:
      'https://cdn2.steamgriddb.com/thumb/8d9ab8e22d8536b143157bd811dd7232.jpg',
  },
  {
    name: 'Tetris',
    image: 'https://m.media-amazon.com/images/I/61M3rDwh4qL.png',
  },
  {
    name: 'The Legend of Zelda: Breath of the Wild',
    image:
      'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/software/switch/70010000000025/desc/description-image',
  },
  {
    name: 'Super Mario Odyssey',
    image:
      'https://i.ytimg.com/vi/DrXZOiINIFw/maxresdefault.jpg',
  },
  {
    name: 'The Legend of Zelda: Tears of the Kingdom',
    image:
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c78bc3fc-9f08-47ca-81ae-d89055c7ec49/dgzjc79-1a4bcc5d-fd59-45b1-a2a6-9802aacf92bb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M3OGJjM2ZjLTlmMDgtNDdjYS04MWFlLWQ4OTA1NWM3ZWM0OVwvZGd6amM3OS0xYTRiY2M1ZC1mZDU5LTQ1YjEtYTJhNi05ODAyYWFjZjkyYmIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.SvkGGRJq-sR9T6UGmn4WDUTtwKPNJ6MmFN03YH_beIM',
  },
];

const bottomIcons = [
  { icon: <BsNintendoSwitch size={24} />, label: 'Nintendo Online', bg: 'bg-red-500' },
  { icon: <FaNewspaper size={24} />, label: 'News', bg: 'bg-gray-700' },
  { icon: <FaShoppingBag size={24} />, label: 'eShop', bg: 'bg-gray-700' },
  { icon: <FaImages size={24} />, label: 'Album', bg: 'bg-gray-700' },
  { icon: <FaGamepad size={24} />, label: 'Controllers', bg: 'bg-gray-700' },
  { icon: <FaCog size={24} />, label: 'Settings', bg: 'bg-gray-700' },
  { icon: <FaPowerOff size={24} />, label: 'Power', bg: 'bg-gray-700' },
];

function TetrisGame({ onExit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4">
      {/* Custom style block injected here */}
      <style>{customTetrisStyles}</style>

      <div className="bg-gray-900 w-full max-w-3xl rounded-xl overflow-hidden relative p-4">
        <button
          onClick={onExit}
          aria-label="Exit Tetris"
          className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
        >
          Exit
        </button>
        <Tetris keyboardControls={TETRIS_KEYBOARD_CONTROLS}>
          {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared, state, controller }) => (
            <div className="flex flex-col items-center">
              <h1 className="text-white mb-2">Tetris</h1>
              <div className="flex space-x-4 mb-4">
                <div className="text-white">
                  <p>Points: {points}</p>
                  <p>Lines Cleared: {linesCleared}</p>
                </div>
                <HeldPiece />
              </div>
              <Gameboard />
              {state === 'LOST' && (
                <div className="mt-4">
                  <h2 className="text-white text-xl mb-2">Game Over</h2>
                  <button
                    onClick={controller.restart}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    New game
                  </button>
                </div>
              )}
            </div>
          )}
        </Tetris>
      </div>
    </div>
  );
}

export default function NintendoSwitchHome() {
  const [focusedSection, setFocusedSection] = useState('games');
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);
  const containerRef = useRef(null);
  const [timeString, setTimeString] = useState('');
  const [battery, setBattery] = useState(77);
  const [userInteracted, setUserInteracted] = useState(false);
  const [launchingGame, setLaunchingGame] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(true);
  const [tetrisOpen, setTetrisOpen] = useState(false);

  const hoverAudioRef = useRef(null);
  const preloadedAudioRef = useRef([]);
  const gameLaunchAudioRef = useRef(null);

  const setupAudio = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    setShowHelpOverlay(false);

    hoverAudioRef.current = new Audio(HOVER_SOUND_URL);
    hoverAudioRef.current.volume = 0.5;

    gameLaunchAudioRef.current = new Audio(GAME_LAUNCH_SOUND_URL);
    gameLaunchAudioRef.current.volume = 0.6;

    preloadedAudioRef.current = ICON_CLICK_SOUNDS.map((soundUrl) => {
      const audioObj = new Audio(soundUrl);
      audioObj.volume = 0.5;
      return audioObj;
    });

    preloadedAudioRef.current.forEach((audio) => {
      const originalVolume = audio.volume;
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = originalVolume;
          }, 200);
        })
        .catch(() => {
          // blocked
        });
    });
  }, [userInteracted]);

  const handleFirstInteraction = useCallback(() => {
    setupAudio();
  }, [setupAudio]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const paddedMinutes = minutes.toString().padStart(2, '0');
      setTimeString(`${hours}:${paddedMinutes} ${ampm}`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery((prev) => Math.max(prev - 1, 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const playHoverSound = useCallback(() => {
    if (!userInteracted || !hoverAudioRef.current) return;
    hoverAudioRef.current.currentTime = 0;
    hoverAudioRef.current.play().catch((err) =>
      console.log('Hover sound error:', err)
    );
  }, [userInteracted]);

  const handleIconClick = useCallback(
    (idx) => {
      if (!userInteracted) return;
      const audio = preloadedAudioRef.current[idx];
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch((err) =>
        console.log('Icon sound error:', err)
      );
    },
    [userInteracted]
  );

  const launchGame = useCallback(
    (gameName) => {
      if (!userInteracted) return;
      if (gameName === 'Tetris') {
        setTetrisOpen(true);
        return;
      }
      if (gameLaunchAudioRef.current) {
        gameLaunchAudioRef.current.currentTime = 0;
        gameLaunchAudioRef.current.play().catch((err) =>
          console.log('Game launch sound error:', err)
        );
      }
      setLaunchingGame(true);
      setTimeout(() => setLaunchingGame(false), 2000);
    },
    [userInteracted]
  );

  const handleKeyDown = useCallback(
    (event) => {
      handleFirstInteraction();
      if (tetrisOpen) {
        return;
      }
      if (focusedSection === 'games') {
        if (event.key === 'ArrowRight') {
          setSelectedGameIndex((prev) => {
            playHoverSound();
            return (prev + 1) % games.length;
          });
        } else if (event.key === 'ArrowLeft') {
          setSelectedGameIndex((prev) => {
            playHoverSound();
            return (prev - 1 + games.length) % games.length;
          });
        } else if (event.key === 'ArrowDown') {
          setFocusedSection('icons');
          playHoverSound();
        } else if (event.key === 'Enter' || event.key === ' ') {
          launchGame(games[selectedGameIndex].name);
        }
      } else {
        if (event.key === 'ArrowRight') {
          setSelectedIconIndex((prev) => {
            playHoverSound();
            return (prev + 1) % bottomIcons.length;
          });
        } else if (event.key === 'ArrowLeft') {
          setSelectedIconIndex((prev) => {
            playHoverSound();
            return (prev - 1 + bottomIcons.length) % bottomIcons.length;
          });
        } else if (event.key === 'ArrowUp') {
          setFocusedSection('games');
          playHoverSound();
        } else if (event.key === 'Enter' || event.key === ' ') {
          handleIconClick(selectedIconIndex);
        }
      }
    },
    [
      focusedSection,
      handleFirstInteraction,
      playHoverSound,
      handleIconClick,
      selectedGameIndex,
      tetrisOpen,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('mousemove', handleFirstInteraction);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('mousemove', handleFirstInteraction);
    };
  }, [handleKeyDown, handleFirstInteraction]);

  useEffect(() => {
    if (containerRef.current && focusedSection === 'games') {
      const containerWidth = containerRef.current.offsetWidth;
      const gameWidth = 336; // 21rem * 16
      containerRef.current.scrollTo({
        left:
          selectedGameIndex * (gameWidth + 16) -
          containerWidth / 2 +
          gameWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [selectedGameIndex, focusedSection]);

  const isGameHighlighted = (idx) =>
    focusedSection === 'games' && selectedGameIndex === idx;
  const isIconHighlighted = (idx) =>
    focusedSection === 'icons' && selectedIconIndex === idx;

  return (
    <div
      className="w-screen h-screen bg-[#2d2d2d] text-white flex flex-col items-center justify-between py-2 sm:py-4 md:py-6 overflow-hidden"
      onMouseMove={handleFirstInteraction}
    >
      {tetrisOpen && <TetrisGame onExit={() => setTetrisOpen(false)} />}

      <AnimatePresence>
        {showHelpOverlay && !tetrisOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 p-3 rounded-md text-sm z-50"
          >
            <p className="text-white text-center">
              Use Arrow Keys to navigate.
              <br />
              Press Enter/Space to select or launch.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {launchingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 p-4 rounded-xl"
            >
              <p className="text-white text-lg">
                Launching {games[selectedGameIndex].name}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex justify-between px-4 sm:px-6 text-base font-light">
        <div className="flex items-center">
          <div className="w-1 bg-cyan-300 mr-3" />
          <div>{games[selectedGameIndex].name}</div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>{timeString}</span>
          <FaWifi size={14} />
          <FaBatteryThreeQuarters size={14} />
          <span>{battery}%</span>
        </div>
      </div>

      <div
        className="relative w-[90%] md:w-[80%] overflow-hidden px-2 sm:px-4 md:px-8"
        ref={containerRef}
      >
        <div className="flex space-x-2 sm:space-x-3 md:space-x-4 w-max">
          {games.map((game, index) => {
            const borderClass = isGameHighlighted(index)
              ? 'border-blue-500 border-4'
              : 'border-transparent border-4';
            return (
              <motion.div
                key={game.name}
                className={`${borderClass} rounded-lg transition duration-300`}
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] md:w-[21rem] md:h-[21rem] object-cover rounded-lg"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-4">
        {bottomIcons.map((iconObj, idx) => {
          const borderClass = isIconHighlighted(idx)
            ? 'border-white border-4'
            : 'border-transparent border-4';
          return (
            <button
              key={iconObj.label}
              className={`${iconObj.bg} ${borderClass} rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center hover:scale-105 transition-transform duration-200 relative leading-none`}
              title={iconObj.label}
              onMouseEnter={() => {
                handleFirstInteraction();
                playHoverSound();
              }}
              onClick={() => {
                handleFirstInteraction();
                handleIconClick(idx);
              }}
            >
              {iconObj.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
