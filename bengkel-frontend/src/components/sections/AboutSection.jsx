import React from 'react';
import { UserGroupIcon, WrenchScrewdriverIcon, StarIcon } from '@heroicons/react/24/outline';

const AboutSection = () => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Bengkel modern dengan standar pelayanan profesional untuk menjaga performa kendaraan Anda tetap prima.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-50 rounded-2xl text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <WrenchScrewdriverIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Teknisi Ahli</h3>
                        <p className="text-gray-600">
                            Tim mekanik kami bersertifikat dan berpengalaman lebih dari 10 tahun dalam menangani berbagai jenis kendaraan.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <StarIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Kualitas Terjamin</h3>
                        <p className="text-gray-600">
                            Kami menggunakan suku cadang asli dan peralatan diagnostik modern untuk memastikan akurasi perbaikan.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <UserGroupIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Pelayanan Ramah</h3>
                        <p className="text-gray-600">
                            Kepuasan pelanggan adalah prioritas kami. Nikmati ruang tunggu nyaman dan konsultasi gratis.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
