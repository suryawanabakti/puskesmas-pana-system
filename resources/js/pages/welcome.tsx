'use client';

import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, ChevronRight, Clock, Mail, MapPin, Menu, MessageSquare, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome({ queue }: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentQueue, setCurrentQueue] = useState(queue?.number || 0);
    const { auth } = usePage().props;

    // Simulate queue number changing
    useEffect(() => {
        // const interval = setInterval(() => {
        //     setCurrentQueue((prev) => prev + 1);
        // }, 8000);
        // return () => clearInterval(interval);
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <>
            <Head title="Puskesmas Pana - Sistem Pengaduan dan Antrian" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-md">
                    <div className="container mx-auto flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="rounded-md bg-green-500 p-1.5 text-white">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-gray-800">Puskesmas Pana</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-8 md:flex">
                            <Link href="#features" className="text-gray-600 transition-colors hover:text-green-500">
                                Fitur
                            </Link>
                            <Link href="#how-it-works" className="text-gray-600 transition-colors hover:text-green-500">
                                Cara Kerja
                            </Link>

                            <Link href="#informasi" className="text-gray-600 transition-colors hover:text-green-500">
                                Tentang
                            </Link>
                            <Link href="#faq" className="text-gray-600 transition-colors hover:text-green-500">
                                FAQ
                            </Link>
                        </nav>

                        <div className="hidden items-center gap-4 md:flex">
                            {auth.user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Halo, {auth.user.name}</span>
                                    <Link
                                        href={route('dashboard')}
                                        className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border border-green-500 bg-transparent px-4 py-2 text-sm font-medium text-green-500 shadow-sm transition-colors hover:bg-green-50 focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button className="text-gray-500 hover:text-gray-700 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-100 bg-white md:hidden"
                        >
                            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
                                <Link href="#features" className="py-2 text-gray-600 transition-colors hover:text-green-500">
                                    Fitur
                                </Link>
                                <Link href="#how-it-works" className="py-2 text-gray-600 transition-colors hover:text-green-500">
                                    Cara Kerja
                                </Link>
                                <Link href="#testimonials" className="py-2 text-gray-600 transition-colors hover:text-green-500">
                                    Testimoni
                                </Link>
                                <Link href="#faq" className="py-2 text-gray-600 transition-colors hover:text-green-500">
                                    FAQ
                                </Link>

                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
                                    {auth.user ? (
                                        <>
                                            <span className="text-sm text-gray-600">Halo, {auth.user.name}</span>
                                            <Link
                                                href={route('dashboard')}
                                                className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                            >
                                                Dashboard
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border border-green-500 bg-transparent px-4 py-2 text-sm font-medium text-green-500 shadow-sm transition-colors hover:bg-green-50 focus-visible:ring-1 focus-visible:outline-none"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                            >
                                                Daftar
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-6">
                                    <motion.h1 variants={fadeIn} className="text-4xl leading-tight font-bold text-gray-800 md:text-5xl lg:text-6xl">
                                        Layanan Kesehatan <span className="text-green-500">Tanpa Antrian Panjang</span>
                                    </motion.h1>

                                    <motion.p variants={fadeIn} className="text-lg text-gray-600">
                                        Sistem pengaduan dan antrian digital untuk pengalaman layanan kesehatan yang lebih baik di Puskesmas Pana.
                                    </motion.p>

                                    <motion.div variants={fadeIn} className="mt-4 flex flex-col gap-4 sm:flex-row">
                                        <Link
                                            href={route('queue.view')}
                                            className="focus-visible:ring-ring inline-flex h-14 items-center justify-center rounded-md bg-green-500 px-8 text-base font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                        >
                                            Ambil Antrian <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route('complaints.index')}
                                            className="focus-visible:ring-ring inline-flex h-14 items-center justify-center rounded-md border border-green-500 bg-transparent px-8 text-base font-medium text-green-500 shadow-sm transition-colors hover:bg-green-50 focus-visible:ring-1 focus-visible:outline-none"
                                        >
                                            Buat Pengaduan
                                        </Link>
                                    </motion.div>

                                    <motion.div variants={fadeIn} className="mt-4 flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"></div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-bold text-green-500">1000+</span> pengguna telah menggunakan layanan kami
                                        </p>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <div className="relative z-10 overflow-hidden rounded-2xl bg-white shadow-xl">
                                        <div className="bg-green-500 p-4 text-white">
                                            <h3 className="text-xl font-bold">Antrian Saat Ini</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-6 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">Nomor Antrian</p>
                                                    <motion.p
                                                        key={currentQueue}
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-4xl font-bold text-gray-800"
                                                    >
                                                        {currentQueue}
                                                    </motion.p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Estimasi Waktu</p>
                                                    <p className="text-lg font-semibold text-gray-800">~15 menit</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-green-500" />
                                                    <p className="text-gray-600">08:00 - 16:00</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-green-500" />
                                                    <p className="text-gray-600">Senin - Jumat</p>
                                                </div>
                                            </div>

                                            <Link
                                                href={route('queue.view')}
                                                className="focus-visible:ring-ring mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                            >
                                                Ambil Nomor Antrian
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-100 opacity-70"></div>
                                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-green-100 opacity-70"></div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="bg-white py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Fitur Unggulan Kami</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Nikmati kemudahan akses layanan kesehatan dengan fitur-fitur inovatif yang kami tawarkan
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        icon: <Clock className="h-10 w-10 text-green-500" />,
                                        title: 'Antrian Digital',
                                        description: 'Ambil nomor antrian dari rumah dan dapatkan notifikasi saat giliran Anda hampir tiba.',
                                    },
                                    {
                                        icon: <MessageSquare className="h-10 w-10 text-green-500" />,
                                        title: 'Sistem Pengaduan',
                                        description: 'Sampaikan keluhan atau saran Anda dengan mudah dan dapatkan respons cepat.',
                                    },
                                    {
                                        icon: <Calendar className="h-10 w-10 text-green-500" />,
                                        title: 'Jadwal Konsultasi',
                                        description: 'Buat janji temu dengan dokter sesuai dengan jadwal yang tersedia.',
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.6,
                                                    delay: index * 0.1,
                                                },
                                            },
                                        }}
                                        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="mb-4">{feature.icon}</div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-800">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Kepala Puskesmas Section */}
                    <section className="bg-blue-50 py-16" id="informasi">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Kepala Puskesmas</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Pimpinan yang bertanggung jawab atas pelayanan kesehatan masyarakat
                                </p>
                            </motion.div>

                            <div className="mx-auto max-w-4xl">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="flex flex-col items-center gap-8 md:flex-row"
                                >
                                    <div className="w-full md:w-1/3">
                                        <div className="overflow-hidden rounded-lg shadow-md">
                                            <img
                                                src="/placeholder.svg?height=400&width=300"
                                                alt="Kepala Puskesmas"
                                                className="h-auto w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <h3 className="mb-4 text-2xl font-bold text-gray-800">Profil Kepala Puskesmas</h3>
                                        <p className="mb-4 text-gray-600">
                                            Kepala puskesmas adalah tenaga kesehatan yang bertanggung jawab penuh dalam mengatur dan menjalankan semua
                                            kegiatan pelayanan di Pusat Kesehatan Masyarakat (Puskesmas). Ia memegang peran penting sebagai pemimpin
                                            dan pengelola, mulai dari merencanakan, melaksanakan, mengevaluasi, hingga mengawasi berbagai program
                                            kesehatan, baik yang bersifat pencegahan, pengobatan, maupun pemulihan.
                                        </p>
                                        <p className="text-gray-600">
                                            Selain itu, kepala puskesmas juga mengurus manajemen tenaga kerja, administrasi, dan keuangan puskesmas,
                                            serta menjalin kerja sama dengan berbagai pihak untuk meningkatkan kesehatan masyarakat di wilayahnya.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Staff Section */}
                    <section className="bg-white py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Staf Puskesmas</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Tim profesional yang berdedikasi untuk melayani kesehatan masyarakat
                                </p>
                            </motion.div>

                            <div className="mx-auto max-w-4xl">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="flex flex-col gap-8"
                                >
                                    <div className="overflow-hidden rounded-lg shadow-md">
                                        <img
                                            src="/placeholder.svg?height=500&width=1000"
                                            alt="Staf Puskesmas"
                                            className="h-auto w-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-600">
                                            Foto ini menampilkan para staf Puskesmas yang terdiri dari tenaga medis dan non-medis yang bekerja sama
                                            dalam memberikan pelayanan kesehatan kepada masyarakat. Mereka mengenakan seragam dinas dan tampak berdiri
                                            dengan rapi, mencerminkan profesionalisme, kekompakan, dan dedikasi dalam menjalankan tugas di lingkungan
                                            kerja. Suasana di dalam foto menunjukkan semangat kebersamaan dan komitmen dalam mewujudkan pelayanan
                                            kesehatan yang optimal.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section id="how-it-works" className="bg-blue-50 py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Cara Kerja</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Proses sederhana untuk mendapatkan layanan kesehatan yang lebih baik
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {[
                                    {
                                        step: '01',
                                        title: 'Daftar & Login',
                                        description: 'Buat akun atau masuk ke akun yang sudah ada untuk mengakses semua fitur.',
                                    },
                                    {
                                        step: '02',
                                        title: 'Pilih Layanan',
                                        description: 'Pilih layanan yang Anda butuhkan: antrian, pengaduan, atau konsultasi.',
                                    },
                                    {
                                        step: '03',
                                        title: 'Dapatkan Pelayanan',
                                        description: 'Kunjungi puskesmas sesuai jadwal atau tunggu respons untuk pengaduan Anda.',
                                    },
                                ].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.6,
                                                    delay: index * 0.2,
                                                },
                                            },
                                        }}
                                        className="relative"
                                    >
                                        <div className="relative z-10 rounded-xl bg-white p-8 shadow-md">
                                            <div className="mb-4 text-5xl font-bold text-green-100">{step.step}</div>
                                            <h3 className="mb-2 text-xl font-bold text-gray-800">{step.title}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>

                                        {index < 2 && (
                                            <div className="absolute top-1/2 -right-4 z-0 hidden -translate-y-1/2 transform md:block">
                                                <ChevronRight className="h-8 w-8 text-green-500" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section id="testimonials" className="bg-white py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Apa Kata Mereka</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Pengalaman pengguna yang telah merasakan manfaat dari layanan kami
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {[
                                    {
                                        name: 'Budi Santoso',
                                        role: 'Pasien BPJS',
                                        testimonial:
                                            'Sangat membantu! Saya tidak perlu lagi mengantri berjam-jam di puskesmas. Cukup ambil nomor antrian dari rumah dan datang saat giliran hampir tiba.',
                                    },
                                    {
                                        name: 'Siti Rahayu',
                                        role: 'Ibu Rumah Tangga',
                                        testimonial:
                                            'Sistem pengaduannya sangat responsif. Saya pernah melaporkan masalah fasilitas dan dalam 2 hari sudah ada tindak lanjut. Terima kasih Puskesmas Pana!',
                                    },
                                    {
                                        name: 'Ahmad Hidayat',
                                        role: 'Pekerja Kantoran',
                                        testimonial:
                                            'Fitur jadwal konsultasi sangat membantu saya yang sibuk bekerja. Bisa menyesuaikan jadwal kontrol dengan waktu luang saya.',
                                    },
                                ].map((testimonial, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.6,
                                                    delay: index * 0.1,
                                                },
                                            },
                                        }}
                                        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                                    >
                                        <div className="mb-4 text-green-500">
                                            {Array(5)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <span key={i} className="text-yellow-400">
                                                        ★
                                                    </span>
                                                ))}
                                        </div>
                                        <p className="mb-6 text-gray-600">"{testimonial.testimonial}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="bg-blue-50 py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Pertanyaan Umum</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
                            </motion.div>

                            <div className="mx-auto max-w-3xl">
                                {[
                                    {
                                        question: 'Bagaimana cara mengambil nomor antrian?',
                                        answer: "Anda dapat mengambil nomor antrian melalui aplikasi dengan login ke akun Anda, pilih menu 'Ambil Antrian', pilih poli yang diinginkan, dan konfirmasi. Anda akan mendapatkan notifikasi saat giliran Anda hampir tiba.",
                                    },
                                    {
                                        question: 'Apakah layanan ini gratis?',
                                        answer: 'Ya, layanan pengambilan nomor antrian dan pengaduan melalui aplikasi ini sepenuhnya gratis. Biaya pengobatan tetap mengikuti ketentuan yang berlaku di puskesmas.',
                                    },
                                    {
                                        question: 'Bagaimana jika saya tidak bisa datang sesuai jadwal?',
                                        answer: 'Anda dapat membatalkan atau menjadwalkan ulang melalui aplikasi minimal 2 jam sebelum jadwal yang telah ditentukan. Jika tidak, nomor antrian Anda akan hangus dan Anda perlu mengambil nomor antrian baru.',
                                    },
                                    {
                                        question: 'Berapa lama respons untuk pengaduan?',
                                        answer: 'Kami berkomitmen untuk merespons setiap pengaduan dalam waktu 1-3 hari kerja, tergantung pada kompleksitas masalah yang dilaporkan.',
                                    },
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    duration: 0.4,
                                                    delay: index * 0.1,
                                                },
                                            },
                                        }}
                                        className="mb-4"
                                    >
                                        <div className="rounded-xl bg-white p-6 shadow-sm">
                                            <h3 className="mb-2 text-lg font-bold text-gray-800">{faq.question}</h3>
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="bg-white py-16">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mb-16 text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Hubungi Kami</h2>
                                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                    Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan
                                </p>
                            </motion.div>

                            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.6 },
                                        },
                                    }}
                                    className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <Phone className="h-6 w-6 text-green-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-800">Telepon</h3>
                                    <p className="text-gray-600">(021) 1234-5678</p>
                                    <p className="text-gray-600">0812-3456-7890</p>
                                </motion.div>

                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.6, delay: 0.1 },
                                        },
                                    }}
                                    className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <Mail className="h-6 w-6 text-green-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-800">Email</h3>
                                    <p className="text-gray-600">info@puskesmaspana.go.id</p>
                                    <p className="text-gray-600">pengaduan@puskesmaspana.go.id</p>
                                </motion.div>

                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.6, delay: 0.2 },
                                        },
                                    }}
                                    className="flex flex-col items-center rounded-xl border border-gray-100 p-6 text-center shadow-sm"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <MapPin className="h-6 w-6 text-green-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-800">Alamat</h3>
                                    <p className="text-gray-600">Jl. Kesehatan No. 123</p>
                                    <p className="text-gray-600">Kecamatan Pana, 12345</p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-green-500 py-16 text-white">
                        <div className="container mx-auto px-4">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mx-auto max-w-3xl text-center"
                            >
                                <h2 className="mb-6 text-3xl font-bold md:text-4xl">Mulai Gunakan Layanan Kami Sekarang</h2>
                                <p className="mb-8 text-lg text-white/90">
                                    Nikmati kemudahan akses layanan kesehatan tanpa antrian panjang. Daftar sekarang dan rasakan perbedaannya!
                                </p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <Link
                                        href={route('register')}
                                        className="focus-visible:ring-ring inline-flex h-14 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-green-500 shadow transition-colors hover:bg-gray-100 focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="focus-visible:ring-ring inline-flex h-14 items-center justify-center rounded-md border border-white bg-transparent px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-green-600 focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Pelajari Lebih Lanjut
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 py-12 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="rounded-md bg-green-500 p-1.5 text-white">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-bold">Puskesmas Pana</span>
                                </div>
                                <p className="mb-4 text-gray-400">
                                    Sistem pengaduan dan antrian digital untuk pengalaman layanan kesehatan yang lebih baik.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Antrian Digital
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Pengaduan Pasien
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Jadwal Dokter
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Konsultasi Online
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Informasi</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Tentang Kami
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Jam Operasional
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Fasilitas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Artikel Kesehatan
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Bantuan</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Kebijakan Privasi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Syarat & Ketentuan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                            Hubungi Kami
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
                            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Puskesmas Pana. Hak Cipta Dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
