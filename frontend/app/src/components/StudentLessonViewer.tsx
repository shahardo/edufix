import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { useUser } from '../contexts/UserContext';

interface Lesson {
  id: number;
  title: string;
  description: string;
  unit_id: number;
  order: number;
}

interface Material {
  id: number;
  title: string;
  type: 'slide' | 'video' | 'document' | 'text';
  url: string;
  content?: string; // For text content
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'system';
  text: string;
  timestamp: Date;
}

const StudentLessonViewer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'glossary'>('content');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(12); // Mock total slides
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 1, sender: 'system', text: 'Hello! I can help you understand this lesson. Ask me anything about the slides.', timestamp: new Date() }
  ]);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  // Fetch Lesson Details
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch lesson');
      return res.json();
    }
  });

  // Fetch Materials
  const { data: materials, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials', lessonId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/materials?lesson_id=${lessonId}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch materials');
      return res.json();
    },
    // Mock data if API returns empty or fails (for development)
    initialData: [
      { id: 1, title: 'Lesson Slides', type: 'slide', url: '#' },
      { id: 2, title: 'Introduction Video', type: 'video', url: '#' },
      { id: 3, title: 'Reading Material', type: 'document', url: '#' }
    ] as Material[]
  });

  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  // Set default material when loaded
  React.useEffect(() => {
    if (materials && materials.length > 0 && !activeMaterial) {
      setActiveMaterial(materials[0]);
    }
  }, [materials, activeMaterial]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');

    // Mock system response
    setTimeout(() => {
      const response: ChatMessage = {
        id: Date.now() + 1,
        sender: 'system',
        text: `That's a great question about "${activeMaterial?.title || 'this lesson'}". Here is a brief explanation...`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, response]);
    }, 1000);
  };

  const renderContent = () => {
    if (!activeMaterial) return <div className="p-8 text-center text-gray-500">Select a material to view</div>;

    switch (activeMaterial.type) {
      case 'slide':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow bg-gray-900 flex items-center justify-center rounded-lg overflow-hidden relative min-h-[400px]">
              <div className="text-white text-center">
                <h3 className="text-2xl font-bold mb-4">{activeMaterial.title}</h3>
                <p className="text-gray-400">Slide {currentSlide} of {totalSlides}</p>
                <div className="mt-8 p-12 border-2 border-dashed border-gray-700 rounded-lg">
                  [Slide Content Placeholder]
                </div>
              </div>
              
              {/* Slide Controls Overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                  disabled={currentSlide === 1}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="px-4 py-2 bg-black/50 text-white rounded-full text-sm font-medium">
                  {currentSlide} / {totalSlides}
                </span>
                <button 
                  onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
                  disabled={currentSlide === totalSlides}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="bg-black flex items-center justify-center h-full rounded-lg min-h-[400px]">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p>Video Player Placeholder</p>
              <p className="text-sm text-gray-500 mt-2">{activeMaterial.title}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-8 border border-gray-200 rounded-lg h-full min-h-[400px]">
            <h3 className="text-xl font-bold mb-4">{activeMaterial.title}</h3>
            <p className="text-gray-600">Document viewer placeholder for {activeMaterial.type}.</p>
            <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
              Download Document
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={lesson?.title || "Lesson Viewer"} user={user} showUserMenu={true} />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Breadcrumbs & Back */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Unit
          </button>
          <div className="text-sm text-gray-500">
            Lesson {lesson?.order}: {lesson?.title}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          
          {/* Left Column: Content Viewer */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Material Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {materials?.map(material => (
                <button
                  key={material.id}
                  onClick={() => setActiveMaterial(material)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeMaterial?.id === material.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">
                    {material.type === 'slide' && '📊'}
                    {material.type === 'video' && '🎥'}
                    {material.type === 'document' && '📄'}
                  </span>
                  {material.title}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow p-4 bg-gray-50 overflow-y-auto">
              {lessonLoading || materialsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                renderContent()
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {activeMaterial?.type === 'slide' ? `Slide ${currentSlide} of ${totalSlides}` : activeMaterial?.title}
              </div>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  Previous Lesson
                </button>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors">
                  Next Lesson
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tools */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tool Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                  activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Q&A
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                  activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('glossary')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                  activeTab === 'glossary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Glossary
              </button>
            </div>

            {/* Tool Content */}
            <div className="flex-grow flex flex-col overflow-hidden">
              {activeTab === 'content' && (
                <>
                  <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {chatHistory.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="relative">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                    </form>
                    <button className="w-full mt-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Start Practice for this Lesson
                    </button>
                  </div>
                </>
              )}
              {activeTab === 'notes' && (
                <div className="p-4 text-center text-gray-500 text-sm mt-10">
                  <p>Personal notes feature coming soon.</p>
                </div>
              )}
              {activeTab === 'glossary' && (
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="font-bold text-gray-900 text-sm">Stoichiometry</div>
                    <div className="text-xs text-gray-600 mt-1">The calculation of reactants and products in chemical reactions.</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="font-bold text-gray-900 text-sm">Mole</div>
                    <div className="text-xs text-gray-600 mt-1">A standard scientific unit for measuring large quantities of very small entities.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentLessonViewer;