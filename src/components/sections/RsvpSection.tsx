import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  guestCount: z.number({ invalid_type_error: 'Masukkan jumlah tamu' }).min(1).max(10),
  attendance: z.enum(['hadir', 'tidak_hadir', 'mungkin'], {
    errorMap: () => ({ message: 'Pilih status kehadiran' }),
  }),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function RsvpSection() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormValues) => {
    // Simulate submit delay
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitted(true)
  }

  return (
    <section id="rsvp" data-section data-theme="dark" data-global-reveal="true" className="section-padding bg-[#050505]">
      <div className="container-base max-w-2xl mx-auto">
        <div data-animate="card" className="rsvp-inner">
          <div data-animate="title" className="text-center mb-16">
            <span className="label-caps text-muted-gray tracking-[0.35em] block mb-4">RSVP</span>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)' }}
              className="text-off-white"
            >
              Konfirmasi Kehadiran
            </h2>
            <p className="font-sans text-[15px] text-muted-gray mt-4">
              Mohon konfirmasi kehadiran Anda sebelum 1 Desember 2024.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-[rgba(245,242,236,0.2)] flex items-center justify-center">
                <Check size={24} className="text-off-white" />
              </div>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '32px' }}
                className="text-off-white"
              >
                Terima Kasih
              </h3>
              <p className="font-sans text-[15px] text-muted-gray">
                RSVP Anda telah kami terima. Kami menantikan kehadiran Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama Anda"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Jumlah Tamu"
                  type="number"
                  placeholder="1"
                  min={1}
                  max={10}
                  error={errors.guestCount?.message}
                  {...register('guestCount', { valueAsNumber: true })}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="label-caps text-muted-gray tracking-[0.2em]">Kehadiran</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {[
                    { value: 'hadir', label: 'Akan Hadir' },
                    { value: 'tidak_hadir', label: 'Tidak Dapat Hadir' },
                    { value: 'mungkin', label: 'Mungkin Hadir' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register('attendance')}
                      />
                      <span className="w-4 h-4 border border-[rgba(245,242,236,0.2)] rounded-full flex items-center justify-center group-hover:border-off-white transition-colors">
                        <span className="w-2 h-2 rounded-full bg-off-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                      </span>
                      <span className="font-sans text-[14px] text-[rgba(245,242,236,0.6)] group-hover:text-off-white transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.attendance && (
                  <p className="font-sans text-[11px] text-red-400">{errors.attendance.message}</p>
                )}
              </div>

              <Textarea
                label="Ucapan & Doa"
                placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                error={errors.message?.message}
                {...register('message')}
              />

              <div className="flex justify-start pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={isSubmitting ? 'opacity-60 cursor-wait' : ''}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
