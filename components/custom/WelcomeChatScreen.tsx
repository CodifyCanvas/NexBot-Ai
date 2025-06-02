import React, { memo } from 'react';
import { Card } from '../ui/card';
import Image from 'next/image';
import { features, Images } from '@/constants/constants';
import { useUserContext } from '@/hooks/context/userContext';

const WelcomeChatScreen = () => {
  const { user } = useUserContext();

  return (
    <div className="w-full h-full flex justify-center p-2 transition duration-300">
      <div className="flex flex-col items-center gap-20 mt-6 transition duration-300">
        <div className="flex flex-col items-center text-center transition duration-300">
          <Image
            src={Images.main_logo_transparent}
            alt="Main Logo"
            width={100}
            height={100}
            className="h-20 w-20 sm:w-30 sm:h-30 md:w-36 md:h-36 transition duration-300"
            loading="lazy"
          />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent transition-all duration-300">
            Hi there, <span>{user?.name}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black/90 dark:text-white/90 transition-all duration-300">
            How can I help you today?
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 h-64 md:h-36 md:p-1 -mt-12 overflow-clip transition-all duration-300">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="w-60 p-4 h-fit flex flex-row-reverse md:flex-col justify-center md:items-start items-center rounded-lg bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none outline-1 outline-black/10 dark:outline-white/20 transition-all duration-300"
              >
                <h3 className="w-40 text-sm font-medium md:mb-5 text-gray-800 dark:text-white/90 transition-all duration-300">
                  {feature.title}
                </h3>
                <Icon size={20} className="text-gray-400 dark:text-white/70 transition-all duration-300" />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(WelcomeChatScreen);
