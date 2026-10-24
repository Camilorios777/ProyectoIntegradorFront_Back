import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landing from '../pages/Landing'
import Students from '../pages/Students'
import Programs from '../pages/Programs'
import Periods from '../pages/Periods'
import Groups from '../pages/Groups'
import Enrollments from '../pages/Enrollments'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<MainLayout />}>
        <Route path="/estudiantes" element={<Students />} />
        <Route path="/programas" element={<Programs />} />
        <Route path="/periodos" element={<Periods />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/matriculas" element={<Enrollments />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
