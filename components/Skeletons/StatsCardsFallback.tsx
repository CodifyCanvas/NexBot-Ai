import React from 'react'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';

const StatsCardsFallback = () => {
  return (
    <Card className="@container/card bg-blue-500/10 dark:bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none transition-all duration-300 animate-pulse">
        <CardHeader>
          <CardDescription>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </CardDescription>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </CardFooter>
      </Card>
  )
}

export default StatsCardsFallback