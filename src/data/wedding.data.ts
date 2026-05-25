export const weddingData = {
  bride: {
    firstName: 'Alya',
    lastName: 'Safira',
    fullName: 'Alya Safira',
    parents: 'Putri dari Bpk. Budi Santoso & Ibu Rini Santoso',
    description: 'Seorang pecinta pagi yang tenang, sastra klasik, dan keindahan sederhana alam semesta.',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&fit=crop',
    instagram: '@alyasafira',
  },
  groom: {
    firstName: 'Raka',
    lastName: 'Pradana',
    fullName: 'Raka Pradana',
    parents: 'Putra dari Bpk. Agus Wahyudi & Ibu Dewi Wahyudi',
    description: 'Seorang arsitek yang menemukan inspirasi dalam keanggunan terstruktur dan kehangatan tawa bersama.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop',
    instagram: '@rakapradana',
  },
  wedding: {
    date: new Date('2026-06-14T00:00:00+07:00'),
    dateFormatted: '14 . 06 . 2026',
    quote: {
      text: 'Dan aku akan memilihmu; dalam seratus kehidupan, dalam seratus dunia, dalam versi realita mana pun, aku akan menemukan dan memilihmu.',
      author: '— Kiersten White',
    },
    openingQuote: 'Dengan segala kerendahan hati dan ketulusan cinta, kami mengundangmu untuk menjadi saksi momen paling berharga dalam hidup kami.',
  },
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      subtitle: 'Sacred Ceremony',
      date: 'Minggu, 14 Juni 2026',
      time: '08.00 – 10.00 WIB',
      venue: 'Masjid Agung Al-Azhar',
      address: 'Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan',
      mapsUrl: 'https://maps.google.com',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      subtitle: 'Wedding Reception',
      date: 'Minggu, 14 Juni 2026',
      time: '11.00 – 14.00 WIB',
      venue: 'The Ritz-Carlton Jakarta',
      address: 'Jl. DR. Ide Anak Agung Gde Agung No.1, Kuningan, Jakarta Selatan',
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
    link: 'https://youtube.com',
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
      id: 1,
      date: 'Oktober 2018',
      title: 'Pertemuan Pertama',
      description: 'Sebuah pertemuan tak terduga di sebuah galeri seni lokal. Tatapan yang bertemu di atas lukisan kontemporer memicu percakapan yang berlangsung hingga larut malam.',
    },
    {
      id: 2,
      date: 'Desember 2018',
      title: 'Kencan Pertama',
      description: 'Kopi dan hujan. Kami menghabiskan sore di sudut kafe yang sunyi, menemukan cinta bersama atas arsitektur vintage dan jazz.',
    },
    {
      id: 3,
      date: 'Maret 2020',
      title: 'Melewati Badai Bersama',
      description: 'Pandemi datang dan memisahkan jarak, namun justru mendekatkan hati. Ribuan pesan dan panggilan video menjadi saksi bisu cinta yang tumbuh.',
    },
    {
      id: 4,
      date: 'Agustus 2023',
      title: 'Lamaran',
      description: 'Di bawah langit penuh bintang dalam perjalanan singkat ke pegunungan. Sebuah pertanyaan sederhana namun mendalam, dan "Ya" yang penuh kebahagiaan.',
    },
    {
      id: 5,
      date: 'Desember 2024',
      title: 'Hari Pernikahan',
      description: 'Dan hari ini, kami berdiri di sini bersama kalian semua — para saksi dari cinta yang telah kami rawat selama bertahun-tahun.',
    },
  ],
  gallery: [
    { id: 1, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&fit=crop', alt: 'Couple portrait', span: 'tall' },
    { id: 2, src: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80&fit=crop', alt: 'Wedding rings', span: 'normal' },
    { id: 3, src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80&fit=crop', alt: 'Wedding ceremony', span: 'normal' },
    { id: 4, src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80&fit=crop', alt: 'Wedding bouquet', span: 'wide' },
    { id: 5, src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80&fit=crop', alt: 'Couple dancing', span: 'normal' },
    { id: 6, src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80&fit=crop', alt: 'Wedding venue', span: 'tall' },
  ],
  gifts: [
    {
      id: 'bca',
      bank: 'Bank BCA',
      accountNumber: '1234567890',
      accountName: 'Alya Safira',
    },
    {
      id: 'mandiri',
      bank: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'Raka Pradana',
    },
  ],
  wishes: [
    {
      id: 1,
      name: 'Sinta & Dimas',
      message: 'Semoga pernikahan kalian dipenuhi cinta, kebahagiaan, dan berkat yang melimpah. Selamat menempuh hidup baru!',
      time: '2 hari yang lalu',
      attending: true,
    },
    {
      id: 2,
      name: 'Arief Rahmat',
      message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair. Selamat ya Raka! Kamu beruntung sekali.',
      time: '3 hari yang lalu',
      attending: true,
    },
    {
      id: 3,
      name: 'Keluarga Budiman',
      message: 'Kami mendoakan yang terbaik untuk kalian berdua. Semoga rumah tangga kalian menjadi surga di dunia.',
      time: '5 hari yang lalu',
      attending: false,
    },
    {
      id: 4,
      name: 'Nadia Putri',
      message: 'Alya, akhirnya! Senang banget melihat kamu bahagia. Selamat untuk kalian berdua, semoga langgeng sampai kakek nenek ya!',
      time: '1 minggu yang lalu',
      attending: true,
    },
    {
      id: 5,
      name: 'Tim Arsitek Studio',
      message: 'Selamat Raka! Ternyata selain bisa merancang gedung, kamu juga bisa membangun rumah tangga yang indah. Semoga bahagia!',
      time: '1 minggu yang lalu',
      attending: true,
    },
    {
      id: 6,
      name: 'Mama & Papa Santoso',
      message: 'Ananda Alya, inilah awal babak baru kehidupanmu. Jadilah istri yang sholehah dan ibu yang penuh kasih. Mama & Papa selalu mendukungmu.',
      time: '2 minggu yang lalu',
      attending: true,
    },
  ],
  closingQuote: {
    text: 'Pernikahan adalah awal dari sebuah taman yang harus kalian rawat bersama setiap harinya.',
    author: '— Mark Twain',
  },
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
