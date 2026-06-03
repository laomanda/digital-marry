import { AnimatePresence, motion } from 'framer-motion';
import { weddingData } from '../../data/wedding.data';
import { useCountdown } from '../../hooks/useCountdown';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
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

  const sectionBgClass = 'bg-[#050505]';
  const textClass = 'text-[#F5F5F0]';
  const mutedClass = 'text-[#A4A4A4]';
  const lineSoftClass = 'bg-[#F5F5F0]/[0.08]';
  const outerRingClass = 'border-[rgba(245,245,240,0.12)] group-hover/days:border-[rgba(245,245,240,0.28)]';
  const outerRingNormalClass = 'border-[rgba(245,245,240,0.12)] group-hover/days:border-[rgba(245,245,240,0.30)]';
  const innerRingClass = 'border-[rgba(245,245,240,0.08)] group-hover/days:border-[rgba(245,245,240,0.18)]';
  const horizontalLineClass = 'bg-[#F5F5F0]/10 group-hover/days:bg-[#F5F5F0]/20';
  const tickClass = 'bg-[#F5F5F0]/35';
  const connectorClass = 'bg-gradient-to-b from-[#F5F5F0]/20 to-transparent';
  const unitCardClass = 'border-[rgba(245,245,240,0.12)] hover:border-[rgba(245,245,240,0.32)] hover:bg-[#F5F5F0]/[0.02]';
  const unitHairlineClass = 'bg-[#F5F5F0]/30 group-hover/unit:bg-[#F5F5F0]/60';
  const shortDividerClass = 'bg-[#F5F5F0]/20';
  const hoverTextClass = 'group-hover/days:text-[#F5F5F0]';
  const hoverUnitTextClass = 'group-hover/unit:text-[#F5F5F0]';

  const timerAriaLabel = isPast
    ? 'Hari bahagia telah tiba.'
    : `Sisa waktu menuju hari pernikahan: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik.`;

  return (
    <section
      id="countdown"
      data-section
      data-theme="dark"
      className={`relative overflow-hidden py-20 md:py-32 lg:py-40 transition-colors duration-500 ${sectionBgClass}`}
    >
      {/* Base warm tint */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, rgba(18,12,8,1) 0%, rgba(12,8,5,1) 40%, rgba(18,14,10,1) 100%)',
        }}
      />

      {/* Fabric weave texture (CSS only) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,242,236,0.35) 2px, rgba(245,242,236,0.35) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245,242,236,0.35) 2px, rgba(245,242,236,0.35) 3px)
          `,
          backgroundSize: '6px 6px',
        }}
      />

      {/* Secondary fine linen texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(211,165,117,0.2) 1px, rgba(211,165,117,0.2) 2px),
            repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(211,165,117,0.15) 1px, rgba(211,165,117,0.15) 2px)
          `,
          backgroundSize: '12px 12px',
        }}
      />

      {/* Diagonal silk sheen stripes */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              135deg,
              transparent, transparent 28px,
              rgba(211,165,117,0.12) 28px, rgba(211,165,117,0.12) 30px,
              transparent 30px, transparent 58px
            )
          `,
        }}
      />

      {/* Smooth transition gradients to blend textures seamlessly */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-b from-[#050505] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 md:h-64 z-[2] bg-gradient-to-t from-[#050505] to-transparent" aria-hidden="true" />

      {/* Main radial warm glow (center) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(211,165,117,0.14) 0%, rgba(211,165,117,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Secondary glow (bottom-left) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 40% 50% at 15% 80%, rgba(211,165,117,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Secondary glow (top-right) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 35% 45% at 85% 20%, rgba(211,165,117,0.07) 0%, transparent 60%)',
        }}
      />


      {/* Subtle corner vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,5,5,0.6) 100%)',
        }}
      />

      <Container>
        <div className="relative mx-auto flex w-full max-w-[1080px] flex-col items-center">
          <div
            className="mb-10 flex w-full max-w-[720px] flex-col items-center text-center md:mb-16"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-easing="ease-out-cubic"
          >
            <span
              className={`mb-5 block font-mono text-[10px] uppercase transition-colors duration-500 ${mutedClass}`}
            >
              Menuju Hari Bahagia
            </span>
            <h2
              className="font-athene text-[40px] leading-[1.05] transition-colors duration-500 md:text-[64px] lg:text-[76px] text-[#d3a575]"
            >
              {isPast ? 'Hari Bahagia Telah Tiba' : 'Menghitung Hari'}
            </h2>
            <p
              className={`mt-5 max-w-[520px] font-montserrat text-[15px] font-semibold leading-7 transition-colors duration-500 md:mt-6 md:text-[16px] ${mutedClass}`}
            >
              {isPast
                ? 'Dengan penuh sukacita, hari yang dinantikan telah datang.'
                : 'Setiap detik membawa kami semakin dekat pada hari yang dinantikan.'}
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-easing="ease-out-cubic"
            data-aos-delay="80"
            role="timer"
            aria-label={timerAriaLabel}
            className="relative flex w-full flex-col items-center"
          >
            <div
              className={`pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 transition-colors duration-500 md:block ${lineSoftClass}`}
              aria-hidden="true"
            />

            {isPast ? (
              <div className="group/days relative flex aspect-square w-full max-w-[520px] items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border transition-colors duration-700 ${outerRingNormalClass}`}
                  aria-hidden="true"
                />
                <div
                  className={`absolute inset-6 rounded-full border transition-colors duration-700 ${innerRingClass}`}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-3 rounded-full opacity-40 transition-opacity duration-700 group-hover/days:opacity-70"
                  aria-hidden="true"
                >
                  {tickMarks.map((tick) => (
                    <span
                      key={tick.index}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${tick.index * 6}deg)` }}
                    >
                      <span
                        className={`absolute left-1/2 top-0 w-px -translate-x-1/2 transition-colors duration-500 ${tickClass} ${
                          tick.isMajor ? 'h-4 md:h-5' : 'h-2 md:h-3'
                        }`}
                      />
                    </span>
                  ))}
                </div>

                <div className="relative z-10 flex max-w-[300px] flex-col items-center px-8 text-center">
                  <span className={`mb-5 h-px w-20 transition-colors duration-500 ${shortDividerClass}`} aria-hidden="true" />
                  <span className={`font-athene text-[52px] leading-none transition-colors duration-500 md:text-[72px] ${textClass}`}>
                    Telah Tiba
                  </span>
                  <span className={`mt-6 font-mono text-[10px] uppercase transition-colors duration-500 ${mutedClass}`}>
                    {weddingData.wedding.dateFormatted}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="group/days relative flex aspect-square w-full max-w-[540px] items-center justify-center">
                  <div
                    className={`absolute left-10 right-10 top-1/2 h-px -translate-y-1/2 transition-colors duration-700 ${horizontalLineClass}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-700 ${outerRingClass}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute inset-6 rounded-full border transition-colors duration-700 ${innerRingClass}`}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-3 rounded-full opacity-35 transition-opacity duration-700 group-hover/days:opacity-70"
                    aria-hidden="true"
                  >
                    {tickMarks.map((tick) => (
                      <span
                        key={tick.index}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${tick.index * 6}deg)` }}
                      >
                        <span
                          className={`absolute left-1/2 top-0 w-px -translate-x-1/2 transition-colors duration-500 ${tickClass} ${
                            tick.isMajor ? 'h-4 md:h-5' : 'h-2 md:h-3'
                          }`}
                        />
                      </span>
                    ))}
                  </div>

                  <div className="relative z-10 flex flex-col items-center px-8 text-center">
                    <span className={`font-serif text-[clamp(96px,16vw,180px)] font-light leading-none opacity-95 tabular-nums lining-nums transition duration-700 group-hover/days:scale-[1.02] group-hover/days:opacity-100 ${textClass}`}>
                      <AnimatedDigits value={days} pad={false} shouldReduceMotion={shouldReduceMotion} />
                    </span>
                    <span className={`mt-4 font-mono text-[11px] uppercase transition-colors duration-500 ${hoverTextClass} ${mutedClass}`}>
                      Hari
                    </span>
                  </div>
                </div>

                <div className={`mt-6 h-10 w-px transition-colors duration-500 md:mt-8 md:h-12 ${connectorClass}`} aria-hidden="true" />

                <div className="grid w-full max-w-[720px] grid-cols-3 gap-3 md:gap-5">
                  {timeUnits.map((unit) => (
                    <div
                      key={unit.label}
                      className={`group/unit relative min-w-0 border px-3 py-4 text-center transition-colors duration-500 md:px-6 md:py-7 ${unitCardClass}`}
                    >
                      <span
                        className={`absolute left-4 top-0 h-px w-7 origin-left transition-all duration-500 group-hover/unit:w-14 ${unitHairlineClass}`}
                        aria-hidden="true"
                      />
                      <span className={`block font-serif text-[42px] font-light leading-none opacity-85 tabular-nums lining-nums transition-opacity duration-500 group-hover/unit:opacity-100 md:text-[64px] ${textClass}`}>
                        <AnimatedDigits value={unit.value} shouldReduceMotion={shouldReduceMotion} />
                      </span>
                      <span className={`mt-4 block font-mono text-[10px] uppercase transition-colors duration-500 md:text-[11px] ${hoverUnitTextClass} ${mutedClass}`}>
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className={`mt-7 font-mono text-[10px] uppercase transition-colors duration-500 md:mt-12 ${mutedClass}`}>
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

