import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Mic, Volume2, Sparkles, MessageSquare, Plus, Trash2, History, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth-store";

interface Msg { role: "user" | "bot"; text: string; lang?: "en" | "hi" }
interface ChatHistory { id: string; title: string; msgs: Msg[]; date: number }

interface ChatbotWidgetProps {
  mode?: "floating" | "page";
  suggestions?: string[];
}

export function ChatbotWidget({ mode = "floating", suggestions = [] }: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [text, setText] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string>(Date.now().toString());
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm Setu, your eco-assistant. How can I help today?" },
  ]);
  
  const listRef = useRef<HTMLDivElement>(null);
  const isOpen = mode === "page" || open;

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("setu_chat_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("setu_chat_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const startNewChat = () => {
    // Save current chat before clearing if it has messages
    if (msgs.length > 1) {
      const newHistoryItem: ChatHistory = {
        id: currentChatId,
        title: msgs.find(m => m.role === "user")?.text.slice(0, 30) + "..." || "New Chat",
        msgs: [...msgs],
        date: Date.now()
      };
      
      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== currentChatId);
        return [newHistoryItem, ...filtered];
      });
    }

    setMsgs([{ role: "bot", text: "Hi! I'm Setu, your eco-assistant. How can I help today?" }]);
    setCurrentChatId(Date.now().toString());
    setShowHistory(false);
  };

  const loadChat = (chat: ChatHistory) => {
    setMsgs(chat.msgs);
    setCurrentChatId(chat.id);
    setShowHistory(false);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(h => h.id !== id));
    if (currentChatId === id) {
      setMsgs([{ role: "bot", text: "Hi! I'm Setu, your eco-assistant. How can I help today?" }]);
      setCurrentChatId(Date.now().toString());
    }
  };

  const speak = (t: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = lang === "hi" ? "hi-IN" : "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  const send = async (t?: string) => {
    const v = (t ?? text).trim();
    if (!v) return;
    const userMsg: Msg = { role: "user", text: v };
    setMsgs((m) => [...m, userMsg]);
    setText("");

    try {
      const token = getToken();
      const user = getUser();
      const data = await apiRequest<{ success: boolean; reply: string }>("/chat", {
        method: "POST",
        token,
        body: {
          message: v,
          language: user?.settings?.language || (lang === "hi" ? "Hindi" : "English"),
        },
      });

      const botText = data.reply || "Please try again.";
      setMsgs((m) => [...m, { role: "bot", text: botText, lang }]);
      setTimeout(() => speak(botText), 200);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "";
      const fallback =
        errMsg ||
        (lang === "hi"
          ? "Server se connect nahi ho pa raha. Kripya thodi der me dubara try karein."
          : "Unable to reach server right now. Please try again shortly.");
      setMsgs((m) => [...m, { role: "bot", text: fallback, lang }]);
    }
  };

  const startVoice = () => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
    if (!SR) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-US";
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      setTimeout(() => send(transcript), 100);
    };
    rec.start();
  };

  return (
    <>
      {mode === "floating" && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gradient-leaf text-primary-foreground shadow-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-float hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] group"
          aria-label="Open AI Assistant"
        >
          {open ? (
            <X className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
          ) : (
            <Bot className="h-6 w-6 animate-bounce-subtle group-hover:animate-pulse" />
          )}
        </button>
      )}

      {isOpen && mode === "page" && (
        <section className="animate-chat-fade rounded-[28px] border border-border/60 bg-[linear-gradient(145deg,rgba(236,245,233,0.82)_0%,rgba(228,244,241,0.9)_100%)] p-4 md:p-7 shadow-card flex flex-col md:flex-row gap-6 min-h-[600px]">
          {/* Sidebar - History */}
          <div className="w-full md:w-64 flex flex-col gap-4 animate-in slide-in-from-left-4 duration-500">
            <Button 
              onClick={startNewChat}
              className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl py-6 h-auto transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold text-base">New Chat</span>
            </Button>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-2">
                <History className="h-3 w-3" /> Recent History
              </h3>
              <div className="space-y-1">
                {history.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => loadChat(chat)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      currentChatId === chat.id ? "bg-white shadow-soft ring-1 ring-primary/20" : "hover:bg-white/50"
                    }`}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate pr-6">{chat.title}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(chat.date).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={(e) => deleteChat(e, chat.id)}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="p-4 text-center text-xs text-muted-foreground italic bg-white/30 rounded-xl">No history yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col rounded-[24px] border border-border/70 bg-card/72 p-3 md:p-4 backdrop-blur-sm shadow-soft relative overflow-hidden">
            <header className="mb-4 pb-3 border-b border-border/40 flex items-center justify-between px-2">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" /> Setu AI
                </h1>
                <p className="text-[10px] text-muted-foreground">Always active to help with your eco-needs</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-success animate-pulse hidden sm:inline-flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                  <div className="h-1 w-1 bg-success rounded-full" /> Live Status
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "en" | "hi")}
                  className="h-8 rounded-lg border border-border/70 bg-white/50 px-2 text-[10px] font-bold outline-none cursor-pointer"
                >
                  <option value="en">ENGLISH</option>
                  <option value="hi">HINDI / हिंदी</option>
                </select>
              </div>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar min-h-[350px]">
              {msgs.map((m, i) => (
                <div key={i} className={`animate-chat-rise flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                  {m.role === "bot" && (
                    <div className="mr-2 mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-leaf text-primary-foreground flex items-center justify-center shadow-soft animate-pulse-soft">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[84%] rounded-[20px] px-4 py-3 text-sm leading-relaxed transition-all shadow-sm ring-1 ring-border/50 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm animate-in slide-in-from-right-2"
                      : "bg-white/80 rounded-bl-sm text-foreground animate-in slide-in-from-left-2"
                  }`}>
                    {m.text}
                    {m.role === "bot" && (
                      <div className="flex justify-end mt-2 pt-1 border-t border-border/20">
                        <button onClick={() => speak(m.text)} className="opacity-50 hover:opacity-100 p-1 rounded-md hover:bg-secondary" aria-label="Speak">
                          <Volume2 className="h-3.5 w-3.5 text-primary" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {suggestions.length > 0 && msgs.length === 1 && (
              <div className="mt-4 flex flex-wrap gap-2 px-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-4 flex items-center gap-2 p-1 bg-white/50 rounded-2xl shadow-inner border border-border/40">
              <button
                type="button"
                onClick={startVoice}
                className="h-11 w-11 shrink-0 rounded-xl hover:bg-primary/10 text-primary transition-all flex items-center justify-center"
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={lang === "hi" ? "Setu se kuch puchiye..." : "Ask Setu anything..."}
                className="h-11 flex-1 bg-transparent px-2 text-sm outline-none font-medium placeholder:text-muted-foreground/60"
              />
              <button type="submit" disabled={!text.trim()} className="h-10 px-4 shrink-0 rounded-xl bg-gradient-leaf text-primary-foreground shadow-soft hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold text-xs uppercase overflow-hidden">
                <span className="hidden sm:inline">Send</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-primary); opacity: 0.2; }
          `}</style>
        </section>
      )}

      {isOpen && mode === "floating" && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[450px] h-[600px] flex flex-row rounded-3xl bg-card border border-border/80 shadow-glow overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          {/* History Drawer Toggle (Floating) */}
          <div 
            className={`flex flex-col w-64 bg-secondary/20 border-r border-border/50 transition-all duration-300 overflow-hidden ${showHistory ? 'ml-0' : '-ml-64'}`}
          >
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-xs font-bold text-primary flex items-center gap-2"><History className="h-3.5 w-3.5" /> History</h3>
              <Plus className="h-4 w-4 cursor-pointer hover:text-primary" onClick={startNewChat} />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {history.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => loadChat(chat)}
                  className={`group relative p-3 rounded-xl cursor-pointer text-xs truncate transition-all ${currentChatId === chat.id ? 'bg-white shadow-sm ring-1 ring-primary/20' : 'hover:bg-white/40'}`}
                >
                  <div className="pr-6 truncate font-medium">{chat.title}</div>
                  <button 
                    onClick={(e) => deleteChat(e, chat.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/5 rounded-md"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-4 bg-gradient-leaf text-primary-foreground flex items-center gap-3 relative z-10">
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <History className="h-4 w-4" />
              </button>
              <div className="flex-1">
                <div className="font-bold text-sm tracking-tight">Setu Assistant</div>
                <div className="text-[10px] items-center flex gap-1 font-medium opacity-80"><div className="h-1 w-1 bg-white rounded-full animate-pulse" /> Active Session</div>
              </div>
              <Button onClick={() => setOpen(false)} variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5 custom-scrollbar">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] rounded-[20px] px-4 py-2.5 text-sm shadow-sm transition-all ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-white border border-border/40 rounded-bl-none text-foreground"
                  }`}>
                    {m.text}
                    {m.role === "bot" && (
                      <button onClick={() => speak(m.text)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Volume2 className="inline h-3 w-3 align-text-bottom text-primary" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-border/40 flex flex-col gap-2 bg-white"
            >
              <div className="flex items-center gap-2">
                <button type="button" onClick={startVoice} className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-muted text-primary transition-all active:scale-95" aria-label="Voice">
                  <Mic className="h-4.5 w-4.5" />
                </button>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={lang === "hi" ? "Naya sandesh..." : "Ask something..."}
                  className="flex-1 bg-secondary/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/30 border border-transparent focus:border-primary/20 transition-all font-medium"
                />
                <button type="submit" disabled={!text.trim()} className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all">
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1">
                <button 
                  type="button" 
                  onClick={startNewChat}
                  className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3 w-3" /> NEW CHAT
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setLang('en')} className={`text-[9px] font-black px-2 py-0.5 rounded ${lang === 'en' ? 'bg-primary text-white' : 'bg-secondary'}`}>EN</button>
                  <button type="button" onClick={() => setLang('hi')} className={`text-[9px] font-black px-2 py-0.5 rounded ${lang === 'hi' ? 'bg-primary text-white' : 'bg-secondary'}`}>हिं</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
