<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServicesSeeder extends Seeder
{
    public function run()
    {
        $services = [
            [
                'name' => 'Servis Berkala',
                'description' => 'Servis rutin untuk menjaga performa kendaraan',
                'price' => 350000,
                'duration' => '2-3 jam',
                'category' => 'routine',
                'features' => json_encode([
                    'Ganti oli mesin',
                    'Cek dan bersihkan filter udara',
                    'Cek sistem rem',
                    'Cek tekanan ban',
                    'Cek aki dan sistem kelistrikan'
                ]),
                'icon' => '🛠️',
                'order' => 1,
                'is_active' => true
            ],
            [
                'name' => 'Tune Up Mesin',
                'description' => 'Optimalkan performa mesin kendaraan',
                'price' => 550000,
                'duration' => '3-4 jam',
                'category' => 'engine',
                'features' => json_encode([
                    'Cek dan setel busi',
                    'Bersihkan injektor',
                    'Cek kompresi mesin',
                    'Setel karburator/EFI',
                    'Cek sistem pengapian'
                ]),
                'icon' => '⚙️',
                'order' => 2,
                'is_active' => true
            ],
            [
                'name' => 'Ganti Ban & Spooring',
                'description' => 'Ganti ban dan setel keseimbangan roda',
                'price' => 200000,
                'duration' => '1-2 jam',
                'category' => 'tire',
                'features' => json_encode([
                    'Ganti ban baru',
                    'Spooring & balancing',
                    'Cek alignment',
                    'Rotasi ban',
                    'Cek tekanan optimal'
                ]),
                'icon' => '🚗',
                'order' => 3,
                'is_active' => true
            ],
            [
                'name' => 'Service Rem',
                'description' => 'Perawatan sistem pengereman',
                'price' => 450000,
                'duration' => '2 jam',
                'category' => 'brake',
                'features' => json_encode([
                    'Ganti kampas rem',
                    'Cek minyak rem',
                    'Bersihkan kaliper',
                    'Cek rotor disc',
                    'Test sistem ABS'
                ]),
                'icon' => '🛑',
                'order' => 4,
                'is_active' => true
            ],
            [
                'name' => 'Service AC',
                'description' => 'Perawatan sistem pendingin udara',
                'price' => 300000,
                'duration' => '2-3 jam',
                'category' => 'ac',
                'features' => json_encode([
                    'Isi freon AC',
                    'Bersihkan evaporator',
                    'Cek kompresor AC',
                    'Bersihkan filter AC',
                    'Test temperatur'
                ]),
                'icon' => '❄️',
                'order' => 5,
                'is_active' => true
            ],
            [
                'name' => 'Full Body Treatment',
                'description' => 'Perawatan eksterior dan interior kendaraan',
                'price' => 750000,
                'duration' => '4-5 jam',
                'category' => 'body',
                'features' => json_encode([
                    'Cuci dan wax eksterior',
                    'Detail interior',
                    'Poles body',
                    'Perawatan kulit jok',
                    'Aromaterapi kabin'
                ]),
                'icon' => '✨',
                'order' => 6,
                'is_active' => true
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}