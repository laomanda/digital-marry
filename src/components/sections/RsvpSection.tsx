import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, HelpCircle, ArrowRight, Minus, Plus } from 'lucide-react'
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

  // Helper for attendance options
  const attendanceOptions = [
    { value: 'hadir', label: 'Akan Hadir', icon: Check },
    { value: 'tidak_hadir', label: 'Tidak Hadir', icon: X },
    { value: 'mungkin', label: 'Mungkin', icon: HelpCircle },
  ] as const

  return (
    <section 
      id="rsvp" 
      data-section 
      data-theme="dark" 
      data-global-reveal="true" 
      className="py-24 md:py-32 bg-[#050505] text-[#F5F5F0] overflow-hidden"
    >
      <div className="container-base max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-20 items-start">
          
          {/* Left Column: Editorial Intro */}
          <div className="flex flex-col lg:sticky lg:top-32" data-animate="title">
            <div className="w-px h-12 bg-[rgba(245,245,240,0.15)] mb-8" aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#A4A4A4] mb-4">
              RSVP
            </span>
            <h2 className="font-serif text-[40px] md:text-[56px] text-[#F5F5F0] font-light leading-[1.1] mb-6">
              Konfirmasi <br className="hidden md:block" />
              <span className="italic text-[#A4A4A4]">Kehadiran</span>
            </h2>
            <p className="font-sans text-[14px] md:text-[15px] text-[#A4A4A4] leading-relaxed max-w-md mb-8">
              Mohon konfirmasi kehadiran Anda untuk membantu kami menyiapkan momen terbaik. RSVP ini sangat berarti bagi kelancaran acara kami.
            </p>
            <div className="inline-flex items-center gap-4">
              <div className="w-8 h-px bg-[rgba(245,245,240,0.2)]" />
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#F5F5F0]">
                Before 01 . 05 . 2026
              </span>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div data-animate="card" className="relative group">
            
            {/* Subtle Backdrop Panel */}
            <div className="absolute inset-0 bg-[rgba(245,245,240,0.02)] border border-[rgba(245,245,240,0.10)] rounded-[2px] transition-colors duration-500 group-hover:border-[rgba(245,245,240,0.15)]" aria-hidden="true" />
            
            {/* Corner Marks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[rgba(245,245,240,0.3)] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[rgba(245,245,240,0.3)] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[rgba(245,245,240,0.3)] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[rgba(245,245,240,0.3)] pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center text-center h-full py-12"
                    role="status"
                  >
                    <div className="w-16 h-16 rounded-full border border-[rgba(245,245,240,0.2)] flex items-center justify-center mb-8">
                      <Check size={24} className="text-[#F5F5F0]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-[32px] md:text-[40px] font-light text-[#F5F5F0] mb-4">
                      Terima Kasih
                    </h3>
                    <p className="font-sans text-[14px] md:text-[15px] text-[#A4A4A4] max-w-sm leading-relaxed">
                      Konfirmasi Anda telah kami catat dengan aman. Kami menantikan kehadiran Anda di hari bahagia kami.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-10"
                    noValidate
                  >
                    
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-8 items-start">
                      {/* Name Field */}
                      <div className="flex flex-col gap-3">
                        <label htmlFor="name" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">
                          Nama Lengkap
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama Anda"
                          className={cn(
                            "w-full bg-transparent border-0 border-b pb-3 font-sans text-[16px] text-[#F5F5F0] placeholder:text-[rgba(245,245,240,0.2)] focus:outline-none focus:ring-0 transition-colors",
                            errors.name ? "border-[#FCA5A5] focus:border-[#FCA5A5]" : "border-[rgba(245,245,240,0.15)] focus:border-[#F5F5F0]"
                          )}
                          {...register('name')}
                        />
                        {errors.name && <p className="font-sans text-[12px] text-[#FCA5A5] mt-1">{errors.name.message}</p>}
                      </div>

                      {/* Custom Stepper for Guest Count */}
                      <div className="flex flex-col gap-3">
                        <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">
                          Jumlah Tamu
                        </label>
                        <div className={cn(
                          "flex items-center justify-between border-b pb-2 transition-colors w-full md:w-[140px]",
                          errors.guestCount ? "border-[#FCA5A5]" : "border-[rgba(245,245,240,0.15)] focus-within:border-[#F5F5F0]"
                        )}>
                          <button
                            type="button"
                            onClick={handleDecreaseGuest}
                            disabled={guestCountValue <= 1}
                            aria-label="Kurangi jumlah tamu"
                            className="p-2 text-[#A4A4A4] hover:text-[#F5F5F0] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]"
                          >
                            <Minus size={16} strokeWidth={1.5} />
                          </button>
                          
                          <input
                            type="number"
                            readOnly
                            className="w-10 bg-transparent border-0 text-center font-sans text-[16px] text-[#F5F5F0] focus:outline-none focus:ring-0 cursor-default pointer-events-none appearance-none"
                            {...register('guestCount', { valueAsNumber: true })}
                          />

                          <button
                            type="button"
                            onClick={handleIncreaseGuest}
                            disabled={guestCountValue >= 10}
                            aria-label="Tambah jumlah tamu"
                            className="p-2 text-[#A4A4A4] hover:text-[#F5F5F0] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]"
                          >
                            <Plus size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        {errors.guestCount && <p className="font-sans text-[12px] text-[#FCA5A5] mt-1">{errors.guestCount.message}</p>}
                      </div>
                    </div>

                    {/* Attendance Segmented Cards */}
                    <div className="flex flex-col gap-4">
                      <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">
                        Konfirmasi Kehadiran
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {attendanceOptions.map((opt) => {
                          const isActive = attendanceValue === opt.value
                          const Icon = opt.icon
                          return (
                            <label
                              key={opt.value}
                              className={cn(
                                "relative flex items-center justify-between p-4 border rounded-[2px] cursor-pointer transition-all duration-300 group focus-within:ring-1 focus-within:ring-[#F5F5F0]",
                                isActive
                                  ? "border-[rgba(245,245,240,0.3)] bg-[rgba(245,245,240,0.03)]"
                                  : "border-[rgba(245,245,240,0.1)] hover:border-[rgba(245,245,240,0.2)]"
                              )}
                            >
                              <input
                                type="radio"
                                value={opt.value}
                                className="sr-only"
                                {...register('attendance')}
                              />
                              <span className={cn(
                                "font-sans text-[14px] transition-colors duration-300",
                                isActive ? "text-[#F5F5F0]" : "text-[#A4A4A4] group-hover:text-[#F5F5F0]"
                              )}>
                                {opt.label}
                              </span>
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                                isActive ? "bg-[#F5F5F0] text-[#050505]" : "text-transparent"
                              )}>
                                <Icon size={12} strokeWidth={2.5} />
                              </div>
                            </label>
                          )
                        })}
                      </div>
                      {errors.attendance && <p className="font-sans text-[12px] text-[#FCA5A5]">{errors.attendance.message}</p>}
                    </div>

                    {/* Message Textarea */}
                    <div className="flex flex-col gap-3">
                      <label htmlFor="message" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#777777]">
                        Ucapan & Doa (Opsional)
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Tulis ucapan bahagia Anda..."
                        className={cn(
                          "w-full bg-transparent border-0 border-b pb-3 font-sans text-[15px] text-[#F5F5F0] placeholder:text-[rgba(245,245,240,0.2)] resize-none focus:outline-none focus:ring-0 transition-colors",
                          errors.message ? "border-[#FCA5A5] focus:border-[#FCA5A5]" : "border-[rgba(245,245,240,0.15)] focus:border-[#F5F5F0]"
                        )}
                        {...register('message')}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex items-center justify-between w-full p-5 border border-[rgba(245,245,240,0.15)] hover:border-[#F5F5F0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-500 rounded-[2px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F5F0]"
                      >
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F5F5F0]">
                          {isSubmitting ? 'Memproses...' : 'Kirim RSVP'}
                        </span>
                        <ArrowRight 
                          size={16} 
                          strokeWidth={1.5} 
                          className={cn(
                            "text-[#F5F5F0] transition-transform duration-500",
                            isSubmitting ? "" : "group-hover:translate-x-1"
                          )} 
                          aria-hidden="true" 
                        />
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
