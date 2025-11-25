import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-valo-red/10 to-transparent transform skew-x-12 translate-x-1/4"></div>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-valo-red uppercase border border-valo-red/30 bg-valo-red/10 rounded-full">
            Esports Analytics Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6 leading-tight">
            DOMINATE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-valo-red to-red-600">DATA GAME</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Access real-time performance metrics from the world's top Valorant professionals. 
            Analyze combat scores, K/D ratios, and playstyles across every competitive region.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/stats"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-valo-red rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-valo-red hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1"
            >
              Explore Player Stats
              <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a 
              href="https://vlr.gg" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 dark:text-white transition-all duration-200 bg-gray-200 dark:bg-white/10 rounded hover:bg-gray-300 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 backdrop-blur-sm"
            >
              Visit VLR.gg
            </a>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { title: "Global Coverage", desc: "Data from NA, EMEA, APAC, and all major competitive circuits." },
            { title: "Deep Analytics", desc: "Beyond K/D: Analyze KAST, ADR, First Bloods, and Clutch %." },
            { title: "Always Current", desc: "Synced with the latest tournament results from the last 90 days." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur hover:bg-white dark:hover:bg-white/10 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;