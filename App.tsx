
import React, { useState, useEffect } from 'react';
import { Player, GameState, MathTopic, Question, Sticker, AdventureTheme, UserStats, AppDesignTheme } from './types';
import { STICKERS, INITIAL_STATS, AVATARS, ADVENTURE_THEMES, THEME_CONFIG } from './constants';
import { generateMathQuestions, generateEncouragement } from './services/geminiService';
import { playCorrect, playWrong } from './services/soundService';
import { Button } from './components/Button';
import { StickerBook } from './components/StickerBook';
import { StatsView } from './components/StatsView';

// --- Sub-components for Screens ---

// 0. Theme Selection Screen
const ThemeSelectionScreen = ({ onSelect }: { onSelect: (theme: AppDesignTheme) => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 animate-fade-in bg-slate-50">
             <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 text-center">
                Milyen külsőt szeretnél?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                {/* Boy Theme Card */}
                <div 
                    onClick={() => onSelect('boy')}
                    className="group cursor-pointer relative h-80 rounded-[40px] overflow-hidden shadow-2xl transition-transform hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-7xl mb-4 group-hover:scale-110 transition-transform">🚀</span>
                        <h2 className="text-3xl font-bold text-white mb-2">Galaktikus</h2>
                        <p className="text-cyan-300 font-medium">Sötét színek, neon fények</p>
                    </div>
                </div>

                {/* Girl Theme Card */}
                <div 
                    onClick={() => onSelect('girl')}
                    className="group cursor-pointer relative h-80 rounded-[40px] overflow-hidden shadow-2xl transition-transform hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-purple-200 to-indigo-200"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-7xl mb-4 group-hover:scale-110 transition-transform">✨</span>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Álomszép</h2>
                        <p className="text-purple-600 font-medium">Pasztell színek, csillogás</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 1. Welcome Screen with Avatar Selection
const WelcomeScreen = ({ onStart, themeType }: { onStart: (name: string, avatar: string) => void, themeType: AppDesignTheme }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const theme = THEME_CONFIG[themeType];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center space-y-6 animate-fade-in">
      <h1 className={`text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r ${themeType === 'boy' ? 'from-cyan-400 to-blue-600' : 'from-pink-400 to-purple-600'} drop-shadow-sm pb-2`}>
        MatekKaland
      </h1>
      <div className={`p-6 md:p-8 rounded-3xl ${theme.cardClass} w-full max-w-lg`}>
        <p className={`text-xl mb-2 font-bold ${theme.textClass}`}>Hogy hívnak?</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Írd be a neved..."
          className={`w-full p-4 text-2xl text-center rounded-xl outline-none mb-6 border-2 transition-all ${theme.inputClass}`}
          maxLength={15}
        />

        <p className={`text-xl mb-4 font-bold ${theme.textClass}`}>Válassz egy hőst!</p>
        <div className="grid grid-cols-5 md:grid-cols-7 gap-2 mb-8">
            {AVATARS.map((avatar) => (
                <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-2 rounded-xl transition-all border-2 
                        ${selectedAvatar === avatar 
                            ? `${themeType === 'boy' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-pink-500/20 border-pink-400'} scale-110 shadow-lg` 
                            : 'border-transparent hover:bg-white/10 hover:scale-105'
                        }`}
                >
                    {avatar}
                </button>
            ))}
        </div>

        <Button 
          onClick={() => name.trim() && selectedAvatar && onStart(name, selectedAvatar)} 
          disabled={!name.trim() || !selectedAvatar}
          size="lg"
          themeType={themeType}
        >
          Indulás! 🚀
        </Button>
      </div>
    </div>
  );
};

// 2. Dashboard Screen
const Dashboard = ({ player, onPlay, onStickers, onStats }: { player: Player, onPlay: () => void, onStickers: () => void, onStats: () => void }) => {
  const theme = THEME_CONFIG[player.designTheme];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-6 max-w-2xl mx-auto w-full">
      <header className={`w-full flex justify-between items-center p-4 rounded-2xl ${theme.cardClass}`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-inner ${theme.iconBg}`}>
            {player.avatar}
          </div>
          <div className="flex flex-col text-left">
            <span className={`text-sm font-bold uppercase tracking-wider ${theme.subTextClass}`}>Játékos</span>
            <span className={`text-3xl font-black ${theme.textClass}`}>{player.name}</span>
          </div>
        </div>
        <div className={`px-5 py-2 rounded-xl border ${player.designTheme === 'boy' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-yellow-100 border-yellow-300 text-yellow-600'}`}>
          <span className="text-2xl font-bold">⭐ {player.stats.stickersCollected.length}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-grow">
        <div 
          onClick={onPlay}
          className={`p-8 rounded-[32px] cursor-pointer transform hover:scale-[1.02] transition-all flex flex-col items-center justify-center col-span-1 md:col-span-2 min-h-[220px] shadow-2xl relative overflow-hidden group ${player.designTheme === 'boy' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-pink-500 to-violet-500'}`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
          <span className="text-7xl mb-4 group-hover:rotate-12 transition-transform">🎮</span>
          <h2 className="text-4xl font-black text-white relative z-10">Játék Indítása</h2>
        </div>

        <div 
          onClick={onStickers}
          className={`${theme.cardClass} p-6 rounded-[32px] cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all flex flex-col items-center justify-center`}
        >
          <span className="text-5xl mb-2">📒</span>
          <h3 className={`text-2xl font-bold ${theme.textClass}`}>Matricák</h3>
        </div>

        <div 
          onClick={onStats}
          className={`${theme.cardClass} p-6 rounded-[32px] cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all flex flex-col items-center justify-center`}
        >
          <span className="text-5xl mb-2">📊</span>
          <h3 className={`text-2xl font-bold ${theme.textClass}`}>Eredmények</h3>
        </div>
      </div>
    </div>
  );
};

// 3. Adventure Theme Selection
const AdventureSelector = ({ onSelect, onBack, themeType }: { onSelect: (theme: AdventureTheme) => void, onBack: () => void, themeType: AppDesignTheme }) => {
    const theme = THEME_CONFIG[themeType];
    return (
        <div className="flex flex-col items-center min-h-[90vh] p-6 max-w-5xl mx-auto animate-fade-in w-full">
            <div className="w-full flex justify-start mb-4">
                <Button variant="secondary" onClick={onBack} size="sm" themeType={themeType}>← Vissza</Button>
            </div>
            <h2 className={`text-3xl font-black mb-2 text-center px-6 py-2 rounded-full ${theme.textClass}`}>Hol kalandozzunk ma?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                {ADVENTURE_THEMES.map((advTheme) => (
                    <div 
                        key={advTheme.id}
                        onClick={() => onSelect(advTheme)}
                        className={`cursor-pointer group relative overflow-hidden rounded-[32px] shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-gradient-to-br ${advTheme.bgGradient} p-1`}
                    >
                         <div className="bg-white/90 backdrop-blur-sm h-full p-6 flex flex-col items-center text-center rounded-[28px] group-hover:bg-white transition-colors">
                            <span className="text-6xl mb-4 group-hover:scale-110 transition-transform block">{advTheme.emoji}</span>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{advTheme.name}</h3>
                            <p className="text-sm text-gray-500">{advTheme.description}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 4. Topic Selection
const TopicSelector = ({ theme, onStart, onBack, themeType }: { theme: AdventureTheme, onStart: (topics: MathTopic[]) => void, onBack: () => void, themeType: AppDesignTheme }) => {
  const [selectedTopics, setSelectedTopics] = useState<MathTopic[]>([]);
  const appTheme = THEME_CONFIG[themeType];

  const toggleTopic = (topic: MathTopic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div className={`flex flex-col items-center min-h-screen p-6 max-w-3xl mx-auto bg-gradient-to-b ${theme.bgGradient} bg-fixed w-full`}>
      <div className="w-full flex justify-start mb-4">
        <Button variant="secondary" onClick={onBack} size="sm" themeType={themeType}>← Vissza</Button>
      </div>
      
      <div className="text-center mb-6">
        <span className="text-6xl block mb-2">{theme.emoji}</span>
        <h2 className={`text-3xl md:text-4xl font-black ${theme.accentColor} drop-shadow-md`}>Mit gyakoroljunk?</h2>
        <p className="text-white opacity-90 mt-2 font-bold text-lg">Válassz egyet vagy többet!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
        {Object.values(MathTopic).map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <div 
              key={topic} 
              onClick={() => toggleTopic(topic)}
              className={`cursor-pointer rounded-2xl p-4 flex items-center justify-between transition-all transform hover:scale-[1.02] active:scale-95 ${
                isSelected 
                  ? 'bg-white border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.5)]' 
                  : 'bg-black/30 border-4 border-transparent hover:bg-black/40 backdrop-blur-sm'
              }`}
            >
              <span className={`text-xl font-bold ${isSelected ? 'text-gray-800' : 'text-white'}`}>
                {topic}
              </span>
              {isSelected && <span className="text-2xl">✅</span>}
            </div>
          );
        })}
      </div>

      <Button 
        size="lg" 
        onClick={() => onStart(selectedTopics)} 
        disabled={selectedTopics.length === 0}
        themeType={themeType}
        className="w-full max-w-md shadow-2xl animate-pulse"
      >
        Küldetés Indítása! 🚀
      </Button>
    </div>
  );
};

// 5. Playing Screen
const QuizGame = ({ 
  topics, 
  theme,
  onFinish,
  themeType
}: { 
  topics: MathTopic[], 
  theme: AdventureTheme,
  onFinish: (correct: number, total: number) => void,
  themeType: AppDesignTheme
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const q = await generateMathQuestions(topics, theme, 10);
      setQuestions(q);
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics, theme]);

  const handleAnswer = (answer: number) => {
    if (selectedOption !== null) return; 
    setSelectedOption(answer);
    setShowFeedback(true);

    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) {
        playCorrect();
        setScore(s => s + 1);
    } else {
        playWrong();
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        onFinish(isCorrect ? score + 1 : score, questions.length);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin text-6xl mb-4">{theme.emoji}</div>
        <p className="text-2xl font-bold text-white">A küldetés betöltése...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 w-full bg-gradient-to-b ${theme.bgGradient}`}>
      <div className="max-w-2xl w-full mx-auto mt-8">
        {/* Progress Bar */}
        <div className="w-full bg-black/30 rounded-full h-4 mb-8 backdrop-blur-sm p-1">
            <div 
            className="bg-white h-full rounded-full transition-all duration-500 shadow-glow relative" 
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-xl">
                    {theme.emoji}
                </div>
            </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-8 rounded-[32px] shadow-2xl border-b-8 border-gray-200 w-full mb-8 relative overflow-hidden">
            <span className="absolute top-4 left-4 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                {currentIndex + 1} / {questions.length}
            </span>
            <div className="absolute -top-6 -right-6 text-9xl opacity-10">{theme.emoji}</div>
            <h3 className="text-2xl md:text-3xl font-black text-center mt-6 mb-2 text-gray-800 leading-relaxed">
                {currentQ.questionText}
            </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
            {currentQ.options.map((opt, idx) => {
            let btnVariant: 'primary' | 'success' | 'danger' | 'secondary' = 'secondary';
            if (selectedOption !== null) {
                if (opt === currentQ.correctAnswer) btnVariant = 'success';
                else if (opt === selectedOption) btnVariant = 'danger';
                else btnVariant = 'secondary';
            }

            return (
                <Button 
                    key={idx}
                    variant={selectedOption === null ? 'primary' : btnVariant}
                    onClick={() => handleAnswer(opt)}
                    className={`text-3xl h-24 rounded-[24px] ${selectedOption !== null && opt !== selectedOption && opt !== currentQ.correctAnswer ? 'opacity-40 scale-95' : 'hover:scale-105'}`}
                    disabled={selectedOption !== null}
                    themeType={themeType}
                >
                {opt}
                </Button>
            )
            })}
        </div>

        {showFeedback && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 text-3xl font-black animate-bounce text-center bg-white p-6 rounded-full shadow-2xl z-50 whitespace-nowrap">
                {selectedOption === currentQ.correctAnswer 
                    ? <span className="text-green-500">Helyes! 🎉</span> 
                    : <span className="text-red-500">Majdnem! A helyes: {currentQ.correctAnswer}</span>
                }
            </div>
        )}
      </div>
    </div>
  );
};

// 6. Result Screen
const ResultScreen = ({ 
    correct, 
    total, 
    playerName, 
    onHome,
    themeType
}: { 
    correct: number, 
    total: number, 
    playerName: string, 
    onHome: (newSticker: Sticker | null) => void,
    themeType: AppDesignTheme
}) => {
    const [message, setMessage] = useState('Értékelés...');
    const [reward, setReward] = useState<Sticker | null>(null);
    const theme = THEME_CONFIG[themeType];

    useEffect(() => {
        const finalize = async () => {
            const isSuccess = correct / total > 0.6; 
            const msg = await generateEncouragement(playerName, isSuccess);
            setMessage(msg);

            if (correct / total >= 0.8) {
                const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
                setReward(randomSticker);
            }
        };
        finalize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center max-w-xl mx-auto w-full">
             <div className={`${theme.cardClass} p-8 rounded-[40px] shadow-2xl w-full`}>
                <h2 className={`text-4xl font-black mb-4 ${theme.textClass}`}>
                    {correct === total ? 'Tökéletes! 🏆' : 'Vége a körnek!'}
                </h2>
                
                <div className={`text-7xl font-black mb-6 ${theme.accentText}`}>
                    {correct} / {total}
                </div>
                
                <p className={`text-xl italic mb-8 ${theme.subTextClass}`}>
                    "{message}"
                </p>

                {reward && (
                    <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-yellow-300 mb-8 animate-float shadow-xl">
                        <p className="font-bold text-yellow-700 mb-2 uppercase tracking-widest text-sm">Új Kincs!</p>
                        <img src={reward.url} alt="Reward" className="w-32 h-32 object-contain rounded-lg mx-auto filter drop-shadow-md" />
                        <p className="font-bold mt-4 text-xl text-yellow-900">{reward.name}</p>
                    </div>
                )}

                <Button size="lg" onClick={() => onHome(reward)} themeType={themeType}>
                    Tovább ➔
                </Button>
             </div>
        </div>
    );
}

// --- Main App Component ---

const App = () => {
    const [gameState, setGameState] = useState<GameState>('THEME_SELECTION');
    
    // Sub-states
    const [showAdventureSelect, setShowAdventureSelect] = useState(false);
    const [showTopicSelect, setShowTopicSelect] = useState(false);
    const [showStats, setShowStats] = useState(false);
    
    const [player, setPlayer] = useState<Player | null>(null);
    const [tempTheme, setTempTheme] = useState<AppDesignTheme | null>(null); // For Theme Selection screen before player is created
    
    const [selectedTheme, setSelectedTheme] = useState<AdventureTheme | null>(null);
    const [selectedTopics, setSelectedTopics] = useState<MathTopic[]>([]);
    const [lastGameResult, setLastGameResult] = useState<{correct: number, total: number} | null>(null);

    useEffect(() => {
        const savedPlayer = localStorage.getItem('matek_player');
        if (savedPlayer) {
            const p = JSON.parse(savedPlayer);
            // Migrations
            if (!p.stats.stickerOrder) p.stats.stickerOrder = STICKERS.map(s => s.id);
            if (!p.stats.albumThemeId) p.stats.albumThemeId = 'classic';
            if (!p.designTheme) p.designTheme = 'girl'; // Default fallback for existing users
            
            setPlayer(p);
            setTempTheme(p.designTheme);
            setGameState('DASHBOARD');
        }
    }, []);

    const savePlayer = (updatedPlayer: Player) => {
        setPlayer(updatedPlayer);
        localStorage.setItem('matek_player', JSON.stringify(updatedPlayer));
    };
    
    const handleStatsUpdate = (newStats: UserStats) => {
        if (player) {
            savePlayer({ ...player, stats: newStats });
        }
    };

    const handleThemeSelect = (theme: AppDesignTheme) => {
        setTempTheme(theme);
        setGameState('WELCOME');
    };

    const handleStart = (name: string, avatar: string) => {
        const finalTheme = tempTheme || 'girl';
        const newPlayer: Player = { 
            name, 
            avatar, 
            designTheme: finalTheme, 
            stats: INITIAL_STATS 
        };
        savePlayer(newPlayer);
        setGameState('DASHBOARD');
    };

    const startAdventureSelection = () => {
        setShowAdventureSelect(true);
        setGameState('ADVENTURE_SELECT');
    };

    const handleThemeSelected = (theme: AdventureTheme) => {
        setSelectedTheme(theme);
        setShowAdventureSelect(false);
        setShowTopicSelect(true);
        setGameState('PLAYING');
    };

    const handleTopicsConfirmed = (topics: MathTopic[]) => {
        setSelectedTopics(topics);
        setShowTopicSelect(false);
    };

    const handleGameFinish = (correct: number, total: number) => {
        setLastGameResult({ correct, total });
        setGameState('RESULT');
    };

    const handleReturnToDashboard = (newSticker: Sticker | null) => {
        if (player) {
            const updatedStats = { ...player.stats };
            updatedStats.correctAnswers += lastGameResult?.correct || 0;
            updatedStats.wrongAnswers += (lastGameResult?.total || 0) - (lastGameResult?.correct || 0);
            updatedStats.gamesPlayed += 1;
            
            if (newSticker && !updatedStats.stickersCollected.includes(newSticker.id)) {
                updatedStats.stickersCollected.push(newSticker.id);
            }
            savePlayer({ ...player, stats: updatedStats });
        }
        
        setSelectedTopics([]);
        setSelectedTheme(null);
        setLastGameResult(null);
        setShowTopicSelect(false);
        setShowAdventureSelect(false);
        setShowStats(false);
        setGameState('DASHBOARD');
    };

    const currentThemeType: AppDesignTheme = player?.designTheme || tempTheme || 'girl';
    const themeConfig = THEME_CONFIG[currentThemeType];

    const renderContent = () => {
        if (gameState === 'THEME_SELECTION') {
            return <ThemeSelectionScreen onSelect={handleThemeSelect} />;
        }

        if (gameState === 'WELCOME') {
            return <WelcomeScreen onStart={handleStart} themeType={currentThemeType} />;
        }

        if (!player) return null;

        if (gameState === 'STICKER_BOOK') {
            return (
                <StickerBook 
                    stats={player.stats} 
                    onUpdateStats={handleStatsUpdate}
                    onBack={() => setGameState('DASHBOARD')}
                    themeType={currentThemeType}
                />
            );
        }

        if (showStats) {
            return <StatsView stats={player.stats} onBack={() => setShowStats(false)} />;
        }

        if (gameState === 'RESULT' && lastGameResult) {
            return (
                <ResultScreen 
                    correct={lastGameResult.correct} 
                    total={lastGameResult.total} 
                    playerName={player.name} 
                    onHome={handleReturnToDashboard}
                    themeType={currentThemeType}
                />
            );
        }

        if (gameState === 'ADVENTURE_SELECT') {
             return <AdventureSelector onSelect={handleThemeSelected} onBack={() => setGameState('DASHBOARD')} themeType={currentThemeType} />;
        }

        if (gameState === 'PLAYING') {
            if (showTopicSelect && selectedTheme) {
                return (
                  <TopicSelector 
                    theme={selectedTheme} 
                    onStart={handleTopicsConfirmed} 
                    onBack={() => { setShowTopicSelect(false); setGameState('ADVENTURE_SELECT'); }}
                    themeType={currentThemeType}
                  />
                );
            }
            if (selectedTopics.length > 0 && selectedTheme) {
                return <QuizGame topics={selectedTopics} theme={selectedTheme} onFinish={handleGameFinish} themeType={currentThemeType} />;
            }
        }

        // Default: Dashboard
        return (
            <Dashboard 
                player={player}
                onPlay={startAdventureSelection}
                onStickers={() => setGameState('STICKER_BOOK')}
                onStats={() => setShowStats(true)}
            />
        );
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${themeConfig.bgGradient}`}>
            {renderContent()}
        </div>
    );
};

export default App;
