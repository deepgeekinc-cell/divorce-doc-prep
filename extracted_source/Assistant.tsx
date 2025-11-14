import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { AIChatBox } from "@/components/AIChatBox";

import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileText, MessageSquare, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";

export default function Assistant() {
  const { isAuthenticated, loading } = useAuth();
  
  const { data: chatHistory } = trpc.chat.getHistory.useQuery({ limit: 50 }, { enabled: isAuthenticated });
  const { data: proactiveGreeting } = trpc.guidance.getProactiveGreeting.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const sendMessage = trpc.chat.sendMessage.useMutation();
  
  // All hooks must be called before any conditional returns
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([]);
  const [hasLoadedGreeting, setHasLoadedGreeting] = useState(false);

  


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })));
      setHasLoadedGreeting(true);
    } else if (proactiveGreeting && !hasLoadedGreeting) {
      // Show proactive greeting if no chat history
      setMessages([{
        role: "assistant",
        content: proactiveGreeting,
      }]);
      setHasLoadedGreeting(true);
    }
  }, [chatHistory, proactiveGreeting, hasLoadedGreeting]);
  
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5" /> },
    { label: "Checklist", path: "/checklist", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { label: "AI Assistant", path: "/assistant", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Settings", path: "/state-selection", icon: <Settings className="h-5 w-5" /> },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSendMessage = async (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    const result = await sendMessage.mutateAsync({ message });
    setMessages(prev => [...prev, { role: "assistant", content: result.message }]);
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">AI Document Assistant</h1>
          <p className="text-gray-600 mt-2">
            Ask me anything about finding divorce documents online
          </p>
        </div>
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={sendMessage.isPending}
          placeholder="Ask me where to find a specific document..."
        />
      </div>
    </DashboardLayout>
  );
}
