"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Head, Link, useForm } from "@inertiajs/react"
import { Calendar, Eye, EyeOff, FileText, Heart, Home, Mail, Phone, User, Users } from 'lucide-react'
import type React from "react"
import { useState } from "react"

declare global {
  interface Window {
    route: any
  }
}

export default function Register() {
  const { data, setData, post, processing, errors, setError } = useForm({
    bpjs: "",
    nobpjs: "",
    name: "",
    email: "",
    nik: "",
    phone: "",
    address: "",
    gender: "",
    birthdate: "",
    password: "",
    password_confirmation: "",
  })

  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) return "Kata sandi harus mengandung huruf besar."
    if (!hasNumber) return "Kata sandi harus mengandung angka."
    if (!hasSymbol) return "Kata sandi harus mengandung simbol."

    return ""
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setData("password", value)

    const error = validatePassword(value)
    setError("password", error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(window.route("register"), {
      onSuccess: () => {
        toast({
          title: "Registrasi berhasil",
          description: "Akun Anda telah berhasil didaftarkan",
        })
      },
    })
  }

  // Toggle password visibility functions
  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <>
      <Head title="Daftar" />
      <div className="min-h-screen flex flex-col md:flex-row">
    
        {/* Registration Form Section */}
        <div className="md:w-1/1 flex items-center justify-center p-4 md:p-8 bg-background">
          <div className="w-full max-w-3xl">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6">
                <div className="flex justify-center mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-primary">Registrasi Pasien</CardTitle>
                <CardDescription className="text-center">
                  Buat akun untuk mengirim keluhan dan melihat antrean
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* BPJS Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="bpjs" className="flex items-center gap-2 font-medium">
                        <Heart className="h-4 w-4 text-primary" />
                        Mendaftar Sebagai
                      </Label>
                      <Select value={data.bpjs} onValueChange={(value) => setData("bpjs", value)}>
                        <SelectTrigger className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20">
                          <SelectValue placeholder="Pilih Sebagai pasien apa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Non BPJS</SelectItem>
                          <SelectItem value="1">BPJS</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.bpjs && <p className="text-sm text-destructive">{errors.bpjs}</p>}
                    </div>
                    
                    {/* BPJS Number */}
                    <div className="space-y-2">
                      <Label htmlFor="nobpjs" className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-primary" />
                        Nomor BPJS
                      </Label>
                      <Input
                        id="nobpjs"
                        maxLength={13}
                        value={data.nobpjs}
                        onChange={(e) => setData("nobpjs", e.target.value)}
                        className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                        placeholder="Masukkan nomor BPJS jika ada"
                      />
                      {errors.nobpjs && <p className="text-sm text-destructive">{errors.nobpjs}</p>}
                    </div>
                  </div>
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-primary" />
                      Nama Lengkap
                    </Label>
                    <Input 
                      id="name" 
                      value={data.name} 
                      onChange={(e) => setData("name", e.target.value)} 
                      required 
                      className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                      placeholder="Masukkan nama lengkap sesuai KTP"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* NIK */}
                  <div className="space-y-2">
                    <Label htmlFor="nik" className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4 text-primary" />
                      NIK (Nomor Induk Kependudukan)
                    </Label>
                    <Input
                      id="nik"
                      maxLength={16}
                      value={data.nik}
                      onChange={(e) => setData("nik", e.target.value)}
                      required
                      className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                      placeholder="Masukkan 16 digit NIK"
                    />
                    {errors.nik && <p className="text-sm text-destructive">{errors.nik}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Gender */}
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="flex items-center gap-2 font-medium">
                        <Users className="h-4 w-4 text-primary" />
                        Jenis Kelamin
                      </Label>
                      <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                        <SelectTrigger className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                    </div>

                    {/* Birthdate */}
                    <div className="space-y-2">
                      <Label htmlFor="birthdate" className="flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        Tanggal Lahir
                      </Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={data.birthdate}
                        onChange={(e) => setData("birthdate", e.target.value)}
                        required
                        className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                      />
                      {errors.birthdate && <p className="text-sm text-destructive">{errors.birthdate}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 font-medium">
                        <Phone className="h-4 w-4 text-primary" />
                        Nomor Telepon
                      </Label>
                      <Input 
                        id="phone" 
                        value={data.phone} 
                        onChange={(e) => setData("phone", e.target.value)} 
                        required 
                        className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                        placeholder="Contoh: 08123456789"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                        placeholder="email@contoh.com"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2 font-medium">
                      <Home className="h-4 w-4 text-primary" />
                      Alamat
                    </Label>
                    <Input
                      id="address"
                      value={data.address}
                      onChange={(e) => setData("address", e.target.value)}
                      required
                      className="h-11 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                      placeholder="Masukkan alamat lengkap"
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 font-medium">
                        <Eye className="h-4 w-4 text-primary" />
                        Kata Sandi
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={handlePasswordChange}
                          maxLength={6}
                          required
                          className="h-11 pr-10 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                          placeholder="Minimal 6 karakter"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation" className="flex items-center gap-2 font-medium">
                        <Eye className="h-4 w-4 text-primary" />
                        Konfirmasi Kata Sandi
                      </Label>
                      <div className="relative">
                        <Input
                          maxLength={6}
                          id="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          value={data.password_confirmation}
                          onChange={(e) => setData("password_confirmation", e.target.value)}
                          required
                          className="h-11 pr-10 bg-secondary/30 border-primary/10 focus:ring-primary/20"
                          placeholder="Ulangi kata sandi"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all" 
                      disabled={processing}
                    >
                      {processing ? "Memproses..." : "Daftar Sekarang"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-center py-6 bg-primary/5 border-t border-primary/10">
                <p className="text-sm">
                  Sudah punya akun?{" "}
                  <Link href={window.route("login")} className="text-primary font-medium hover:underline">
                    Masuk
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
