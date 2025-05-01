"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Head, Link, useForm } from "@inertiajs/react"
import { Eye, EyeOff } from "lucide-react"
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Registrasi Pasien</CardTitle>
            <CardDescription className="text-center">
              Buat akun untuk mengirim keluhan dan melihat antrean
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bpjs">Mendaftar Sebagai</Label>
                <Select value={data.bpjs} onValueChange={(value) => setData("bpjs", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Sebagai pasien apa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Non BPJS</SelectItem>
                    <SelectItem value="1">BPJS</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bpjs && <p className="text-sm text-red-500">{errors.bpjs}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nomor BPJS</Label>
                <Input
                  id="name"
                  maxLength={13}
                  value={data.nobpjs}
                  onChange={(e) => setData("nobpjs", e.target.value)}
                />
                {errors.nobpjs && <p className="text-sm text-red-500">{errors.nobpjs}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                <Input
                  id="nik"
                  maxLength={16}
                  value={data.nik}
                  onChange={(e) => setData("nik", e.target.value)}
                  required
                />
                {errors.nik && <p className="text-sm text-red-500">{errors.nik}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Tanggal Lahir</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={data.birthdate}
                    onChange={(e) => setData("birthdate", e.target.value)}
                    required
                  />
                  {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} required />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData("address", e.target.value)}
                  required
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handlePasswordChange}
                    maxLength={6}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Input
                    maxLength={6}
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                Daftar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link href={window.route("login")} className="text-primary hover:underline">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
