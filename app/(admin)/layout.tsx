import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { DashboardLayout } from "@/components/admin/DashboardLayout"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login?redirect=/administracao")
  }

  if (session.nivel !== 1) {
    redirect("/login")
  }

  return (
    <DashboardLayout
      user={{
        email: session.email || "",
        nome: session.nome,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
