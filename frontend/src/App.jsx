import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Milestone 1: Scaffolding Complete
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed">
          Smart ATS Resume Evaluation & Optimization System powered by Gemini AI.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-medium pt-2">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-slate-300">
            React (Vite)
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-slate-300">
            Tailwind CSS v4
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-slate-300">
            Node.js (ESM)
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-slate-300">
            Express API
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          Frontend & Backend project skeleton initialized and running.
        </div>
      </div>
    </div>
  );
}

export default App;
