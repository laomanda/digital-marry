import { AnimatePresence, motion } from 'framer-motion';
import { weddingData } from '../../data/wedding.data';
import { useCountdown } from '../../hooks/useCountdown';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { Container } from '../ui/Container';

const tickMarks = Array.from({ length: 60 }, (_, index) => ({
  index,
  isMajor: index % 5 === 0,
}));

type AnimatedDigitsProps = {
  value: number;
  pad?: boolean;
  shouldReduceMotion: boolean;
};

function AnimatedDigits({ value, pad = true, shouldReduceMotion }: AnimatedDigitsProps) {
  const stringValue = pad ? String(value).padStart(2, '0') : String(value);
  const digits = stringValue.split('');

  if (shouldReduceMotion) {
    return <span aria-label={stringValue}>{stringValue}</span>;
  }

  return (
    <span
      aria-label={stringValue}
      className="inline-flex items-center justify-center tabular-nums lining-nums"
    >
      {digits.map((digit, index) => (
        <span
          key={index}
          className="relative inline-flex w-[0.68em] items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${digit}-${index}`}
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18, position: 'absolute' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export default function CountdownSection() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(weddingData.wedding.date);
  const { shouldReduceMotion } = useReducedMotionSafe();

  const timeUnits = [
    { label: 'Jam', value: hours },
    { label: 'Menit', value: minutes },
    { label: 'Detik', value: seconds },
  ];

  const timerAriaLabel = isPast
    ? 'Hari bahagia telah tiba.'
    : `Sisa waktu menuju hari pernikahan: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik.`;

  return (
    <section
      id="countdown"
      data-section
      data-theme="dark"
      data-global-reveal="true"
      className="relative overflow-hidden bg-[#050505] py-20 md:py-32 lg:py-40"
    >
      <Container>
        <div className="relative mx-auto flex w-full max-w-[1080px] flex-col items-center">
          <div className="mb-10 flex w-full max-w-[720px] flex-col items-center text-center md:mb-16">
            <span
              data-animate="text"
              className="mb-5 block font-mono text-[10px] uppercase text-[#A4A4A4]"
            >
              Menuju Hari Bahagia
            </span>
            <h2
              data-animate="title"
              className="font-serif text-[40px] font-light leading-[1.05] text-[#F5F5F0] md:text-[64px] lg:text-[76px]"
            >
              {isPast ? 'Hari Bahagia Telah Tiba' : 'Menghitung Hari'}
            </h2>
            <p
              data-animate="text"
              className="mt-5 max-w-[520px] font-sans text-[15px] leading-7 text-[#A4A4A4] md:mt-6 md:text-[16px]"
            >
              {isPast
                ? 'Dengan penuh sukacita, hari yang dinantikan telah datang.'
                : 'Setiap detik membawa kami semakin dekat pada hari yang dinantikan.'}
            </p>
          </div>

          <div
            data-animate="card"
            role="timer"
            aria-label={timerAriaLabel}
            className="relative flex w-full flex-col items-center"
          >
            <div
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#F5F5F0]/[0.08] md:block"
              aria-hidden="true"
            />

            {isPast ? (
              <div className="group/days relative flex aspect-square w-full max-w-[520px] items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border border-[rgba(245,245,240,0.12)] transition-colors duration-700 group-hover/days:border-[rgba(245,245,240,0.28)]"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-6 rounded-full border border-[rgba(245,245,240,0.08)] transition-colors duration-700 group-hover/days:border-[rgba(245,245,240,0.18)]"
                  aria-hidden="true"
                />
                <motion.div
                  className="absolute inset-3 rounded-full opacity-40 transition-opacity duration-700 group-hover/days:opacity-70"
                  animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                  aria-hidden="true"
                >
                  {tickMarks.map((tick) => (
                    <span
                      key={tick.index}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${tick.index * 6}deg)` }}
                    >
                      <span
                        className={`absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[#F5F5F0]/35 ${
                          tick.isMajor ? 'h-4 md:h-5' : 'h-2 md:h-3'
                        }`}
                      />
                    </span>
                  ))}
                </motion.div>

                <div className="relative z-10 flex max-w-[300px] flex-col items-center px-8 text-center">
                  <span className="mb-5 h-px w-20 bg-[#F5F5F0]/20" aria-hidden="true" />
                  <span className="font-serif text-[52px] font-light leading-none text-[#F5F5F0] md:text-[72px]">
                    Telah Tiba
                  </span>
                  <span className="mt-6 font-mono text-[10px] uppercase text-[#A4A4A4]">
                    {weddingData.wedding.dateFormatted}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="group/days relative flex aspect-square w-full max-w-[540px] items-center justify-center">
                  <div
                    className="absolute left-10 right-10 top-1/2 h-px -translate-y-1/2 bg-[#F5F5F0]/10 transition-colors duration-700 group-hover/days:bg-[#F5F5F0]/20"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 rounded-full border border-[rgba(245,245,240,0.12)] transition-colors duration-700 group-hover/days:border-[rgba(245,245,240,0.30)]"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-6 rounded-full border border-[rgba(245,245,240,0.08)] transition-colors duration-700 group-hover/days:border-[rgba(245,245,240,0.18)]"
                    aria-hidden="true"
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full opacity-35 transition-opacity duration-700 group-hover/days:opacity-70"
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  >
                    {tickMarks.map((tick) => (
                      <span
                        key={tick.index}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${tick.index * 6}deg)` }}
                      >
                        <span
                          className={`absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[#F5F5F0]/35 ${
                            tick.isMajor ? 'h-4 md:h-5' : 'h-2 md:h-3'
                          }`}
                        />
                      </span>
                    ))}
                  </motion.div>

                  <div className="relative z-10 flex flex-col items-center px-8 text-center">
                    <span className="font-serif text-[clamp(96px,16vw,180px)] font-light leading-none text-[#F5F5F0] opacity-95 tabular-nums lining-nums transition duration-700 group-hover/days:scale-[1.02] group-hover/days:opacity-100">
                      <AnimatedDigits value={days} pad={false} shouldReduceMotion={shouldReduceMotion} />
                    </span>
                    <span className="mt-4 font-mono text-[11px] uppercase text-[#A4A4A4] transition-colors duration-500 group-hover/days:text-[#F5F5F0]">
                      Hari
                    </span>
                  </div>
                </div>

                <div className="mt-6 h-10 w-px bg-gradient-to-b from-[#F5F5F0]/20 to-transparent md:mt-8 md:h-12" aria-hidden="true" />

                <div className="grid w-full max-w-[720px] grid-cols-3 gap-3 md:gap-5">
                  {timeUnits.map((unit) => (
                    <div
                      key={unit.label}
                      className="group/unit relative min-w-0 border border-[rgba(245,245,240,0.12)] px-3 py-4 text-center transition-colors duration-500 hover:border-[rgba(245,245,240,0.32)] hover:bg-[#F5F5F0]/[0.02] md:px-6 md:py-7"
                    >
                      <span
                        className="absolute left-4 top-0 h-px w-7 origin-left bg-[#F5F5F0]/30 transition-all duration-500 group-hover/unit:w-14 group-hover/unit:bg-[#F5F5F0]/60"
                        aria-hidden="true"
                      />
                      <span className="block font-serif text-[42px] font-light leading-none text-[#F5F5F0] opacity-85 tabular-nums lining-nums transition-opacity duration-500 group-hover/unit:opacity-100 md:text-[64px]">
                        <AnimatedDigits value={unit.value} shouldReduceMotion={shouldReduceMotion} />
                      </span>
                      <span className="mt-4 block font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-500 group-hover/unit:text-[#F5F5F0] md:text-[11px]">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-7 font-mono text-[10px] uppercase text-[#A4A4A4] md:mt-12">
                  {weddingData.wedding.dateFormatted}
                </p>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
