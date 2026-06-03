import bridePhoto from '../assets/lainnya/foto/girl-personal.webp'
import groomPhoto from '../assets/lainnya/foto/man-personal.webp'
import galeri1 from '../assets/lainnya/foto/galeri-1.webp'
import galeri2 from '../assets/lainnya/foto/galeri-2.webp'
import galeri3 from '../assets/lainnya/foto/galeri-3.webp'
import galeri4 from '../assets/lainnya/foto/galeri-4.webp'
import galeri5 from '../assets/lainnya/foto/galeri-5.webp'
import galeri6 from '../assets/lainnya/foto/galeri-6.webp'
import galeri7 from '../assets/lainnya/foto/galeri-7.webp'
import galeri8 from '../assets/lainnya/foto/galeri-8.webp'

export const weddingData = {
  bride: {
    firstName: 'Reny',
    lastName: 'Nur Khayti, S.M.',
    fullName: 'Reny Nur Khayti, S.M.',
    parents: 'Putri ke-3 dari Bpk. Mungin & Ibu Kamsini',
    description: 'Seorang pecinta pagi yang tenang, sastra klasik, dan keindahan sederhana alam semesta.',
    photo: bridePhoto,
    instagram: '@renynkyt',
  },
  groom: {
    firstName: 'Ichsan',
    lastName: 'Nurfalah, A.Md.',
    fullName: 'Muhammad Ichsan Nurfalah, A.Md.',
    parents: 'Putra ke-2 dari Bpk. Danur Wenda & Ibu Ikin Rukini',
    description: 'Seorang arsitek yang menemukan inspirasi dalam keanggunan terstruktur dan kehangatan tawa bersama.',
    photo: groomPhoto,
    instagram: '@ichsan_nurfalah',
  },
  wedding: {
    date: new Date('2026-06-14T00:00:00+07:00'),
    dateFormatted: '14 . 06 . 2026',
    quote: {
      text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      author: 'Q.S Ar-Rum : 21',
    },
    openingQuote: 'Dengan segala kerendahan hati dan ketulusan cinta, kami mengundangmu untuk menjadi saksi momen paling berharga dalam hidup kami.',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      subtitle: 'Sacred Ceremony',
      date: 'Minggu, 14 Juni 2026',
      time: '08.00 - 10.00 WIB',
      venue: 'Kediaman Reny',
      address: 'Jl. Mendiro, Berjing, Cepoko, Kec. Ngrambe, Kabupaten Ngawi, Jawa Timur 63263',
      mapsUrl: 'https://maps.google.com',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      subtitle: 'Wedding Reception',
      date: 'Minggu, 14 Juni 2026',
      time: '09.00 WIB - Selesai',
      venue: 'Kediaman Reny',
      address: 'Jl. Mendiro, Berjing, Cepoko, Kec. Ngrambe, Kabupaten Ngawi, Jawa Timur 63263',
      mapsUrl: 'https://maps.google.com',
    },
  ],
  dressCode: {
    title: 'Dress Code',
    description: 'Kami memohon kesediaan Bapak/Ibu/Saudara/i untuk hadir mengenakan pakaian dengan sentuhan warna berikut:',
    colors: [
      { name: 'Burgundy', hex: '#3D1E26' },
      { name: 'Warm Taupe', hex: '#C2A990' },
      { name: 'Terracotta', hex: '#D8613C' },
      { name: 'Black', hex: '#111111' },
    ]
  },
  liveStreaming: {
    title: 'Live Streaming',
    description: 'Bagi keluarga dan kerabat yang tidak dapat hadir secara langsung, kami mengundang Anda untuk bergabung secara virtual dalam momen bahagia kami.',
    link: 'https://youtube.com/@albianshoting?si=VwQ_Ba9Hx6QPbIiw',
    platform: 'YouTube Live',
  },
  weddingFrame: {
    title: 'Wedding Frame',
    description: 'Abadikan momen spesial ini dengan filter Instagram eksklusif kami.',
    link: 'https://instagram.com/ar/123456789',
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80&fit=crop'
  },
  loveStory: [
    {
      date: '2017',
      title: 'Pertemuan',
      description: 'Pertemuan sederhana di kampus menjadi awal cerita Ichsan dan Reny. Dari keberanian kecil untuk berkenalan, kesan itu tumbuh menjadi sesuatu yang sulit dilupakan.',
    },
    {
      date: '',
      title: 'Rasa yang Ditahan',
      description: 'Ada rasa yang tumbuh sejak awal, namun Ichsan memilih menjaga langkah. Bukan karena ragu, melainkan karena ingin memberi waktu agar cerita ini tidak singkat.',
    },
    {
      date: '2018',
      title: 'Jeda & Kembali',
      description: 'Jarak sempat membuat percakapan berhenti. Namun rindu tidak benar-benar pergi, hingga akhirnya mereka dipertemukan kembali.',
    },
    {
      date: '2019–2022',
      title: 'Memulai & Bertumbuh',
      description: 'Ichsan memberanikan diri mengungkapkan rasa, dan Reny menerimanya. Perjalanan membawa mereka belajar, berhenti sejenak, lalu kembali di tahun 2022 dengan hati yang lebih siap.',
    },
    {
      date: '2026',
      title: 'Menetap',
      description: 'Setelah pertemuan, jeda, dan kembali, mereka memilih menetap. Di tahun 2026, Ichsan & Reny memutuskan untuk melangkah menuju pernikahan.',
    },
  ],
  gallery: [
    { id: 1, src: bridePhoto, alt: 'Bride portrait', span: 'tall' },
    { id: 2, src: groomPhoto, alt: 'Groom portrait', span: 'normal' },
    { id: 3, src: galeri1, alt: 'Gallery 1', span: 'normal' },
    { id: 4, src: galeri2, alt: 'Gallery 2', span: 'wide' },
    { id: 5, src: galeri3, alt: 'Gallery 3', span: 'normal' },
    { id: 6, src: galeri4, alt: 'Gallery 4', span: 'tall' },
    { id: 7, src: galeri5, alt: 'Gallery 5', span: 'normal' },
    { id: 8, src: galeri6, alt: 'Gallery 6', span: 'wide' },
    { id: 9, src: galeri7, alt: 'Gallery 7', span: 'normal' },
    { id: 10, src: galeri8, alt: 'Gallery 8', span: 'normal' },
  ],
  gifts: [
    {
      id: 'bsi',
      bank: 'BSI',
      accountNumber: '7227328473',
      accountName: 'Ichsan Nurfalah',
    },
    {
      id: 'mandiri',
      bank: 'Bank Mandiri',
      accountNumber: '1010013845977',
      accountName: 'Reny Nur Khayati',
    },
  ],
  wishes: [] as { id: number; name: string; message: string; attending: boolean; time: string }[],

  navigation: [
    { name: 'Home', href: '#hero' },
    { name: 'Couple', href: '#couple' },
    { name: 'Story', href: '#love-story' },
    { name: 'Event', href: '#event' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Gift', href: '#gift' },
  ]
}

export type WeddingData = typeof weddingData
