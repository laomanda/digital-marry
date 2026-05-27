import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, HelpCircle, ArrowRight, Minus, Plus, LoaderCircle } from 'lucide-react'
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe'
import { cn } from '../../lib/utils'
import { GuestWish } from '../../types/wish'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  guestCount: z.number({ invalid_type_error: 'Masukkan jumlah tamu' }).min(1).max(10),
  attendance: z.enum(['hadir', 'tidak_hadir', 'mungkin'], {
    errorMap: () => ({ message: 'Mohon konfirmasi status kehadiran Anda' }),
  }),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function RsvpSection({ onWishSubmit }: { onWishSubmit?: (wish: GuestWish) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const { shouldReduceMotion } = useReducedMotionSafe()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guestCount: 1,
    }
  })

  const attendanceValue = watch('attendance')
  const guestCountValue = watch('guestCount')

  const onSubmit = async (_data: FormValues) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500))
    
    if (onWishSubmit && _data.message && _data.message.trim() !== '') {
      onWishSubmit({
        id: Date.now().toString(),
        name: _data.name,
        message: _data.message,
        attending: _data.attendance === 'hadir',
        time: 'Baru saja',
        source: 'rsvp'
      })
    }
    
    setSubmitted(true)
  }

  const handleDecreaseGuest = () => {
    if (guestCountValue > 1) {
      setValue('guestCount', guestCountValue - 1, { shouldValidate: true })
    }
  }

  const handleIncreaseGuest = () => {
    if (guestCountValue < 10) {
      setValue('guestCount', guestCountValue + 1, { shouldValidate: true })
    }
  }

  const attendanceOptions = [
    { value: 'hadir', label: 'Hadir', note: 'Saya akan datang', icon: Check },
    { value: 'tidak_hadir', label: 'Tidak Hadir', note: 'Belum dapat hadir', icon: X },
    { value: 'mungkin', label: 'Mungkin', note: 'Akan dikabari', icon: HelpCircle },
  ] as const

  return (
    <section 
      id="rsvp" 
      data-section 
      data-theme="dark" 
      data-global-reveal="true" 
      className="overflow-hidden bg-[#050505] py-24 text-[#F5F5F0] md:py-32"
    >
      <div className="container-base mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="flex flex-col lg:sticky lg:top-28" data-animate="title">
            <div className="mb-8 h-12 w-px bg-[#F5F5F0]/15" aria-hidden="true" />
            <span className="mb-4 font-mono text-[10px] uppercase text-[#A4A4A4]">
              RSVP
            </span>
            <h2 className="mb-6 font-serif text-[44px] font-light leading-[1.02] text-[#F5F5F0] md:text-[64px]">
              Konfirmasi Kehadiran
            </h2>
            <p className="mb-8 max-w-md text-[15px] leading-7 text-[#A4A4A4]">
              Mohon konfirmasi kehadiran Anda agar kami dapat mempersiapkan momen ini dengan sebaik-baiknya.
            </p>
            <div className="flex max-w-sm items-start gap-4 border-l border-[#F5F5F0]/12 pl-5">
              <span className="mt-2 h-px w-8 bg-[#F5F5F0]/22" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase leading-6 text-[#A4A4A4]">
                Balasan Anda membantu kami menyiapkan tempat dan jamuan dengan lebih baik.
              </span>
            </div>
          </div>

          <div data-animate="card" className="group relative">
            <div className="absolute inset-0 border border-[#F5F5F0]/12 bg-[#F5F5F0]/[0.032] transition-colors duration-500 group-hover:border-[#F5F5F0]/20" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F5F5F0]/[0.055] via-transparent to-transparent opacity-80" aria-hidden="true" />
            <div className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#F5F5F0]/35" aria-hidden="true" />
            <div className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#F5F5F0]/35" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#F5F5F0]/25" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#F5F5F0]/25" aria-hidden="true" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-center p-6 sm:p-8 md:p-12">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col items-center justify-center py-12 text-center"
                    role="status"
                  >
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#F5F5F0]/28 bg-[#050505]">
                      <Check size={24} className="text-[#F5F5F0]" strokeWidth={1.4} aria-hidden="true" />
                    </div>
                    <h3 className="mb-4 font-serif text-[32px] font-light leading-tight text-[#F5F5F0] md:text-[42px]">
                      Terima kasih, konfirmasi Anda telah kami terima.
                    </h3>
                    <p className="max-w-sm text-[15px] leading-7 text-[#A4A4A4]">
                      Doa dan kehadiran Anda sangat berarti bagi kami.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-9"
                    noValidate
                    aria-busy={isSubmitting}
                  >
                    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                      <div className="group/field flex flex-col gap-3">
                        <label htmlFor="name" className="font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-300 group-focus-within/field:text-[#F5F5F0]">
                          Nama
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama Anda"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={cn(
                            "w-full border-0 border-b bg-transparent pb-3 text-[16px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/22 transition-colors focus:outline-none focus:ring-0",
                            errors.name ? "border-[#F5F5F0]/42" : "border-[#F5F5F0]/14 focus:border-[#F5F5F0]/70"
                          )}
                          {...register('name')}
                        />
                        <p id="name-error" className="min-h-[18px] text-[12px] leading-[18px] text-[#F5F5F0]/72">
                          {errors.name?.message ?? ''}
                        </p>
                      </div>

                      <div className="group/field flex flex-col gap-3">
                        <label htmlFor="guestCount" className="font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-300 group-focus-within/field:text-[#F5F5F0]">
                          Jumlah Tamu
                        </label>
                        <div className={cn(
                          "flex w-full items-center justify-between border-b pb-2 transition-colors md:w-[152px]",
                          errors.guestCount ? "border-[#F5F5F0]/42" : "border-[#F5F5F0]/14 focus-within:border-[#F5F5F0]/70"
                        )}>
                          <button
                            type="button"
                            onClick={handleDecreaseGuest}
                            disabled={guestCountValue <= 1}
                            aria-label="Kurangi jumlah tamu"
                            className="p-2 text-[#A4A4A4] transition-colors hover:text-[#F5F5F0] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] disabled:opacity-30"
                          >
                            <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
                          </button>
                          
                          <input
                            id="guestCount"
                            type="number"
                            readOnly
                            aria-invalid={Boolean(errors.guestCount)}
                            aria-describedby={errors.guestCount ? 'guest-count-error' : undefined}
                            className="pointer-events-none w-10 cursor-default appearance-none border-0 bg-transparent text-center text-[16px] text-[#F5F5F0] focus:outline-none focus:ring-0"
                            {...register('guestCount', { valueAsNumber: true })}
                          />

                          <button
                            type="button"
                            onClick={handleIncreaseGuest}
                            disabled={guestCountValue >= 10}
                            aria-label="Tambah jumlah tamu"
                            className="p-2 text-[#A4A4A4] transition-colors hover:text-[#F5F5F0] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] disabled:opacity-30"
                          >
                            <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                          </button>
                        </div>
                        <p id="guest-count-error" className="min-h-[18px] text-[12px] leading-[18px] text-[#F5F5F0]/72">
                          {errors.guestCount?.message ?? ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[10px] uppercase text-[#A4A4A4]">
                        Konfirmasi Kehadiran
                      </span>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {attendanceOptions.map((opt) => {
                          const isActive = attendanceValue === opt.value
                          const Icon = opt.icon
                          return (
                            <motion.label
                              key={opt.value}
                              initial={false}
                              animate={{ y: shouldReduceMotion || !isActive ? 0 : -2 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className={cn(
                                "group/option relative flex min-h-[104px] cursor-pointer flex-col justify-between border p-4 transition-colors duration-300 focus-within:outline focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-[#F5F5F0]",
                                isActive
                                  ? "border-[#F5F5F0]/35 bg-[#F5F5F0]/[0.045]"
                                  : "border-[#F5F5F0]/12 bg-[#F5F5F0]/[0.018] hover:border-[#F5F5F0]/24"
                              )}
                            >
                              <input
                                type="radio"
                                value={opt.value}
                                className="sr-only"
                                {...register('attendance')}
                              />
                              <div className="flex items-start justify-between gap-3">
                                <span className={cn(
                                  "text-[15px] transition-colors duration-300",
                                  isActive ? "text-[#F5F5F0]" : "text-[#A4A4A4] group-hover/option:text-[#F5F5F0]"
                                )}>
                                  {opt.label}
                                </span>
                                <span className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                                  isActive ? "border-[#F5F5F0]/45 bg-[#F5F5F0] text-[#050505]" : "border-[#F5F5F0]/14 text-transparent"
                                )}>
                                  <Icon size={12} strokeWidth={2.3} aria-hidden="true" />
                                </span>
                              </div>
                              <span className="font-mono text-[9px] uppercase text-[#A4A4A4]">
                                {opt.note}
                              </span>
                            </motion.label>
                          )
                        })}
                      </div>
                      <p className="min-h-[18px] text-[12px] leading-[18px] text-[#F5F5F0]/72">
                        {errors.attendance?.message ?? ''}
                      </p>
                    </div>

                    <div className="group/field flex flex-col gap-3">
                      <label htmlFor="message" className="font-mono text-[10px] uppercase text-[#A4A4A4] transition-colors duration-300 group-focus-within/field:text-[#F5F5F0]">
                        Ucapan & Doa (Opsional)
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Tulis ucapan bahagia Anda..."
                        className={cn(
                          "w-full resize-none border-0 border-b bg-transparent pb-3 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/22 transition-colors focus:outline-none focus:ring-0",
                          errors.message ? "border-[#F5F5F0]/42" : "border-[#F5F5F0]/14 focus:border-[#F5F5F0]/70"
                        )}
                        {...register('message')}
                      />
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex w-full items-center justify-between border border-[#F5F5F0]/16 p-5 transition-colors duration-500 hover:border-[#F5F5F0]/55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F0] disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        <span className="font-mono text-[10px] uppercase text-[#F5F5F0]">
                          {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                        </span>
                        {isSubmitting ? (
                          <LoaderCircle
                            size={16}
                            strokeWidth={1.5}
                            className={cn("text-[#F5F5F0]", shouldReduceMotion ? "" : "animate-spin")}
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowRight
                            size={16}
                            strokeWidth={1.5}
                            className="text-[#F5F5F0] transition-transform duration-500 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
