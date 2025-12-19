import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ContactSection = () => {
    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Info */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
                            <p className="text-lg text-gray-600">
                                Punya pertanyaan atau butuh bantuan darurat? Hubungi tim kami sekarang juga.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <PhoneIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Telepon / WhatsApp</h3>
                                    <a href="https://wa.me/6281288031729" className="text-blue-600 hover:text-blue-700 font-medium">
                                        0812-8803-1729
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Siap 24 Jam untuk kondisi darurat</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <EnvelopeIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Email</h3>
                                    <a href="mailto:servicetdyauto@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                                        servicetdyauto@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Alamat Bengkel</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Jl. H. Muhari, RT.02/rw01, Serua, Kec. Bojongsari,<br />
                                        Kota Depok, Jawa Barat 16517
                                    </p>
                                    <a
                                        href="https://maps.google.com/?q=TDY+Auto+Service"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                                    >
                                        Lihat di Google Maps →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map / Image */}
                    <div className="lg:w-1/2 min-h-[400px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4703.508909759985!2d106.73687277499158!3d-6.368493193621635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ef4760b4ca8d%3A0xe52f937020c0b509!2sTDY%20AUTO%20SERVICE!5e1!3m2!1sid!2sid!4v1766029780758!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Bengkel"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
