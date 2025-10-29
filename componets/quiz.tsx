'use client';

import { useState } from 'react';

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      subject,
      difficulty,
      numQuestions,
    });
    alert('Quiz created successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Quiz<span className="text-blue-500">_up</span>
        </h1>
        <h2 className="text-xl font-semibold text-gray-300">Create New Quiz</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Quiz Title */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter quiz title"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Subject of Quiz
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Enter subject (e.g. Science, Math)"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Difficulty Level
          </label>
          <div className="flex items-center space-x-6">
            {['easy', 'medium', 'hard'].map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 shadow-md"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}
