"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

declare global {
  interface Window {
    route: any
  }
}

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: "",
    password: "",
    remember: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(window.route("login"), {
      onFinish: () => reset("password"),
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Health Center Image Section - Takes full height on desktop, partial on mobile */}
      <div className="md:w-1/2 relative h-48 md:h-screen overflow-hidden bg-primary/10">
        <img src="/gedung-puskesmas.jpg" alt="Gedung Puskesmas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Sistem Informasi Puskesmas</h2>
          <p className="text-sm opacity-90">Melayani dengan sepenuh hati untuk kesehatan masyarakat</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Head title="Masuk" />

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Masuk</CardTitle>
              <CardDescription className="text-center">Masukkan kredensial Anda untuk mengakses sistem</CardDescription>
            </CardHeader>

            <CardContent>
              {status && (
                <div className="mb-4 p-3 rounded-md bg-green-50 text-center text-sm font-medium text-green-600">
                  {status}
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-medium">
                      Alamat Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="email@contoh.com"
                      className="h-11"
                    />
                    <InputError message={errors.email} />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="font-medium">
                        Kata Sandi
                      </Label>
                      {canResetPassword && (
                        <TextLink href={window.route("password.request")} className="ml-auto text-sm" tabIndex={5}>
                          Lupa kata sandi?
                        </TextLink>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      placeholder="Kata Sandi"
                      className="h-11"
                    />
                    <InputError message={errors.password} />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={data.remember}
                      onClick={() => setData("remember", !data.remember)}
                      tabIndex={3}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Ingat saya
                    </Label>
                  </div>

                  <Button type="submit" className="mt-2 w-full h-11 font-medium" tabIndex={4} disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk
                  </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                  Belum punya akun?{" "}
                  <TextLink href={window.route("register")} tabIndex={5} className="font-medium">
                    Daftar
                  </TextLink>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
