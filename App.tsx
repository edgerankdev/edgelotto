import React, { useState, useCallback, useEffect } from 'react';
import { NumberSlot } from './components/NumberSlot';

const App: React.FC = () => {
  const [spinningState, setSpinningState] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [finalNumbers, setFinalNumbers] = useState<[number, number, number]>([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('lottoHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      localStorage.removeItem('lottoHistory');
    }
  }, []);

  const handleStart = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinningState([true, true, true]);

    const newFinalNumbers: [number, number, number] = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];
    setFinalNumbers(newFinalNumbers);

    setTimeout(() => {
      setSpinningState(prev => [false, prev[1], prev[2]]);
    }, 3000);

    setTimeout(() => {
      setSpinningState(prev => [prev[0], false, prev[2]]);
    }, 4000);

    setTimeout(() => {
      setSpinningState(prev => [prev[0], prev[1], false]);
      setIsSpinning(false);
      
      const newResult = newFinalNumbers.join('');
      setHistory(prevHistory => {
        const updatedHistory = [newResult, ...prevHistory];
        localStorage.setItem('lottoHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }, 5000);
  }, [isSpinning]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('lottoHistory');
  }, []);

  return (
    <main className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 antialiased overflow-hidden">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          엣지로또
        </h1>
        <p className="text-slate-400 md:text-lg">
          시작 버튼을 눌러 행운의 숫자를 뽑아보세요!
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 md:space-x-6 my-12">
        <NumberSlot isSpinning={spinningState[0]} finalNumber={finalNumbers[0]} />
        <NumberSlot isSpinning={spinningState[1]} finalNumber={finalNumbers[1]} />
        <NumberSlot isSpinning={spinningState[2]} finalNumber={finalNumbers[2]} />
      </div>

      <button
        onClick={handleStart}
        disabled={isSpinning}
        className="
          px-10 py-4 bg-cyan-500 text-slate-900 font-bold text-xl rounded-lg
          shadow-lg shadow-cyan-500/40
          hover:bg-cyan-400 transition-all duration-300 ease-in-out
          disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed
          transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
      >
        {isSpinning ? 'Spinning...' : 'START'}
      </button>

      <div className="w-full max-w-md mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-300">결과 기록</h2>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-600/80 text-white font-semibold text-sm rounded-md hover:bg-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
              Clear
            </button>
          )}
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg max-h-48 overflow-y-auto">
          {history.length > 0 ? (
            <ul className="space-y-2">
              {history.map((result, index) => (
                <li key={index} className="text-slate-300 text-lg font-mono flex justify-between items-center bg-slate-700/50 p-2 rounded">
                  <span className="text-slate-500 text-sm">{`#${history.length - index}`}</span>
                  <span className="tracking-widest">{result}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-center">결과가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;