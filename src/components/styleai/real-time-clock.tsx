"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export function RealTimeClock() {
  const [date, setDate] = useState<Date | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    setDate(new Date());
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  return (
    <div className="hidden text-sm text-muted-foreground sm:block h-5 w-64">
      {date ? formatDate(date) : null}
    </div>
  );
}
