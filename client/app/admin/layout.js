'use client'
import AdminProtected from "../hooks/AdminProtected";
import Heading from "../utils/Heading";
import Sidebar from "../components/Admin/layouts/Sidebar";
import Header from "../components/Admin/layouts/Header";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminProtected>
        <Heading
          title={`ELP - Admin`}
          description="LMS using MERN"
          keywords="MERN, Redux, Redis"
        />
        <div className="flex">
          <Sidebar />
          <main className="w-full flex-1 overflow-hidden">
            <Header />
            {children}
          </main>
        </div>
      </AdminProtected>
    </>
  )
}