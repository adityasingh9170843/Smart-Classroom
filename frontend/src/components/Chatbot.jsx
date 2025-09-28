import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, X, Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown'; // Import the markdown renderer

export function Chatbot({ isOpen, onClose, context }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Add a welcome message when the chat opens for the first time
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { sender: 'bot', text: 'Hello! How can I help you with your schedule today?' }
      ]);
    }
  }, [isOpen]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // API call to your backend AI chat route
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: currentInput,
        context: context, // Pass the dashboard context to the AI
      });

      const botMessage = { sender: 'bot', text: res.data.response };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render the component if it's not open
  if (!isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-24 right-8 w-96 h-[60vh] flex flex-col shadow-2xl rounded-2xl z-50 bg-white/80 backdrop-blur-sm border-slate-200/50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
                <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-slate-800">Scheduler Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`prose prose-sm prose-slate max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white prose-invert' : 'bg-slate-100 text-slate-800'}`}>
              {/* Use ReactMarkdown to render the response */}
              <ReactMarkdown components={{p: ({node, ...props}) => <p className="my-0" {...props} />}}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start items-end gap-2">
                 <div className="max-w-[80%] p-3 rounded-xl bg-slate-100 text-slate-800">
                    <p className="text-sm animate-pulse">Thinking...</p>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t bg-white/50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about schedules..."
            autoComplete="off"
            disabled={isLoading}
            className="h-10 rounded-full focus-visible:ring-blue-500"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}