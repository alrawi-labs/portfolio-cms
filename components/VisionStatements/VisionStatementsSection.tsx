"use client";

import TextAnimation from '@/components/ui/scroll-text';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

function VisionStatements() {
  const t = useTranslations('vision');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const statements = [
    {
      text: t('statements.0.text'),
      variants: {
        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
        visible: {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          transition: { ease: 'linear' },
        },
      },
      className: `text-4xl sm:text-5xl md:text-6xl xl:text-8xl max-w-4xl mx-auto font-bold capitalize text-text leading-tight ${isRTL ? 'rtl' : ''}`,
      containerClass: 'h-[80vh] flex flex-col justify-center items-center text-center'
    },
    {
      text: t('statements.1.text'),
      letterAnime: !isRTL, // Arapça için letterAnime'yi kapat
      variants: {
        hidden: { filter: 'blur(4px)', opacity: 0, y: 20 },
        visible: {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.2,
          },
        },
      },
      as: 'p' as const,
      className: `text-3xl sm:text-4xl md:text-5xl xl:text-7xl max-w-3xl lowercase text-text font-bold ${isRTL ? 'rtl' : ''}`,
      containerClass: 'h-[80vh] flex items-center text-left'
    },
    {
      text: t('statements.2.text'),
      direction: 'right' as const,
      className: `text-3xl sm:text-4xl md:text-5xl xl:text-7xl max-w-3xl ml-auto capitalize text-text font-bold ${isRTL ? 'rtl' : ''}`,
      containerClass: 'h-[80vh] flex justify-center items-center text-right'
    },
    {
      text: t('statements.3.text'),
      direction: 'down' as const,
      lineAnime: !isRTL, // Arapça için lineAnime'yi kapat
      className: `text-3xl sm:text-4xl md:text-5xl xl:text-7xl max-w-3xl mx-auto lowercase text-text font-bold ${isRTL ? 'rtl' : ''}`,
      containerClass: 'h-[80vh] flex justify-center items-center text-center'
    }
  ];

  return (
    <div className='bg-dark-secondary relative overflow-hidden'>
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-900/10 blur-3xl" />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-64 relative z-10'>
        {statements.map((statement, index) => (
          <div key={index} className={statement.containerClass}>
            <TextAnimation
              text={statement.text}
              direction={statement.direction}
              variants={statement.variants}
              letterAnime={statement.letterAnime}
              lineAnime={statement.lineAnime}
              as={statement.as}
              classname={statement.className}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisionStatements;