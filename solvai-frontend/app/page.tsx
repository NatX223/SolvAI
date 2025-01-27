// app/page.tsx
import ChatInterface from '@/components/chatinterface';


export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}