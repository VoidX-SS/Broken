"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export function RealTimeClock() {
  const [date, setDate] = useState<Date | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Set the initial date only on the client-side
    setDate(new Date());
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date: Date) => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    
    const timeString = new Intl.DateTimeFormat(locale, timeOptions).format(date);
    const dateString = new Intl.DateTimeFormat(locale, dateOptions).format(date);

    if (language === 'vi') {
        return `${timeString} tại ${dateString}`;
    }
    // For English or other languages
    return `${dateString}, ${timeString}`;
  };

  // Render a placeholder on the server and initial client render, 
  // then the actual time once the component has mounted.
  if (!date) {
    return <div className="hidden sm:block h-5 w-64" />;
  }

  return (
    <div className="hidden text-sm text-muted-foreground sm:block h-5 w-64">
      {formatDate(date)}
    </div>
  );
}
