import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { weddingData } from '../../data/wedding.data';
import { useCountdown } from '../../hooks/useCountdown';
import { Container } from '../ui/Container';

function AnimatedValue({ value }: { value: string | number }) {
  const shouldReduceMotion = useReducedMotion();
  const stringValue = String(value).padStart(2, '0');

  if (shouldReduceMotion) {
    return <span>{stringValue}</span>;
  }

  return (
    <span className="relative inline-flex justify-center items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={stringValue}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)', position: 'absolute' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="inline-block"
        >
          {stringValue}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function CountdownSection() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(weddingData.wedding.date);

  const timeUnits = [
    { index: '01', label: 'Hours', value: hours },
    { index: '02', label: 'Minutes', value: minutes },
    { index: '03', label: 'Seconds', value: seconds },
  ];

  return (
    <section 
      id="countdown" 
      data-section 
      data-theme="dark" 
      data-global-reveal="true" 
      className="bg-[#050505] py-24 md:py-32 lg:py-48 relative overflow-hidden"
    >
      <Container>
        <div className="flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-16 md:mb-24 relative z-10 w-full flex flex-col items-center">
            <span data-animate="text" className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-[#A4A4A4] uppercase mb-6 block">
              Time Until The Day
            </span>
            <h2 data-animate="title" className="font-serif text-[36px] md:text-[56px] lg:text-[72px] text-[#F5F5F0] leading-[1.1] font-light max-w-2xl mx-auto">
              Counting Down to Forever
            </h2>
          </div>

          {/* Cinematic Instrument Panel */}
          <div 
            className="relative w-full max-w-[1200px] mx-auto min-h-[500px] flex flex-col md:flex-row items-center md:items-stretch group cursor-default" 
            data-animate="card"
            role="timer"
            aria-label={`Countdown to wedding: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
          >
            
            {/* Top/Bottom Editorial Hairlines */}
            <div className="hidden md:block absolute inset-0 border-y border-[#F5F5F0]/10 pointer-events-none opacity-40 transition-opacity duration-700 group-hover:opacity-80" aria-hidden="true" />
            
            {/* Corner Marks */}
            <div className="hidden md:block absolute top-0 left-0 w-6 h-6 border-t border-l border-[#F5F5F0]/30 opacity-30 transition-opacity duration-700 group-hover:opacity-60" aria-hidden="true" />
            <div className="hidden md:block absolute top-0 right-0 w-6 h-6 border-t border-r border-[#F5F5F0]/30 opacity-30 transition-opacity duration-700 group-hover:opacity-60" aria-hidden="true" />
            <div className="hidden md:block absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#F5F5F0]/30 opacity-30 transition-opacity duration-700 group-hover:opacity-60" aria-hidden="true" />
            <div className="hidden md:block absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#F5F5F0]/30 opacity-30 transition-opacity duration-700 group-hover:opacity-60" aria-hidden="true" />

            {isPast ? (
              <div className="flex items-center justify-center w-full h-[400px] md:h-[500px]">
                <p className="font-serif text-[28px] md:text-[40px] lg:text-[56px] text-[#F5F5F0] italic text-center px-8 leading-snug font-light opacity-90">
                  Today,<br/>Forever Begins.
                </p>
              </div>
            ) : (
              <>
                {/* Left: DAYS Monument */}
                <div className="flex-1 flex flex-col justify-center items-center md:items-end py-12 md:py-24 md:pr-16 lg:pr-24 relative w-full md:w-auto">
                   
                   {/* Background Decorative Arc (Partial Circle) */}
                   <div 
                     className="absolute top-1/2 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-[20%] -translate-y-1/2 w-[320px] h-[320px] md:w-[480px] md:h-[480px] border border-[#F5F5F0]/15 rounded-full opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000 ease-out pointer-events-none" 
                     style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} 
                     aria-hidden="true" 
                   />

                   <div className="relative z-10 flex flex-col items-center md:items-end">
                     <span className="font-serif text-[120px] md:text-[180px] lg:text-[220px] text-[#F5F5F0] tabular-nums lining-nums font-light leading-none tracking-tight mb-4 md:mb-8 group-hover:brightness-110 transition-all duration-500">
                       <AnimatedValue value={days} />
                     </span>
                     
                     <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                       <div className="hidden md:block w-12 h-px bg-[#F5F5F0]/20" aria-hidden="true" />
                       <span className="font-mono text-[11px] md:text-[12px] tracking-[0.4em] text-[#A4A4A4] uppercase">
                         Days
                       </span>
                     </div>
                     
                     {/* Date anchor positioned under DAYS on desktop */}
                     <p className="hidden md:block font-mono text-[10px] tracking-[0.3em] text-[#A4A4A4]/50 uppercase mt-16 group-hover:text-[#A4A4A4]/80 transition-colors duration-500">
                       {weddingData.wedding.dateFormatted}
                     </p>
                   </div>
                </div>

                {/* Center Axis (Desktop only) */}
                <div className="hidden md:flex flex-col items-center justify-center relative px-4 lg:px-8" aria-hidden="true">
                   <div className="w-px h-full bg-gradient-to-b from-transparent via-[#F5F5F0]/20 to-transparent" />
                   
                   {/* Measurement ticks along the axis */}
                   <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-12 py-8">
                      {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="w-3 h-px bg-[#F5F5F0]/20" />
                      ))}
                   </div>
                </div>

                {/* Mobile Divider */}
                <div className="md:hidden w-px h-16 bg-gradient-to-b from-transparent via-[#F5F5F0]/20 to-transparent my-4" aria-hidden="true" />

                {/* Right: Precision Modules */}
                <div className="flex-1 flex flex-col justify-center gap-4 md:gap-6 lg:gap-8 relative w-full max-w-[400px] px-4 md:px-0 md:pl-12 lg:pl-16 py-8 md:py-24">
                  {timeUnits.map((unit, index) => (
                    <div 
                      key={unit.label} 
                      className={`
                        group/row flex items-center justify-between py-5 md:py-6 px-6 md:px-8 
                        border border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20 hover:bg-[#F5F5F0]/[0.02] 
                        transition-all duration-500 rounded-[1px]
                        ${index === 2 ? 'opacity-80 hover:opacity-100' : ''}
                      `}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                        <span className="font-mono text-[8px] md:text-[9px] text-[#A4A4A4]/40">{unit.index}</span>
                        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] text-[#A4A4A4] uppercase">{unit.label}</span>
                      </div>
                      
                      <span className="font-serif text-[48px] md:text-[56px] lg:text-[72px] text-[#F5F5F0] tabular-nums lining-nums font-light leading-none opacity-90 group-hover/row:opacity-100 group-hover/row:brightness-110 group-hover/row:-translate-y-1 transition-all duration-500">
                        <AnimatedValue value={unit.value} />
                      </span>
                    </div>
                  ))}

                  {/* Mobile Date Anchor */}
                  <div className="md:hidden flex flex-col items-center mt-12 mb-4">
                     <p className="font-mono text-[10px] tracking-[0.3em] text-[#A4A4A4]/60 uppercase">
                       {weddingData.wedding.dateFormatted}
                     </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
