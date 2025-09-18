import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  CheckCircle,
  Volume2,
  SkipBack,
  SkipForward,
  BookmarkPlus,
  User,
  Home,
  GraduationCap
} from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'slides';
  size: string;
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
  studyMaterials: StudyMaterial[];
  progress: number;
  completed: boolean;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Smart India Hackathon - Problem Solution Overview',
    description: 'Comprehensive overview of SIH problem-solving methodologies and innovative approaches to tackle real-world challenges.',
    duration: '45:30',
    audioUrl: '/api/placeholder/audio/sih-overview.mp3',
    studyMaterials: [
      {
        id: 'sih-1',
        title: 'SIH PROBLEM SOLUTION IN DETAIL',
        type: 'pdf',
        size: '2.4 MB',
        url: '/study-materials/SIH PROBLEM SOLUTION IN DETAIL_.pdf'
      }
    ],
    progress: 75,
    completed: false,
    category: 'Innovation',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Deep dive into complex data structures and algorithmic problem-solving techniques for competitive programming.',
    duration: '62:15',
    audioUrl: '/api/placeholder/audio/dsa-advanced.mp3',
    studyMaterials: [
      {
        id: 'dsa-1',
        title: 'Advanced DSA Concepts',
        type: 'pdf',
        size: '3.8 MB',
        url: '/study-materials/advanced-dsa.pdf'
      },
      {
        id: 'dsa-2',
        title: 'Algorithm Practice Problems',
        type: 'doc',
        size: '1.2 MB',
        url: '/study-materials/algo-problems.doc'
      }
    ],
    progress: 30,
    completed: false,
    category: 'Programming',
    difficulty: 'Advanced'
  },
  {
    id: '3',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts, supervised and unsupervised learning, and practical applications.',
    duration: '38:45',
    audioUrl: '/api/placeholder/audio/ml-fundamentals.mp3',
    studyMaterials: [
      {
        id: 'ml-1',
        title: 'ML Theory and Applications',
        type: 'slides',
        size: '5.1 MB',
        url: '/study-materials/ml-theory.pptx'
      }
    ],
    progress: 100,
    completed: true,
    category: 'AI/ML',
    difficulty: 'Beginner'
  }
];

export default function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = ['All', 'Innovation', 'Programming', 'AI/ML'];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentLesson]);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentLesson) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadMaterial = (material: StudyMaterial) => {
    // In a real app, this would trigger a download
    console.log(`Downloading ${material.title}`);
    // For demo purposes, we'll just show an alert
    alert(`Download started: ${material.title}`);
  };

  const openMaterial = (material: StudyMaterial) => {
    // In a real app, this would open the material in a viewer or new tab
    window.open(material.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Classroom Prototype</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                <GraduationCap className="w-4 h-4" />
                <span className="font-medium">Student</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                <User className="w-4 h-4" />
                <span>Teacher</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Lesson Dashboard 📚
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access your lessons with integrated audio content and study materials. 
            Everything you need to learn is perfectly synchronized and easily accessible.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-8">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                {/* Lesson Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                      {lesson.completed && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{lesson.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">{lesson.category}</span>
                      <span className={`px-2 py-1 rounded-md ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="text-right mb-2">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="block text-lg font-bold text-gray-800">{lesson.progress}%</span>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        if (currentLesson?.id === lesson.id) {
                          togglePlayPause();
                        } else {
                          setCurrentLesson(lesson);
                          setIsPlaying(false);
                          setCurrentTime(0);
                        }
                      }}
                      className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200"
                    >
                      {currentLesson?.id === lesson.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Audio Lesson</span>
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      {currentLesson?.id === lesson.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                            <div 
                              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                seekTo(percentage * duration);
                              }}
                            >
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => seekTo(Math.max(0, currentTime - 10))}
                              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              <SkipBack className="w-4 h-4" />
                              <span>-10s</span>
                            </button>
                            <button
                              onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              <SkipForward className="w-4 h-4" />
                              <span>+10s</span>
                            </button>
                            <select
                              value={playbackRate}
                              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                              className="text-sm border border-gray-200 rounded px-2 py-1"
                            >
                              <option value={0.5}>0.5x</option>
                              <option value={0.75}>0.75x</option>
                              <option value={1}>1x</option>
                              <option value={1.25}>1.25x</option>
                              <option value={1.5}>1.5x</option>
                              <option value={2}>2x</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="w-0 h-full bg-green-500 rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Study Materials */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Study Materials</span>
                  </h4>
                  
                  <div className="grid gap-3">
                    {lesson.studyMaterials.map((material) => (
                      <div 
                        key={material.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              material.type === 'pdf' ? 'bg-red-100 text-red-600' :
                              material.type === 'doc' ? 'bg-blue-100 text-blue-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800">{material.title}</h5>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className="uppercase">{material.type}</span>
                                <span>•</span>
                                <span>{material.size}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openMaterial(material)}
                              className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadMaterial(material)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <BookmarkPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Audio Element */}
      {currentLesson && (
        <audio
          ref={audioRef}
          src={currentLesson.audioUrl}
          onLoadedData={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}