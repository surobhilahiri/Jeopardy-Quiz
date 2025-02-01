import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import useSound from 'use-sound';

import selectSound from '@/sounds/select.mp3';
import correctSound from '@/sounds/correct.mp3';
import wrongSound from '@/sounds/wrong.mp3';

function AdvancedJeopardyBoard() {
  const [currentTeam, setCurrentTeam] = useState('A');
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  
  const modalRef = useRef(null);
  const [playSelect] = useSound(selectSound);
  const [playCorrect] = useSound(correctSound);
  const [playWrong] = useSound(wrongSound);

  const categories = {
    'Sports': {
      200: { q: "First Indian captain who led India in Lords in 1932. He was also known as India's first cricket superstar and played first-class cricket until the age of 62", a: "Who is CK Nayudu?" },
      1400: { q: "This badminton player won Bronze at 2024 Asian Championships. She previously made history as first Indian woman to win two Olympic medals", a: "Who is PV Sindhu?" }
    },
    'Literature': {
      1400: { q: "Amartya Sen's autobiography released in 2021 shares its name with this concept from Indian philosophy meaning 'Home in the World'", a: "What is Home in the World?" }
    }
  };

  const handleQuestionClick = (category, value) => {
    if (!answeredQuestions.has(`${category}-${value}`) && !selectedQuestion) {
      playSelect();
      setSelectedQuestion({ category, value });
      setShowAnswer(false);
    }
  };

  const handleAnswer = (correct = false) => {
    if (selectedQuestion) {
      setAnsweredQuestions((prev) => new Set([...prev, `${selectedQuestion.category}-${selectedQuestion.value}`]));
      if (correct) {
        playCorrect();
        setScores((prev) => ({
          ...prev,
          [currentTeam]: prev[currentTeam] + selectedQuestion.value,
        }));
      } else {
        playWrong();
      }
      setCurrentTeam(currentTeam === 'A' ? 'B' : 'A');
    }
    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setSelectedQuestion(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedQuestion(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Scoreboard */}
      <div className="flex justify-between items-center mb-6">
        <div className={`text-2xl font-bold p-4 rounded-lg ${currentTeam === 'A' ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}>
          Team A: ${scores.A}
          {currentTeam === 'A' && <Trophy className="inline ml-2 text-blue-500" size={24} />}
        </div>
        <div className={`text-2xl font-bold p-4 rounded-lg ${currentTeam === 'B' ? 'bg-green-100 ring-2 ring-green-500' : ''}`}>
          Team B: ${scores.B}
          {currentTeam === 'B' && <Trophy className="inline ml-2 text-green-500" size={24} />}
        </div>
      </div>

      {/* Jeopardy Board */}
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(categories).map(category => (
          <div key={category} className="bg-blue-700 p-3 text-white font-bold text-center rounded">
            {category}
          </div>
        ))}
        
        {[200, 1400].map(value => (
          <React.Fragment key={value}>
            {Object.keys(categories).map(category => (
              <div
                key={`${category}-${value}`}
                className={`cursor-pointer text-center p-3 rounded ${
                  answeredQuestions.has(`${category}-${value}`) ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-500'
                }`}
                onClick={() => handleQuestionClick(category, value)}
              >
                <span className="text-white font-bold">
                  {answeredQuestions.has(`${category}-${value}`) ? '' : `$${value}`}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Modal for Questions */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <Card ref={modalRef} className="w-full max-w-2xl bg-white p-6">
            <div className="text-2xl font-bold mb-4">
              {selectedQuestion.category} - ${selectedQuestion.value}
            </div>
            <div className="text-xl mb-6">
              {categories[selectedQuestion.category][selectedQuestion.value].q}
            </div>
            {showAnswer && (
              <div className="text-lg text-blue-600 mb-6">
                {categories[selectedQuestion.category][selectedQuestion.value].a}
              </div>
            )}
            <div className="flex justify-end gap-4">
              {!showAnswer && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Answer
                </button>
              )}
              {showAnswer && (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                    onClick={() => handleAnswer(true)}
                  >
                    Correct
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                    onClick={() => handleAnswer(false)}
                  >
                    Incorrect
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdvancedJeopardyBoard;
