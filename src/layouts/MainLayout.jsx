import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
