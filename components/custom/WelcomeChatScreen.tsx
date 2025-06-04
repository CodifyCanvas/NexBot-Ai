import React, { memo, useMemo } from 'react';
import { Card } from '../ui/card';
import Image from 'next/image';
import { features as featureList, Images } from '@/constants/constants';
import { useUserContext } from '@/hooks/context/userContext';
import Spinner from './Spinner';
import { CircleX } from 'lucide-react';

const WelcomeScreen = () => {
  const { user, loading, error } = useUserContext();

  const featureItems = useMemo(() => (
    featureList.map((item) => {
      const FeatureIcon = item.icon;
      return (
        <Card
          key={item.title}
          className="w-60 p-4 flex flex-row-reverse md:flex-col items-center md:items-start rounded-lg bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none"
        >
          <h3 className="w-40 text-sm font-medium md:mb-5 text-gray-800 dark:text-white/90">
            {item.title}
          </h3>
          <FeatureIcon size={20} className="text-gray-400 dark:text-white/70" />
        </Card>
      );
    })
  ), []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="scale-200">
          <Spinner variant="blue-gradient" />
        </div>
      </div>
    );
  }
  
  if (error) {
  return (
    <div className="w-full h-full flex items-center -mt-10 justify-center px-4">
      <div className="max-w-md w-full gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
        <CircleX size={40} />
        <h2 className="text-lg mt-3 font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-sm">
          We couldn’t load your info at the moment. Please refresh the page or come back later.
          If the issue continues, reach out to our support team.
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="w-full h-full flex justify-center p-2">
      <div className="flex flex-col items-center gap-20 mt-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={Images.main_logo_transparent}
            alt="Logo"
            width={100}
            height={100}
            className="h-20 w-20 sm:w-30 sm:h-30 md:w-36 md:h-36"
            loading="lazy"
          />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
            Hi there, <span>{user?.name}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black/90 dark:text-white/90">
            How can I help you today?
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-wrap fade-up justify-center gap-4 h-64 md:h-36 md:p-1 -mt-12 overflow-clip">
          {featureItems}
        </div>
      </div>
    </div>
  );
};

export default memo(WelcomeScreen);
