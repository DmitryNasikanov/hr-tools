import { Chat } from './components/Chat'

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          HR Ассистент
        </h1>
        <Chat />
      </div>
    </main>
  )
} 