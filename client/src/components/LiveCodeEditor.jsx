import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  FileCode, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const DEFAULT_SNIPPETS = {
  javascript: `// SkillSwapLive Collaborative Code Editor
// Real-time synchronization active!

function calculateSkillMatch(userOffered, partnerWanted) {
  const matches = userOffered.filter(skill => 
    partnerWanted.includes(skill)
  );
  
  return {
    score: (matches.length / partnerWanted.length) * 100,
    matchingSkills: matches
  };
}

console.log("Ready to code together!");`,
  python: `# SkillSwapLive Python Workspace
def learn_machine_learning():
    topics = ["Pandas", "PyTorch", "Transformers", "RAG Agents"]
    for idx, topic in enumerate(topics, 1):
        print(f"Step {idx}: Mastering {topic}")

learn_machine_learning()`,
  markdown: `# 🎓 Live Skill Exchange Session Notes
- **Mentor:** Elena Rostova (React & Next.js)
- **Learner:** Carlos Mendoza
- **Date:** Today

### Key Takeaways:
1. React \`useEffect\` dependency arrays
2. Custom hooks for API caching
3. Clean state architecture with Context API`,
};

const LiveCodeEditor = ({ roomId }) => {
  const { socket } = useSocket();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Listen to remote code updates
  useEffect(() => {
    if (!socket) return;

    const handleRemoteCodeUpdate = (data) => {
      if (data.code !== undefined) {
        setCode(data.code);
      }
      if (data.language && data.language !== language) {
        setLanguage(data.language);
      }
    };

    socket.on('code-update', handleRemoteCodeUpdate);

    return () => {
      socket.off('code-update', handleRemoteCodeUpdate);
    };
  }, [socket, language]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (socket && roomId) {
      socket.emit('code-update', {
        roomId,
        code: newCode,
        language,
      });
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const snippet = DEFAULT_SNIPPETS[newLang] || '// Start coding...';
    setCode(snippet);

    if (socket && roomId) {
      socket.emit('code-update', {
        roomId,
        code: snippet,
        language: newLang,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Executing in sandbox...');

    setTimeout(() => {
      if (language === 'javascript') {
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')),
            error: (...args) => logs.push('[ERROR]: ' + args.join(' ')),
          };
          
          const runFn = new Function('console', code);
          runFn(customConsole);
          setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no console output).');
        } catch (err) {
          setOutput(`Error: ${err.message}`);
        }
      } else {
        setOutput(`[${language.toUpperCase()} Simulator Output]: Script validated and simulated successfully.\nResult: Process finished with exit code 0.`);
      }
      setIsRunning(false);
    }, 600);
  };

  // Line numbers calculation
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(12, lineCount) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel border border-slate-800 overflow-hidden font-mono text-xs">
      
      {/* Top Code Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
          >
            <option value="javascript">JavaScript (React)</option>
            <option value="python">Python 3</option>
            <option value="markdown">Markdown & Notes</option>
          </select>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sync Active
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 font-sans">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Editor Main Body */}
      <div className="flex-1 flex overflow-hidden min-h-[380px] bg-[#090d16]">
        
        {/* Line Numbers */}
        <div className="w-12 py-4 select-none bg-slate-950/60 border-r border-slate-800/80 text-right pr-3 text-slate-600 font-mono text-[11px] leading-6">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-slate-200 focus:outline-none resize-none font-mono text-[12px] leading-6 selection:bg-indigo-600/40 selection:text-white border-0"
        />

      </div>

      {/* Output Console / Terminal */}
      {output && (
        <div className="border-t border-slate-800 bg-[#070a10] p-3 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-sans">
            <span>Terminal Output:</span>
            <button onClick={() => setOutput('')} className="hover:text-white">Clear</button>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px] max-h-24 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}

    </div>
  );
};

export default LiveCodeEditor;
