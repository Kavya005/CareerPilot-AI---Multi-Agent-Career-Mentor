
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import {
  Rocket,
  FileText,
  Target,
  Brain,
  Database,
  MessageSquare,
  Map,
  Mic,
  Upload,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Download,
  Check,
  AlertCircle,
  TrendingUp,
  Award,
  Briefcase,
  Code,
  Users,
  Settings,
  BarChart3,
  BookOpen,
  Zap,
  Star,
  Clock,
  ArrowRight,
  Play,
  Loader2,
  Building2,
  Sparkles,
  Shield,
  Lightbulb,
  GraduationCap,
  Layers,
  FileSearch,
  Bot,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Github,
} from 'lucide-react';

// Configure PDF.js worker


// Types
type Page = 'landing' | 'dashboard';
type DashboardView = 'home' | 'upload' | 'analysis' | 'interview' | 'roadmap' | 'reports' | 'settings';

interface AnalysisResult {
  resume_analysis: {
    strengths: string[];
    weaknesses: string[];
    projects: string[];
    experience_summary: string;
    extracted_skills: string[];
  };
  ats_score: {
    overall: number;
    sections: { name: string; score: number }[];
    suggestions: string[];
  };
  skill_gap: {
    current_skills: string[];
    missing_skills: string[];
    recommended_skills: string[];
    match_percentage: number;
  };
  interview_questions: {
    technical: string[];
    coding: string[];
    behavioral: string[];
    hr: string[];
    project: string[];
    system_design: string[];
  };
  learning_roadmap: {
    week: number;
    title: string;
    topics: string[];
    goals: string[];
  }[];
  rag_resources: {
    company_experiences: string[];
    resume_tips: string[];
    dsa_notes: string[];
    hr_questions: string[];
    preparation_material: string[];
  };
  career_report: {
    readiness_score: number;
    recommendations: string[];
    summary: string;
  };
}

// Constants
const COMPANIES = [
  'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple', 'Adobe', 'Oracle',
  'NVIDIA', 'Netflix', 'TCS', 'Infosys', 'Accenture', 'Capgemini', 'Wipro', 'Cognizant'
];

const JOB_ROLES = [
  'Software Engineer', 'Data Scientist', 'AI Engineer', 'Backend Developer',
  'Cloud Engineer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Machine Learning Engineer', 'Product Manager'
];

const FEATURES = [
  { icon: FileText, title: 'Resume Analysis', description: 'Analyze resumes and identify strengths and weaknesses.' },
  { icon: Target, title: 'ATS Resume Score', description: 'Improve resume compatibility with Applicant Tracking Systems.' },
  { icon: Brain, title: 'Skill Gap Analysis', description: 'Compare candidate skills with company requirements.' },
  { icon: Database, title: 'RAG Knowledge Base', description: 'Retrieve trusted interview experiences, company questions, DSA notes, and resume tips.' },
  { icon: MessageSquare, title: 'Interview Preparation', description: 'Generate personalized technical, coding, HR, behavioral, and project-based interview questions.' },
  { icon: Map, title: 'Learning Roadmap', description: 'Generate a customized learning plan based on the candidate\'s profile.' },
  { icon: Mic, title: 'Voice Assistant', description: 'Voice interaction for a natural mentoring experience.', comingSoon: true },
];

const mockAnalysisResult: AnalysisResult = {
  resume_analysis: {
    strengths: [
      'Strong project portfolio showcasing full-stack development skills',
      'Quantified achievements with measurable impact (40% performance improvement)',
      'Clear technical skills progression from junior to senior level',
      'Well-structured experience section with action verbs'
    ],
    weaknesses: [
      'Missing keywords for ATS optimization (CI/CD, Microservices)',
      'Summary section lacks specific value proposition',
      'Limited open-source contributions highlighted',
      'Education section could include relevant certifications'
    ],
    projects: [
      'E-Commerce Platform (React, Node.js, MongoDB) - 40% performance improvement',
      'Real-time Chat Application (WebSocket, Redis) - 10k concurrent users',
      'ML Pipeline Dashboard (Python, TensorFlow) - 95% accuracy model deployment'
    ],
    experience_summary: '5+ years of progressive software engineering experience across full-stack development, cloud architecture, and ML systems. Demonstrated leadership in mentoring junior developers and driving technical initiatives.',
    extracted_skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Git', 'CI/CD', 'Agile']
  },
  ats_score: {
    overall: 78,
    sections: [
      { name: 'Contact Info', score: 100 },
      { name: 'Summary', score: 65 },
      { name: 'Experience', score: 85 },
      { name: 'Skills', score: 80 },
      { name: 'Education', score: 70 },
      { name: 'Projects', score: 90 }
    ],
    suggestions: [
      'Add more industry-specific keywords like "Microservices", "Kubernetes", "System Design"',
      'Include metrics and achievements in the summary section',
      'Add certifications section with relevant cloud certifications',
      'Optimize formatting for ATS parsing - avoid tables and columns'
    ]
  },
  skill_gap: {
    current_skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git'],
    missing_skills: ['Kubernetes', 'System Design', 'Distributed Systems', 'gRPC', 'Apache Kafka', 'Redis', 'Terraform'],
    recommended_skills: ['System Design', 'Distributed Systems', 'Kubernetes', 'Apache Kafka', 'gRPC'],
    match_percentage: 72
  },
  interview_questions: {
    technical: [
      'Explain the difference between process and thread in operating systems.',
      'How does a CDN work and what are its benefits?',
      'What is the CAP theorem and how does it apply to distributed systems?',
      'Explain the workings of garbage collection in JavaScript.',
      'What is database indexing and how does it improve query performance?'
    ],
    coding: [
      'Implement a LRU Cache with O(1) get and put operations.',
      'Given an array of integers, find the longest increasing subsequence.',
      'Design a data structure that supports insert, delete, and getRandom in O(1).',
      'Implement a rate limiter for API requests.',
      'Given a binary tree, find the lowest common ancestor of two nodes.'
    ],
    behavioral: [
      'Tell me about a time you had to work with a difficult team member.',
      'Describe a project where you had to learn a new technology quickly.',
      'How do you handle tight deadlines and competing priorities?',
      'Tell me about a mistake you made and how you handled it.',
      'Describe a situation where you had to convince others of your approach.'
    ],
    hr: [
      'Why do you want to work at Google?',
      'Where do you see yourself in 5 years?',
      'What are your salary expectations?',
      'Why are you leaving your current position?',
      'What motivates you in your work?'
    ],
    project: [
      'Walk me through your most challenging project technically.',
      'How did you handle scalability in your e-commerce platform?',
      'What trade-offs did you make in your chat application architecture?',
      'If you could rebuild any of your projects, what would you change?',
      'How did you measure success in your ML pipeline dashboard?'
    ],
    system_design: [
      'Design a URL shortening service like bit.ly.',
      'Design a real-time collaborative document editor.',
      'Design a notification system for a social media platform.',
      'Design a distributed cache system.',
      'Design a ride-sharing service like Uber.'
    ]
  },
  learning_roadmap: [
    {
      week: 1,
      title: 'System Design Fundamentals',
      topics: ['Scalability basics', 'Load balancing', 'Database sharding', 'Caching strategies'],
      goals: ['Complete system design basics course', 'Design 2 simple systems', 'Learn architectural patterns']
    },
    {
      week: 2,
      title: 'Advanced Data Structures & Algorithms',
      topics: ['Advanced trees', 'Graph algorithms', 'Dynamic programming', 'String algorithms'],
      goals: ['Solve 50 medium LeetCode problems', 'Implement 5 advanced data structures', 'Time-limited problem solving']
    },
    {
      week: 3,
      title: 'Distributed Systems Deep Dive',
      topics: ['Consensus algorithms', 'Event-driven architecture', 'Message queues', 'Microservices patterns'],
      goals: ['Build a distributed system project', 'Study CAP theorem implementations', 'Learn messaging patterns']
    },
    {
      week: 4,
      title: 'Cloud & DevOps Mastery',
      topics: ['Kubernetes orchestration', 'CI/CD pipelines', 'Infrastructure as Code', 'Monitoring & observability'],
      goals: ['Deploy app to production with K8s', 'Set up complete CI/CD', 'Implement monitoring dashboard']
    }
  ],
  rag_resources: {
    company_experiences: [
      'Google interviews focus heavily on algorithms and system design. Expect 2-3 coding rounds followed by system design.',
      'Behavioral interviews at Google assess "Googliness" - problem-solving attitude, leadership, and cultural fit.',
      'Amazon uses STAR method for behavioral questions - prepare stories for each leadership principle.',
      'Meta interviews include coding, system design, and behavioral - practice explaining your thought process.',
    ],
    resume_tips: [
      'Use action verbs and quantify achievements for maximum impact.',
      'Tailor resume keywords to match job description for ATS optimization.',
      'Keep resume to 1 page for <10 years experience, 2 pages max.',
      'Include a projects section with measurable outcomes.',
    ],
    dsa_notes: [
      'Master graphs, trees, and dynamic programming for tech interviews.',
      'Time-complexity analysis is crucial - practice Big-O estimation.',
      'Focus on clean code and edge case handling during coding interviews.',
      'Practice explaining your approach out loud while coding.',
    ],
    hr_questions: [
      'Research company values and culture before the interview.',
      'Prepare specific examples for common behavioral questions.',
      'Ask thoughtful questions about the role and team.',
      'Send a personalized thank-you note within 24 hours.',
    ],
    preparation_material: [
      'Complete "System Design Interview" by Alex Xu.',
      'Practice 150+ LeetCode problems focusing on patterns.',
      'Mock interviews with peers or on Pramp platform.',
      'Study company engineering blogs for technical insights.',
    ]
  },
  career_report: {
    readiness_score: 76,
    recommendations: [
      'Focus on system design preparation for senior-level positions',
      'Add cloud certifications (AWS Solutions Architect, GCP)',
      'Contribute to open-source projects to strengthen portfolio',
      'Practice mock interviews weekly leading up to interviews',
      'Build a strong LinkedIn presence and network with engineers'
    ],
    summary: 'You have a strong foundation in software engineering with demonstrable full-stack experience. To advance to top-tier FAANG companies, focus on system design, distributed systems, and leadership examples. Your current readiness level positions you well for mid-senior roles at major tech companies.'
  }
};

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [view, setView] = useState<DashboardView>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeQuestionTab, setActiveQuestionTab] = useState<'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design'>('technical');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      setUploadedFile(file);
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setUploadedFile(file);
      setError(null);
    }
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const parseApiResponse = (responseText: string): AnalysisResult => {
    try {
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch {
      // If not JSON, create a simple response structure
      return {
        resume_analysis: {
          strengths: ['Resume processed successfully'],
          weaknesses: [],
          projects: [],
          experience_summary: responseText.substring(0, 500),
          extracted_skills: [],
        },
        ats_score: {
          overall: 75,
          sections: [
            { name: 'Overall', score: 75 },
          ],
          suggestions: ['Analysis completed from backend'],
        },
        skill_gap: {
          current_skills: [],
          missing_skills: [],
          recommended_skills: [],
          match_percentage: 75,
        },
        interview_questions: {
          technical: ['Backend analysis completed - see full response'],
          coding: [],
          behavioral: [],
          hr: [],
          project: [],
          system_design: [],
        },
        learning_roadmap: [],
        rag_resources: {
          company_experiences: [responseText.substring(0, 1000)],
          resume_tips: [],
          dsa_notes: [],
          hr_questions: [],
          preparation_material: [],
        },
        career_report: {
          readiness_score: 75,
          recommendations: ['Review full analysis for detailed recommendations'],
          summary: responseText.substring(0, 500),
        },
      };
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !targetCompany || !targetRole) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const resumeText = await extractPdfText(uploadedFile);

      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: targetCompany,
          target_role: targetRole,
          resume_text: resumeText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = parseApiResponse(data.response || JSON.stringify(data));

      setAnalysisResult(result);
      setView('analysis');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {page === 'landing' ? (
        <LandingPage
          onGetStarted={() => setPage('dashboard')}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <Dashboard
          view={view}
          setView={setView}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          targetCompany={targetCompany}
          setTargetCompany={setTargetCompany}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          handleFileDrop={handleFileDrop}
          handleFileSelect={handleFileSelect}
          handleAnalyze={handleAnalyze}
          activeQuestionTab={activeQuestionTab}
          setActiveQuestionTab={setActiveQuestionTab}
          expandedQuestion={expandedQuestion}
          setExpandedQuestion={setExpandedQuestion}
          onBackToLanding={() => setPage('landing')}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
}

function LandingPage({
  onGetStarted,
  darkMode,
  toggleDarkMode
}: {
  onGetStarted: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-dark-950 dark:via-dark-900 dark:to-primary-950/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">CareerPilot AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-dark-200" /> : <Moon className="w-5 h-5 text-dark-700" />}
              </button>
              <button onClick={onGetStarted} className="btn-primary text-sm px-4 py-2">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Powered by CrewAI & RAG
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-dark-900 dark:text-white mb-6 leading-tight">
                <span className="flex items-center gap-3 mb-2">
                  <Rocket className="w-10 h-10 text-primary-500" />
                  CareerPilot AI
                </span>
                <span className="gradient-text">Your Intelligent</span>
                <br />
                Multi-Agent Career Mentor
              </h1>
              <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 leading-relaxed">
                Upload your resume, choose your dream company or job role, and receive personalized resume analysis,
                ATS optimization, skill gap detection, interview preparation, company-specific guidance, and a
                customized learning roadmap generated by collaborative AI agents.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={onGetStarted} className="btn-primary text-base px-8 py-4">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="btn-secondary text-base px-8 py-4">
                  <Play className="w-5 h-5 mr-2" /> Learn More
                </button>
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm text-dark-600 dark:text-dark-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>AI-powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative animate-fade-in animate-delay-200">
              <div className="relative z-10">
                <div className="glass-card p-8 card-hover">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Bot, label: 'Resume Agent', color: 'from-blue-500 to-cyan-500' },
                      { icon: Brain, label: 'Skill Agent', color: 'from-violet-500 to-purple-500' },
                      { icon: MessageCircle, label: 'Interview Agent', color: 'from-emerald-500 to-green-500' },
                      { icon: Map, label: 'Roadmap Agent', color: 'from-orange-500 to-amber-500' },
                    ].map((agent, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-dark-50 to-white dark:from-dark-800 dark:to-dark-900 border border-dark-100 dark:border-dark-700 transition-transform hover:scale-105"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                          <agent.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-dark-700 dark:text-dark-200">{agent.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200/50 dark:border-primary-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-dark-800 dark:text-white">Multi-Agent Collaboration</span>
                    </div>
                    <p className="text-sm text-dark-600 dark:text-dark-300">
                      Our AI agents work together to provide comprehensive career guidance tailored to your goals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full blur-2xl opacity-30 animate-pulse-slow" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-accent-400 to-primary-500 rounded-full blur-2xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-50/50 dark:to-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Powerful Features for Your <span className="gradient-text">Career Success</span>
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Our suite of AI-powered tools helps you at every step of your career journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 card-hover group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  feature.comingSoon
                    ? 'bg-dark-200 dark:bg-dark-700'
                    : 'bg-gradient-to-br from-primary-500 to-accent-500'
                }`}>
                  <feature.icon className={`w-7 h-7 ${feature.comingSoon ? 'text-dark-500' : 'text-white'}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{feature.title}</h3>
                  {feature.comingSoon && (
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-600 dark:text-dark-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Dashboard({
  view,
  setView,
  darkMode,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  uploadedFile,
  setUploadedFile,
  targetCompany,
  setTargetCompany,
  targetRole,
  setTargetRole,
  isAnalyzing,
  analysisResult,
  handleFileDrop,
  handleFileSelect,
  handleAnalyze,
  activeQuestionTab,
  setActiveQuestionTab,
  expandedQuestion,
  setExpandedQuestion,
  onBackToLanding,
  error,
  setError
}: {
  view: DashboardView;
  setView: (v: DashboardView) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  uploadedFile: File | null;
  setUploadedFile: (f: File | null) => void;
  targetCompany: string;
  setTargetCompany: (c: string) => void;
  targetRole: string;
  setTargetRole: (r: string) => void;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  handleFileDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: () => void;
  activeQuestionTab: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design';
  setActiveQuestionTab: (t: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design') => void;
  expandedQuestion: number | null;
  setExpandedQuestion: (q: number | null) => void;
  onBackToLanding: () => void;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Resume Upload', icon: Upload },
    { id: 'analysis', label: 'Analysis', icon: FileSearch },
    { id: 'interview', label: 'Interview Questions', icon: MessageSquare },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    if (isAnalyzing) {
      return <LoadingScreen />;
    }

    switch (view) {
      case 'home':
        return <HomeDashboard analysisResult={analysisResult} setView={setView} />;
      case 'upload':
        return (
          <UploadSection
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            targetCompany={targetCompany}
            setTargetCompany={setTargetCompany}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            handleFileDrop={handleFileDrop}
            handleFileSelect={handleFileSelect}
            handleAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            error={error}
            setError={setError}
          />
        );
      case 'analysis':
        return analysisResult ? (
          <AnalysisSection
            analysisResult={analysisResult}
            activeQuestionTab={activeQuestionTab}
            setActiveQuestionTab={setActiveQuestionTab}
            expandedQuestion={expandedQuestion}
            setExpandedQuestion={setExpandedQuestion}
          />
        ) : (
          <NoDataState onView="Upload Resume" setView={setView} targetView="upload" />
        );
      case 'interview':
        return analysisResult ? (
          <InterviewSection
            questions={analysisResult.interview_questions}
            activeQuestionTab={activeQuestionTab}
            setActiveQuestionTab={setActiveQuestionTab}
            expandedQuestion={expandedQuestion}
            setExpandedQuestion={setExpandedQuestion}
          />
        ) : (
          <NoDataState onView="Upload Resume" setView={setView} targetView="upload" />
        );
      case 'roadmap':
        return analysisResult ? (
          <RoadmapSection roadmap={analysisResult.learning_roadmap} />
        ) : (
          <NoDataState onView="Upload Resume" setView={setView} targetView="upload" />
        );
      case 'reports':
        return analysisResult ? (
          <ReportsSection report={analysisResult.career_report} />
        ) : (
          <NoDataState onView="Upload Resume" setView={setView} targetView="upload" />
        );
      case 'settings':
        return <SettingsSection darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:block`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-800">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-display font-bold gradient-text">CareerPilot</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as DashboardView)}
                className={`w-full sidebar-item ${view === item.id ? 'sidebar-item-active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-dark-200 dark:border-dark-800">
            <button
              onClick={onBackToLanding}
              className={`w-full sidebar-item ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <X className="w-5 h-5" />
              {sidebarOpen && <span>Back to Home</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-dark-800/50">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold gradient-text">CareerPilot</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-dark-200" /> : <Moon className="w-5 h-5 text-dark-700" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-900 p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-display font-bold gradient-text">CareerPilot</span>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id as DashboardView);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full sidebar-item ${view === item.id ? 'sidebar-item-active' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8">{renderContent()}</main>

        <Footer />
      </div>
    </div>
  );
}

// Sub-components
function HomeDashboard({
  analysisResult,
  setView
}: {
  analysisResult: AnalysisResult | null;
  setView: (v: DashboardView) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Your AI-powered career journey starts here.
          </p>
        </div>
        <button onClick={() => setView('upload')} className="btn-primary">
          <Upload className="w-4 h-4 mr-2" /> New Analysis
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Resume Analysis', value: analysisResult ? 'Completed' : 'Pending', color: 'from-blue-500 to-blue-600' },
          { icon: Target, label: 'ATS Score', value: analysisResult ? `${analysisResult.ats_score.overall}%` : '--', color: 'from-green-500 to-green-600' },
          { icon: Brain, label: 'Skill Match', value: analysisResult ? `${analysisResult.skill_gap.match_percentage}%` : '--', color: 'from-violet-500 to-purple-600' },
          { icon: Award, label: 'Readiness', value: analysisResult ? `${analysisResult.career_report.readiness_score}%` : '--', color: 'from-orange-500 to-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 card-hover">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400">{stat.label}</p>
            <p className="text-2xl font-bold text-dark-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {analysisResult && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {analysisResult.resume_analysis.strengths.slice(0, 3).map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-dark-700 dark:text-dark-300">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {analysisResult.resume_analysis.weaknesses.slice(0, 3).map((weakness, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-dark-700 dark:text-dark-300">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!analysisResult && (
        <div className="glass-card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Get Started with Your Analysis
          </h3>
          <p className="text-dark-600 dark:text-dark-400 mb-6 max-w-md mx-auto">
            Upload your resume and select your target company to receive personalized insights powered by AI.
          </p>
          <button onClick={() => setView('upload')} className="btn-primary">
            Upload Resume
          </button>
        </div>
      )}
    </div>
  );
}

function UploadSection({
  uploadedFile,
  setUploadedFile,
  targetCompany,
  setTargetCompany,
  targetRole,
  setTargetRole,
  handleFileDrop,
  handleFileSelect,
  handleAnalyze,
  isAnalyzing,
  error,
  setError
}: {
  uploadedFile: File | null;
  setUploadedFile: (f: File | null) => void;
  targetCompany: string;
  setTargetCompany: (c: string) => void;
  targetRole: string;
  setTargetRole: (r: string) => void;
  handleFileDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
          Upload Your Resume
        </h1>
        <p className="text-dark-600 dark:text-dark-400">
          Let our AI agents analyze your resume and provide personalized insights.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="glass-card p-8">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            uploadedFile
              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              : 'border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            {uploadedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-medium text-dark-900 dark:text-white">{uploadedFile.name}</p>
                <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                  Click to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary-500" />
                </div>
                <p className="font-medium text-dark-900 dark:text-white">
                  Drag and drop your PDF here
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                  or click to browse
                </p>
              </div>
            )}
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Target Company
            </label>
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="input-field"
            >
              <option value="">Select a company</option>
              {COMPANIES.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Target Job Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer, Data Scientist"
              list="job-roles"
              className="input-field"
            />
            <datalist id="job-roles">
              {JOB_ROLES.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!uploadedFile || !targetCompany || !targetRole || isAnalyzing}
          className={`w-full mt-6 btn-primary ${( !uploadedFile || !targetCompany || !targetRole || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  const agents = [
    { name: 'Resume Analyzer', icon: FileText },
    { name: 'ATS Evaluator', icon: Target },
    { name: 'Skill Gap Detector', icon: Brain },
    { name: 'Question Generator', icon: MessageSquare },
    { name: 'Roadmap Planner', icon: Map },
  ];

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="glass-card p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Our AI Agents are Collaborating...
          </h2>
          <p className="text-dark-400 mb-8">
            Processing your resume through multiple specialized agents
          </p>

          <div className="space-y-3">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                  <agent.icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-sm text-dark-300">{agent.name}</span>
                <Loader2 className="w-4 h-4 text-primary-500 ml-auto animate-spin" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({
  analysisResult,
  activeQuestionTab,
  setActiveQuestionTab,
  expandedQuestion,
  setExpandedQuestion
}: {
  analysisResult: AnalysisResult;
  activeQuestionTab: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design';
  setActiveQuestionTab: (t: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design') => void;
  expandedQuestion: number | null;
  setExpandedQuestion: (q: number | null) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Analysis Results
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ResumeAnalysisCard data={analysisResult.resume_analysis} />
        <ATSScoreCard data={analysisResult.ats_score} />
        <SkillGapCard data={analysisResult.skill_gap} />
        <InterviewQuestionsCard
          questions={analysisResult.interview_questions}
          activeTab={activeQuestionTab}
          setActiveTab={setActiveQuestionTab}
          expandedQuestion={expandedQuestion}
          setExpandedQuestion={setExpandedQuestion}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <LearningRoadmapCard roadmap={analysisResult.learning_roadmap} />
        <RAGResourcesCard resources={analysisResult.rag_resources} />
      </div>

      <CareerReportCard report={analysisResult.career_report} />
    </div>
  );
}

function ResumeAnalysisCard({ data }: { data: AnalysisResult['resume_analysis'] }) {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Resume Analysis</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
            <Check className="w-4 h-4" /> Strengths
          </h4>
          <ul className="space-y-2">
            {data.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-dark-700 dark:text-dark-300 pl-6 relative">
                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-green-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Weaknesses
          </h4>
          <ul className="space-y-2">
            {data.weaknesses.map((weakness, i) => (
              <li key={i} className="text-sm text-dark-700 dark:text-dark-300 pl-6 relative">
                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-500" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Experience Summary
          </h4>
          <p className="text-sm text-dark-600 dark:text-dark-400 bg-dark-50 dark:bg-dark-800/50 rounded-lg p-3">
            {data.experience_summary}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" /> Extracted Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.extracted_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ATSScoreCard({ data }: { data: AnalysisResult['ats_score'] }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (data.overall / 100) * circumference;

  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">ATS Resume Score</h3>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="120" height="120" className="progress-ring">
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-dark-200 dark:text-dark-700"
            />
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="url(#atsGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-dark-900 dark:text-white">{data.overall}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.sections.map((section, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-dark-600 dark:text-dark-400">{section.name}</span>
              <span className="font-medium text-dark-900 dark:text-white">{section.score}%</span>
            </div>
            <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${section.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-dark-50 dark:bg-dark-800/50 rounded-lg">
        <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Suggestions</h4>
        <ul className="space-y-1">
          {data.suggestions.map((suggestion, i) => (
            <li key={i} className="text-xs text-dark-600 dark:text-dark-400 flex items-start gap-2">
              <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillGapCard({ data }: { data: AnalysisResult['skill_gap'] }) {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Skill Gap Analysis</h3>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold gradient-text mb-1">{data.match_percentage}%</div>
          <p className="text-sm text-dark-600 dark:text-dark-400">Skill Match</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Current Skills</h4>
          <div className="flex flex-wrap gap-2">
            {data.current_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">Recommended Skills</h4>
          <div className="flex flex-wrap gap-2">
            {data.recommended_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewQuestionsCard({
  questions,
  activeTab,
  setActiveTab,
  expandedQuestion,
  setExpandedQuestion
}: {
  questions: AnalysisResult['interview_questions'];
  activeTab: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design';
  setActiveTab: (t: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design') => void;
  expandedQuestion: number | null;
  setExpandedQuestion: (q: number | null) => void;
}) {
  const tabs = [
    { id: 'technical', label: 'Technical' },
    { id: 'coding', label: 'Coding' },
    { id: 'behavioral', label: 'Behavioral' },
    { id: 'hr', label: 'HR' },
    { id: 'project', label: 'Project' },
    { id: 'system_design', label: 'System Design' },
  ] as const;

  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Interview Questions</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {questions[activeTab].map((question, i) => (
          <div
            key={i}
            className="border border-dark-200 dark:border-dark-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <span className="text-sm text-dark-700 dark:text-dark-300 line-clamp-1">
                {question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-dark-500 transition-transform ${
                  expandedQuestion === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedQuestion === i && (
              <div className="p-3 bg-dark-50 dark:bg-dark-800/50 border-t border-dark-200 dark:border-dark-700">
                <p className="text-sm text-dark-600 dark:text-dark-400">{question}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningRoadmapCard({ roadmap }: { roadmap: AnalysisResult['learning_roadmap'] }) {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Map className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Learning Roadmap</h3>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

        <div className="space-y-4">
          {roadmap.map((week, i) => (
            <div key={i} className="relative pl-10">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white dark:bg-dark-800 border-2 border-primary-500 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-500">{week.week}</span>
              </div>

              <div className="p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl">
                <h4 className="font-medium text-dark-900 dark:text-white mb-2">{week.title}</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {week.topics.map((topic, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <ul className="space-y-1">
                  {week.goals.map((goal, j) => (
                    <li key={j} className="text-xs text-dark-600 dark:text-dark-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RAGResourcesCard({ resources }: { resources: AnalysisResult['rag_resources'] }) {
  const sections = [
    { title: 'Company Experiences', data: resources.company_experiences, icon: Building2 },
    { title: 'Resume Tips', data: resources.resume_tips, icon: FileText },
    { title: 'DSA Notes', data: resources.dsa_notes, icon: Code },
    { title: 'HR Questions', data: resources.hr_questions, icon: Users },
    { title: 'Preparation Material', data: resources.preparation_material, icon: BookOpen },
  ];

  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">RAG Resources</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
        {sections.map((section, i) => (
          <div key={i} className="p-3 bg-dark-50 dark:bg-dark-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
              <section.icon className="w-4 h-4 text-primary-500" />
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.data.map((item, j) => (
                <li key={j} className="text-xs text-dark-600 dark:text-dark-400 pl-4 relative">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerReportCard({ report }: { report: AnalysisResult['career_report'] }) {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Final Career Report</h3>
        </div>
        <button className="btn-secondary text-sm px-4 py-2">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="160" height="160" className="progress-ring">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-dark-200 dark:text-dark-700"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="url(#reportGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 - (report.readiness_score / 100) * 2 * Math.PI * 60}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="reportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-dark-900 dark:text-white">{report.readiness_score}%</span>
            <span className="text-sm text-dark-600 dark:text-dark-400">Overall Readiness</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl mb-4">
        <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Summary</h4>
        <p className="text-sm text-dark-600 dark:text-dark-400">{report.summary}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-dark-50 dark:bg-dark-800/50 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-dark-600 dark:text-dark-400">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InterviewSection({
  questions,
  activeQuestionTab,
  setActiveQuestionTab,
  expandedQuestion,
  setExpandedQuestion
}: {
  questions: AnalysisResult['interview_questions'];
  activeQuestionTab: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design';
  setActiveQuestionTab: (t: 'technical' | 'coding' | 'behavioral' | 'hr' | 'project' | 'system_design') => void;
  expandedQuestion: number | null;
  setExpandedQuestion: (q: number | null) => void;
}) {
  const tabs = [
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'coding', label: 'Coding', icon: Code },
    { id: 'behavioral', label: 'Behavioral', icon: Users },
    { id: 'hr', label: 'HR', icon: Users },
    { id: 'project', label: 'Project', icon: Layers },
    { id: 'system_design', label: 'System Design', icon: Layers },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Interview Questions
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveQuestionTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              activeQuestionTab === tab.id
                ? 'gradient-bg text-white shadow-lg shadow-primary-500/25'
                : 'glass-card hover:shadow-lg'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {questions[activeQuestionTab].map((question, i) => (
          <div
            key={i}
            className="glass-card overflow-hidden card-hover"
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
              className="w-full flex items-start justify-between p-5 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{i + 1}</span>
                </div>
                <p className="text-sm text-dark-700 dark:text-dark-300 line-clamp-2">{question}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-dark-500 transition-transform flex-shrink-0 mt-1 ${
                  expandedQuestion === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedQuestion === i && (
              <div className="p-5 pt-0 border-t border-dark-200 dark:border-dark-700">
                <p className="text-dark-700 dark:text-dark-300">{question}</p>
                <div className="flex gap-2 mt-4">
                  <button className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:opacity-80 transition-opacity">
                    Mark as Prepared
                  </button>
                  <button className="text-xs px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg hover:opacity-80 transition-opacity">
                    Need Practice
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapSection({ roadmap }: { roadmap: AnalysisResult['learning_roadmap'] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
            Learning Roadmap
          </h1>
          <p className="text-dark-600 dark:text-dark-400">Your personalized learning journey</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {roadmap.map((week, i) => (
          <div
            key={i}
            className="glass-card p-6 card-hover animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-xl font-bold text-white">{week.week}</span>
              </div>
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Week {week.week}</p>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{week.title}</h3>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {week.topics.map((topic, j) => (
                  <span
                    key={j}
                    className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Goals
              </h4>
              <ul className="space-y-2">
                {week.goals.map((goal, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                    <Check className="w-4 h-4 text-green-500" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsSection({ report }: { report: AnalysisResult['career_report'] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Career Reports
        </h1>
        <button className="btn-primary">
          <Download className="w-4 h-4 mr-2" /> Download Full Report
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg width="192" height="192" className="progress-ring">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-dark-200 dark:text-dark-700"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="url(#fullGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 - (report.readiness_score / 100) * 2 * Math.PI * 80}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="fullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold gradient-text">{report.readiness_score}%</span>
              <span className="text-dark-600 dark:text-dark-400">Overall Readiness</span>
            </div>
          </div>

          <h2 className="text-xl font-display font-bold text-dark-900 dark:text-white mb-2">
            Career Readiness Score
          </h2>
          <p className="text-dark-600 dark:text-dark-400 max-w-md mx-auto">
            Based on your resume analysis, skill gap assessment, and interview preparation.
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" /> Key Recommendations
          </h3>
          <ul className="space-y-4">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-4 p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{i + 1}</span>
                </div>
                <p className="text-dark-700 dark:text-dark-300">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Summary</h3>
        <p className="text-dark-700 dark:text-dark-300 leading-relaxed">{report.summary}</p>
      </div>
    </div>
  );
}

function SettingsSection({
  darkMode,
  toggleDarkMode
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Settings</h1>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="font-medium text-dark-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">Toggle dark theme</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-7 rounded-full transition-colors relative ${
              darkMode ? 'bg-primary-500' : 'bg-dark-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Notifications</h2>
        <div className="space-y-3">
          {['Email notifications', 'Learning reminders', 'Weekly progress reports'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl">
              <span className="text-dark-700 dark:text-dark-300">{item}</span>
              <button className="w-14 h-7 rounded-full bg-primary-500 relative">
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Account</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-dark-50 dark:bg-dark-800/50 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
            <p className="font-medium text-dark-900 dark:text-white">Update Profile</p>
            <p className="text-sm text-dark-600 dark:text-dark-400">Manage your personal information</p>
          </button>
          <button className="w-full text-left p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
            <p className="text-sm text-red-500 dark:text-red-400/70">Permanently delete your account</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function NoDataState({
  onView,
  setView,
  targetView
}: {
  onView: string;
  setView: (v: DashboardView) => void;
  targetView: DashboardView;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-6">
        <FileSearch className="w-12 h-12 text-primary-500" />
      </div>
      <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">No Data Available</h2>
      <p className="text-dark-600 dark:text-dark-400 mb-6 text-center max-w-md">
        Upload your resume and run an analysis to see insights here.
      </p>
      <button onClick={() => setView(targetView)} className="btn-primary">
        {onView}
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-dark-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">CareerPilot AI</span>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              Your intelligent multi-agent career mentor powered by cutting-edge AI technology.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
              >
                <Github className="w-5 h-5 text-dark-600 dark:text-dark-400" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 dark:text-white mb-4">Built Using</h4>
            <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> CrewAI</li>
              <li className="flex items-center gap-2"><Code className="w-4 h-4 text-green-500" /> FastAPI</li>
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-500" /> Gemini AI</li>
              <li className="flex items-center gap-2"><Database className="w-4 h-4 text-violet-500" /> RAG</li>
              <li className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500" /> ChromaDB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
              <li>Resume Analysis</li>
              <li>ATS Optimization</li>
              <li>Skill Gap Detection</li>
              <li>Interview Prep</li>
              <li>Learning Roadmap</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-200 dark:border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-600 dark:text-dark-400">
            2024 CareerPilot AI. All rights reserved.
          </p>
          <button className="btn-secondary text-sm px-4 py-2">
            <Github className="w-4 h-4 mr-2" /> View on GitHub
          </button>
        </div>
      </div>
    </footer>
  );
}
