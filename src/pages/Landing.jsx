import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/api'

const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const times = ['7:00', '9:00', '11:00', '14:00']

// day: 0 = lunes ... 5 = sabado. time: fila del horario. span: cuantas filas ocupa.
const blocks = [
  { day: 0, time: 0, label: 'Lógica', short: 'Lógica', tone: 'border-pine/30 bg-pine/15' },
  { day: 2, time: 0, label: 'Bases de datos', short: 'Datos', tone: 'border-harbor/40 bg-harbor/20' },
  { day: 1, time: 1, label: 'Inglés', short: 'Inglés', tone: 'border-straw/60 bg-straw/30' },
  { day: 3, time: 1, label: 'Frontend', short: 'Front', tone: 'border-pine/30 bg-pine/15' },
  { day: 4, time: 2, label: 'Backend', short: 'Back', tone: 'border-harbor/40 bg-harbor/20' },
  { day: 0, time: 3, label: 'Tutoría', short: 'Tutoría', tone: 'border-straw/60 bg-straw/30' },
  { day: 5, time: 0, span: 3, label: 'Proyecto integrador', short: 'Proy.', tone: 'border-pine-dark bg-pine text-white' },
]

const modules = [
  { name: 'Estudiantes', to: '/estudiantes', text: 'Registra a cada estudiante con su documento y su fecha de nacimiento.' },
  { name: 'Programas', to: '/programas', text: 'Los programas académicos que ofrece la institución.' },
  { name: 'Periodos', to: '/periodos', text: 'Los ciclos académicos, con su fecha de inicio y de cierre.' },
  { name: 'Grupos', to: '/grupos', text: 'Un grupo une un programa, un periodo y una jornada.' },
  { name: 'Matrículas', to: '/matriculas', text: 'Inscribe estudiantes en un grupo, complétalas o cancélalas.' },
]

const steps = [
  { title: 'Crea un programa', text: 'Es la base: todo grupo pertenece a uno.' },
  { title: 'Define un periodo', text: 'Con sus fechas de inicio y de cierre.' },
  { title: 'Abre un grupo', text: 'Elige programa, periodo y jornada.' },
  { title: 'Registra estudiantes', text: 'Con su código y su documento.' },
  { title: 'Matricula', text: 'Une al estudiante con su grupo.' },
]

function ServerStatus() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true
    api
      .get('/api/programs', { timeout: 4000 })
      .then(() => active && setStatus('online'))
      .catch(() => active && setStatus('offline'))
    return () => {
      active = false
    }
  }, [])

  const dot = { checking: 'bg-line', online: 'bg-pine', offline: 'bg-rose' }[status]
  const text = {
    checking: 'Comprobando el servidor...',
    online: 'Servidor conectado',
    offline: 'No se detecta el servidor en el puerto 8081',
  }[status]

  return (
    <p className="mt-8 flex items-center gap-2 text-sm text-ink/60" role="status">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {text}
    </p>
  )
}

function Timetable() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -right-3 -top-3 h-full w-full rounded-3xl bg-mist" />
      <div
        role="img"
        aria-label="Ejemplo de horario semanal de un grupo sabatino"
        className="relative rounded-2xl border border-line bg-white p-4 shadow-[0_24px_48px_-28px_rgba(36,50,56,0.45)] sm:p-5"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <p className="font-display text-lg font-semibold">Grupo G1A</p>
          <p className="text-sm text-ink/60">Jornada sabatina</p>
        </div>

        <div className="grid grid-cols-[2rem_repeat(6,minmax(0,1fr))] gap-1 text-xs sm:grid-cols-[2.5rem_repeat(6,minmax(0,1fr))] sm:gap-1.5">
          {days.map((day, i) => (
            <div
              key={day}
              style={{ gridColumn: i + 2, gridRow: 1 }}
              className="pb-1 text-center font-medium text-ink/55"
            >
              {day}
            </div>
          ))}

          {times.map((time, row) => (
            <div
              key={time}
              style={{ gridColumn: 1, gridRow: row + 2 }}
              className="pt-1 text-[11px] text-ink/45"
            >
              {time}
            </div>
          ))}

          {times.map((time, row) =>
            days.map((day, col) => (
              <div
                key={`${time}-${day}`}
                style={{ gridColumn: col + 2, gridRow: row + 2 }}
                className="min-h-14 rounded-md bg-mist/60"
              />
            )),
          )}

          {blocks.map((block, i) => (
            <div
              key={block.label}
              style={{
                gridColumn: block.day + 2,
                gridRow: `${block.time + 2} / span ${block.span ?? 1}`,
                animationDelay: `${i * 110}ms`,
              }}
              className={`block-in flex items-start rounded-md border px-1 py-1.5 text-[10px] font-medium leading-tight sm:px-1.5 sm:text-[11px] ${block.tone}`}
            >
              <span className="sm:hidden">{block.short}</span>
              <span className="hidden sm:inline">{block.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Gestión académica
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#modulos" className="hidden text-ink/70 hover:text-ink sm:inline">
            Módulos
          </a>
          <a href="#orden" className="hidden text-ink/70 hover:text-ink sm:inline">
            Cómo empezar
          </a>
          <Link
            to="/estudiantes"
            className="rounded-md bg-pine px-4 py-2 font-medium text-white transition-colors hover:bg-pine-dark"
          >
            Entrar al sistema
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
          <div>
            <h1 className="font-display text-4xl font-semibold text-balance leading-[1.1] tracking-tight sm:text-5xl">
              Programas, grupos y matrículas en un solo lugar
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
              Administra la información académica de tu institución: registra estudiantes, abre grupos por periodo y
              matricula en pocos pasos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/estudiantes"
                className="rounded-md bg-pine px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-pine-dark"
              >
                Entrar al sistema
              </Link>
              <a
                href="#orden"
                className="rounded-md border border-line bg-white px-5 py-3 text-sm font-medium transition-colors hover:bg-mist"
              >
                Ver cómo empezar
              </a>
            </div>
            <ServerStatus />
          </div>

          <Timetable />
        </section>

        <section id="modulos" className="border-y border-line bg-white/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Lo que puedes gestionar</h2>
              <p className="mt-3 max-w-sm leading-relaxed text-ink/70">
                Cada módulo tiene su lista, su búsqueda y su formulario. Todo lo que guardes queda en la base de datos
                del proyecto.
              </p>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {modules.map((module) => (
                <li key={module.name}>
                  <Link
                    to={module.to}
                    className="group -mx-2 flex items-baseline justify-between gap-6 rounded-md px-2 py-5 transition-colors hover:bg-mist/70"
                  >
                    <div>
                      <p className="font-display text-xl font-medium">{module.name}</p>
                      <p className="mt-1 text-sm text-ink/65">{module.text}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-pine group-hover:underline">Abrir</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="orden" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Para empezar, sigue este orden</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-ink/70">
            Unos datos dependen de otros: un grupo necesita programa y periodo, y una matrícula necesita estudiante y
            grupo.
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-pine/40 font-display text-pine">
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-lg font-medium">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-ink/55">
          <p>Proyecto integrador CESDE 2026</p>
          <p>Gestión académica</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
