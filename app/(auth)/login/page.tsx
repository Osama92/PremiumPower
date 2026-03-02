"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2 } from "lucide-react"

const DEMO_ACCOUNTS = [
  { role: "Admin", icon: "👑", email: "admin@pps.ng", password: "demo1234", color: "bg-[#1B3A5C] text-white" },
  { role: "Customer Svc", icon: "📞", email: "support@pps.ng", password: "demo1234", color: "bg-indigo-600 text-white" },
  { role: "Engineer", icon: "🔧", email: "tech@pps.ng", password: "demo1234", color: "bg-orange-600 text-white" },
  { role: "Customer", icon: "👤", email: "customer@pps.ng", password: "demo1234", color: "bg-teal-600 text-white" },
]

async function doSignIn(email: string, password: string): Promise<{ ok: boolean }> {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })
  // NextAuth v5: server returns 302 on success, so result.ok is false even for success.
  // Only treat it as failed if there is an explicit error param in the redirect URL.
  if (!result) return { ok: false }
  if (result.error) return { ok: false }
  return { ok: true }
}

async function getRole(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/session")
    const session = await res.json()
    return session?.user?.role ?? null
  } catch {
    return null
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quickLoginId, setQuickLoginId] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    try {
      const { ok } = await doSignIn(data.email, data.password)
      if (!ok) {
        toast.error("Invalid email or password")
        return
      }
      const role = await getRole()
      router.push(role === "CUSTOMER" ? "/portal" : "/dashboard")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function quickLogin(email: string, password: string, roleLabel: string) {
    setQuickLoginId(email)
    try {
      const { ok } = await doSignIn(email, password)
      if (!ok) {
        toast.error("Quick login failed — please try the form below")
        return
      }
      toast.success(`Signed in as ${roleLabel}`)
      const role = await getRole()
      router.push(role === "CUSTOMER" ? "/portal" : "/dashboard")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setQuickLoginId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A5C] via-[#1B3A5C]/90 to-[#0d2240] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left — Branding */}
        <div className="flex flex-col justify-center text-white space-y-6">
          <div className="flex items-center gap-4">
            <Image
              src="/pps-logo.png"
              alt="PPS Logo"
              width={72}
              height={72}
              className="rounded-xl object-contain bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-bold">PPS Hub</h1>
              <p className="text-sm text-white/70">Premium Power Solutions Limited</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Reliable Power,<br />
              <span className="text-[#D4A843]">Seamless Management</span>
            </h2>
            <p className="mt-3 text-white/70">
              The all-in-one platform for generator rentals, repairs, spare parts, and maintenance across Lagos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Generators", value: "15+" },
              { label: "Events Powered", value: "4,000+" },
              { label: "KVA Range", value: "7–1500" },
              { label: "Years Experience", value: "7+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-[#D4A843]">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login form + demo accounts */}
        <div className="space-y-4">
          <Card className="shadow-2xl border-0">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-semibold text-[#1B3A5C]">Sign in to PPS Hub</h3>
              <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#1B3A5C] hover:bg-[#1B3A5C]/90"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-xl border-[#D4A843]/30 bg-amber-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h4 className="text-sm font-semibold text-[#1B3A5C]">Demo Accounts — Click to login instantly</h4>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => quickLogin(acc.email, acc.password, acc.role)}
                    disabled={quickLoginId !== null}
                    className={`${acc.color} rounded-lg p-3 text-left transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{acc.icon}</span>
                      {quickLoginId === acc.email && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                    <p className="text-xs font-semibold">{acc.role}</p>
                    <p className="text-xs opacity-80 truncate">{acc.email}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                All demo accounts use password: <code className="bg-gray-100 px-1 rounded">demo1234</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
