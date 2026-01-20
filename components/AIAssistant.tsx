
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2 } from 'lucide-react';
import { getAdminInsights } from '../services/geminiService';
import { User, Metric } from '../types';

interface AIAssistantProps {
  users: User[];
  stats: Metric[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ users, stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: `Hello! I have access to your live database of ${users.length} users. How can I assist you today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);

    const context = {
      systemStats: stats,
      totalRecords: users.length,
      sampleData: users.slice(0, 5).map(u => ({ name: u.name, role: u.role, created: u.createdAt }))
    };

    const aiResponse = await getAdminInsights(userQuery, context);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100] border-4 border-white"
      >
        <Sparkles size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-[420px] h-[550px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col z-[100] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm tracking-tight leading-none">SuperNova Core</p>
                <p className="text-[10px] text-indigo-200 mt-1 uppercase font-bold tracking-widest">Live Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100' 
                    : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm rounded-tl-none">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-50 flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Ask about your live users..." 
              className="flex-1 text-sm border-none bg-slate-50 px-4 py-3 rounded-xl focus:ring-0 focus:outline-none placeholder-slate-400 font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !query.trim()}
              className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
