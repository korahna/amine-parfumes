export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* AdminSidebar will go here */}
      <main>{children}</main>
    </div>
  )
}
