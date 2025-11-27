export const servicesData = [
  {
    id: 1,
    name: 'Servis Berkala',
    description: 'Servis rutin untuk menjaga performa kendaraan',
    duration: '2-3 jam',
    price: 350000,
    features: [
      'Ganti oli mesin',
      'Cek dan bersihkan filter udara',
      'Cek sistem rem',
      'Cek tekanan ban',
      'Cek aki dan sistem kelistrikan'
    ],
    icon: '🛠️',
    category: 'routine'
  },
  {
    id: 2,
    name: 'Tune Up Mesin',
    description: 'Optimalkan performa mesin kendaraan',
    duration: '3-4 jam',
    price: 550000,
    features: [
      'Cek dan setel busi',
      'Bersihkan injektor',
      'Cek kompresi mesin',
      'Setel karburator/EFI',
      'Cek sistem pengapian'
    ],
    icon: '⚙️',
    category: 'engine'
  },
  {
    id: 3,
    name: 'Ganti Ban & Spooring',
    description: 'Ganti ban dan setel keseimbangan roda',
    duration: '1-2 jam',
    price: 200000,
    features: [
      'Ganti ban baru',
      'Spooring & balancing',
      'Cek alignment',
      'Rotasi ban',
      'Cek tekanan optimal'
    ],
    icon: '🚗',
    category: 'tire'
  },
  {
    id: 4,
    name: 'Service Rem',
    description: 'Perawatan sistem pengereman',
    duration: '2 jam',
    price: 450000,
    features: [
      'Ganti kampas rem',
      'Cek minyak rem',
      'Bersihkan kaliper',
      'Cek rotor disc',
      'Test sistem ABS'
    ],
    icon: '🛑',
    category: 'brake'
  },
  {
    id: 5,
    name: 'Service AC',
    description: 'Perawatan sistem pendingin udara',
    duration: '2-3 jam',
    price: 300000,
    features: [
      'Isi freon AC',
      'Bersihkan evaporator',
      'Cek kompresor AC',
      'Bersihkan filter AC',
      'Test temperatur'
    ],
    icon: '❄️',
    category: 'ac'
  },
  {
    id: 6,
    name: 'Full Body Treatment',
    description: 'Perawatan eksterior dan interior kendaraan',
    duration: '4-5 jam',
    price: 750000,
    features: [
      'Cuci dan wax eksterior',
      'Detail interior',
      'Poles body',
      'Perawatan kulit jok',
      'Aromaterapi kabin'
    ],
    icon: '✨',
    category: 'body'
  }
];

export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', 
  '13:00', '14:00', '15:00', '16:00'
];

export const carTypes = [
  'SUV', 'Sedan', 'MPV', 'Hatchback', 
  'Sport', 'Truck', 'Luxury', 'Electric'
];