import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="bg-slate-900 dark:bg-slate-950 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
              <span className="text-4xl font-bold text-purple-400">404</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Page Not Found
            </h1>
            <p className="text-slate-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Link to="/dashboard">
            <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="hidden md:block relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M 0,400 C 150,450 350,350 500,400 L 500,00 L 0,0 Z" fill="url(#gradient404)" className="animate-pulse" opacity="0.3" />
              <path d="M 0,450 C 200,480 300,420 500,460 L 500,00 L 0,0 Z" fill="url(#gradient404)" opacity="0.4" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-center h-full p-12">
            <div className="text-center text-white">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-bold">404</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Lost in Space</h2>
              <p className="text-white/80 text-lg">
                This page seems to have wandered off. Let's get you back on track.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
