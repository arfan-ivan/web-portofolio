import { useEffect, useRef, useState } from 'react'
import {
  Code2, Terminal, SquareTerminal, Network, Server, Wrench, Braces, Wifi, Cpu, Database, Settings, Pencil,
  Monitor, FileText, Gamepad2, Send, User, Mail, Box, MessageCircle, CloudDownload, Cloud,
  GraduationCap, Briefcase, Menu, X, Rocket, Laptop, Coffee, Orbit, Mouse, GitBranch
} from 'lucide-react'
import { skyAt, fxAt, startCycle, starOpacity } from './sky'
import tile from './assets/cloud.webp'
import { useProjects } from './projects'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faLinkedinIn,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons'
import profile from './assets/arfan.png'
import resume from './assets/Arfan-Nur-Ivandi-Resume.pdf'
import emailjs from '@emailjs/browser'
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold })
    o.observe(ref.current)
    return () => o.disconnect()
  }, [threshold])
  return [ref, v]
}

function R({ children, d = 0, className = '' }) {
  const [ref, v] = useInView()
  return (
    <div ref={ref} style={{ transitionDelay: v ? d + 'ms' : '0ms' }}
      className={`transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

function Clouds({ className = '', dur = 90, s = 1, op = 1, rev = false, light = false }) {
  const row = { width: 'calc(100% + var(--tw))', height: '100%', animation: `drift ${dur}s linear infinite ${rev ? 'reverse' : ''}` }
  const layer = light
    ? {
        ...row,
        background: 'linear-gradient(to bottom, color-mix(in srgb, var(--light) 45%, #fff), var(--light) 65%)',
        WebkitMaskImage: `url(${tile})`, maskImage: `url(${tile})`,
        WebkitMaskSize: 'var(--tw) 100%', maskSize: 'var(--tw) 100%',
        WebkitMaskRepeat: 'repeat-x', maskRepeat: 'repeat-x'
      }
    : {
        ...row,
        backgroundImage: `url(${tile})`, backgroundSize: 'var(--tw) 100%', backgroundRepeat: 'repeat-x',
        filter: 'hue-rotate(var(--hue)) brightness(var(--cb))'
      }
  return (
    <div className={`absolute left-0 w-full overflow-hidden pointer-events-none ${className}`}
      style={{ '--tw': `calc(var(--ch) * ${s} * 8.861)`, height: `calc(var(--ch) * ${s})`, opacity: op }}>
      <div style={layer} />
    </div>
  )
}

const dots = Array.from({ length: 70 }, (_, i) => [(i * 37.7) % 100, (i * 53.3) % 97, (i % 3) + 1.4, i % 8 === 0])
const rings = [[8, 30], [92, 8], [75, 55], [30, 70], [55, 12]]

function Sky() {
  return (
    <>
      <div className="sky absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 overflow-hidden" style={{ opacity: 'var(--stars)' }}>
        <div className="absolute -inset-4 sway">
          {dots.map(([x, y, z, t], i) => (
            <span key={i} className={`absolute rounded-full bg-white ${t ? 'twinkle' : 'opacity-70'}`}
              style={{ left: x + '%', top: y + '%', width: z, height: z, animationDelay: (i % 5) + 's', animationDuration: 3 + (i % 4) + 's' }} />
          ))}
          {rings.map(([x, y], i) => (
            <span key={'r' + i} className="absolute rounded-full border border-white/70" style={{ left: x + '%', top: y + '%', width: 9, height: 9 }} />
          ))}
        </div>
      </div>
    </>
  )
}

function Spark({ flip }) {
  return (
    <span className={`flex flex-col gap-1.5 text-[var(--acc)] ${flip ? 'scale-x-[-1]' : ''}`}>
      <i className="block w-4 h-0.5 bg-current -rotate-[25deg]" />
      <i className="block w-4 h-0.5 bg-current rotate-[25deg]" />
    </span>
  )
}

function Script({ children }) {
  return <h2 className="font-script text-4xl md:text-5xl text-center">{children}</h2>
}

function Ring({ pct, label, sub, icon: Icon }) {
  const [ref, v] = useInView()
  const c = 2 * Math.PI * 52
  return (
    <div ref={ref} className="flex flex-col items-center text-center px-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" style={{ filter: 'url(#crayon)' }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="9" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={v ? c * (1 - pct / 100) : c} style={{ transition: 'stroke-dashoffset 1.6s ease-out' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold">{pct}%</span>
        <Icon className="absolute -bottom-1 -right-1 w-8 h-8 p-1.5 rounded-lg bg-white/80" />
      </div>
      <h3 className="mt-3 font-extrabold text-lg">{label}</h3>
      <p className="text-sm opacity-75 max-w-48">{sub}</p>
    </div>
  )
}

const links = [['home', 'Home'], ['about', 'About'], ['edu', 'Education'], ['skills', 'Skills'], ['abilities', 'Abilities'], ['projects', 'Projects'], ['contact', 'Contact']]

const timeline = [
  ['Sep 2019 - Jun 2022', 'Senior High School', 'SMA Islam Kepanjen, Kabupaten Malang, Jawa Timur', GraduationCap],
  ['2022 - In Progress', 'Bachelor of Informatics', 'Universitas Islam Raden Rahmat Malang, Malang, Jawa Timur', GraduationCap],
  ['2022 - In Progress', 'Freelance IT & Web Developer', 'Web Development, Laravel, Python, Golang, Database, Linux Server, Malang, Jawa Timur', Briefcase],
  ['2022 - In Progress', 'IoT & Embedded Programmer', 'IoT Systems, Embedded Programming, Microcontrollers, Sensors, Hardware Integration, Malang, Jawa Timur', Cpu],
  ['2022 - In Progress', 'Electronics Technician', 'Electronic Repair, Hardware Troubleshooting, Circuit Testing, Component Replacement, Malang, Jawa Timur', Wrench]
]

const skills = [
  [90, 'Web Development', 'Laravel, PHP, HTML5, CSS3, JavaScript, REST API', Code2],
  [85, 'Python & Programming', 'Python, Golang, scripting, automation, backend development', Code2],
  [85, 'Linux & Server', 'Ubuntu, Fedora, Docker, Podman, server administration, troubleshooting', Server],
  [80, 'Networking', 'MikroTik, TCP/IP, DHCP, PPPoE, DNS, VPN, network troubleshooting', Network],
  [80, 'IoT & Embedded Systems', 'Microcontrollers, sensors, embedded programming, hardware integration', Cpu],
  [75, 'Electronics', 'Electronic repair, circuit testing, component replacement, hardware troubleshooting', Wrench],
  [75, 'Database', 'MySQL, PostgreSQL, MongoDB, database design and management', Database],
  [70, 'Git & Development Tools', 'Git, GitHub, Linux development environment, Docker, API development', GitBranch],
  [85, 'Photoshop', 'Illustration, Photomanipulation, Digital Painting, User Interface', Monitor]
]

const abilities = [
  [Code2, 'Software Development', 'Web Development, Backend, REST APIs, Database, Python, Golang, Laravel'],
  [Server, 'Server & Linux', 'Linux Administration, Ubuntu, Fedora, Docker, Podman, Server Deployment, Troubleshooting'],
  [Wifi, 'Networking', 'MikroTik, TCP/IP, DHCP, PPPoE, DNS, VPN, Network Configuration, Troubleshooting'],
  [Cpu, 'IoT & Embedded Systems', 'Embedded Programming, Microcontrollers, Sensors, IoT Systems, Hardware Integration'],
  [Wrench, 'Electronics & Repair', 'Electronic Repair, Circuit Testing, Component Replacement, Hardware Troubleshooting, Maintenance'],
  [Database, 'Database & Data', 'MySQL, PostgreSQL, MongoDB, Database Design, Data Management']
]

const mySkills = [[Terminal, 'Linux'], [Network, 'Networking'], [Code2, 'Web Dev'], [Server, 'Server'], [Wrench, 'Troubleshooting'], [Braces, 'Python'], [SquareTerminal, 'Bash']]

const chips = [
  [Code2, 'left-[8%] top-[4%]', 'w-14 h-14'], [Cloud, 'left-0 top-[38%]', 'w-14 h-14'], [Settings, 'left-[6%] bottom-[8%]', 'w-12 h-12'],
  [FileText, 'right-[6%] top-[2%]', 'w-12 h-12'], [Settings, 'right-0 top-[40%]', 'w-14 h-14'], [Terminal, 'right-[12%] bottom-[2%]', 'w-14 h-12']
]

const code = [[70, 74, 60, '#ffb4b4'], [92, 74, 70, '#6ee7d0'], [82, 88, 96, '#93c5fd'], [70, 102, 80, '#fbbf24'], [92, 102, 60, '#fda4af'], [82, 116, 100, '#93c5fd'], [70, 130, 70, '#fb923c'], [86, 144, 90, '#a5b4fc']]

const PAGE = 6

function Projects({ className }) {
  const { items, loading } = useProjects()
  const [page, setPage] = useState(0)
  const [fade, setFade] = useState(false)
  const pages = Math.max(1, Math.ceil(items.length / PAGE))
  const cur = Math.min(page, pages - 1)
  const shown = items.slice(cur * PAGE, cur * PAGE + PAGE)
  const go = (n) => {
    if (n === cur) return
    setFade(true)
    setTimeout(() => {
      setPage(n)
      setFade(false)
    }, 250)
  }
  const pb = 'w-10 h-10 rounded-full font-extrabold border-2 border-[var(--acc)] transition disabled:opacity-40'
  return (
    <section id="projects" className={className}>
      <R><h2 className="flex items-center justify-center gap-4 text-3xl md:text-4xl font-extrabold tracking-wide"><Spark />PROJECTS<Spark flip /></h2></R>
      <div key={cur} className={`max-w-5xl mx-auto mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-8 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
        {shown.map((p, i) => (
          <R key={p.id} d={i * 100}>
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="aspect-video overflow-hidden rounded-3xl border-[3px] border-[var(--acc)] bg-white/60">
                <img src={p.thumb} alt={p.title} loading="lazy" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-3 text-center font-extrabold transition group-hover:text-[var(--acc)]">{p.title}</h3>
            </a>
          </R>
        ))}
      </div>
      {!shown.length && <p className="text-center mt-14 opacity-70">{loading ? 'Memuat project...' : 'Belum ada project.'}</p>}
      {pages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2 text-[var(--acc)]">
          <button className={pb} disabled={cur === 0} onClick={() => go(cur - 1)} aria-label="Sebelumnya">‹</button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => go(i)} className={`${pb} ${i === cur ? 'bg-[var(--acc)] text-white' : ''}`}>{i + 1}</button>
          ))}
          <button className={pb} disabled={cur === pages - 1} onClick={() => go(cur + 1)} aria-label="Berikutnya">›</button>
        </div>
      )}
      <Clouds className="bottom-0" s={0.5} dur={130} />
    </section>
  )
}

export default function App() {
  const root = useRef(null)
  const body = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [c0] = useState(startCycle)
  const [init] = useState(() => {
    const s = skyAt(c0)
    const f = fxAt(c0)
    const o = { '--stars': starOpacity(c0), '--hue': f.hue, '--cb': f.cb }
    for (const k in s) o['--' + k] = s[k]
    return o
  })

  useEffect(() => {
    const t0 = performance.now()
    let id
    const tick = (t) => {
      const c = (c0 + (t - t0) / 60000) % 2
      const p = c % 1
      const s = skyAt(c)
      const f = fxAt(c)
      const r = root.current.style
      for (const k in s) r.setProperty('--' + k, s[k])
      r.setProperty('--hue', f.hue)
      r.setProperty('--cb', f.cb)
      r.setProperty('--stars', starOpacity(c))
      const sun = c < 1
      const b = body.current
      b.style.left = 90 - p * 80 + '%'
      b.style.top = 72 - 58 * Math.sin(Math.PI * p) + '%'
      const v = (k, x) => b.style.setProperty(k, x)
      v('--b1', sun ? '#fde047' : '#e3eeff')
      v('--b2', sun ? '#fff9b8' : '#ffffff')
      v('--glow', sun ? '#fbbf24' : '#9ec1f5')
      v('--cr', sun ? 0 : 0.45)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [c0])

  useEffect(() => {
    const all = () => document.querySelectorAll('[data-speed]')
    const measure = () =>
      all().forEach((e) => {
        const r = e.getBoundingClientRect()
        const c = r.top + window.scrollY - (e._ty || 0) + r.height / 2
        e._a = c < window.innerHeight ? 0 : c - window.innerHeight / 2
      })
    const run = () =>
      all().forEach((e) => {
        e._ty = (window.scrollY - (e._a || 0)) * e.dataset.speed
        e.style.transform = `translateY(${e._ty}px)`
      })
    let f
    const on = () => {
      cancelAnimationFrame(f)
      f = requestAnimationFrame(run)
    }
    const re = () => {
      measure()
      on()
    }
    re()
    const t = setTimeout(re, 800)
    window.addEventListener('scroll', on)
    window.addEventListener('resize', re)
    window.addEventListener('load', re)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(f)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', re)
      window.removeEventListener('load', re)
    }
  }, [])

  useEffect(() => {
    const o = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    links.forEach(([id]) => o.observe(document.getElementById(id)))
    return () => o.disconnect()
  }, [])

  const light = 'relative z-10 px-6 pt-24 pb-44 text-[var(--ink)] paper'
  const dark = 'relative z-10 px-6 pt-28 pb-44 text-[var(--on)]'

  return (
    <div ref={root} style={init} className="relative min-h-screen">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="3" result="w" />
            <feDisplacementMap in="SourceGraphic" in2="w" scale="10" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="8" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3.2 0 0 0 -0.2" result="a" />
            <feComposite in="d" in2="a" operator="in" />
          </filter>
        </defs>
      </svg>
      <button onClick={() => setOpen(!open)} aria-label="Menu" className="fixed top-5 right-5 z-50 p-3 rounded-full bg-white/25 backdrop-blur text-white">
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav className="fixed inset-0 z-40 bg-black/60 backdrop-blur flex flex-col items-center justify-center gap-6">
          {links.map(([id, l]) => (
            <a key={id} href={'#' + id} onClick={() => setOpen(false)} className="font-script text-3xl text-white">{l}</a>
          ))}
        </nav>
      )}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4">
        {links.map(([id, l]) => (
          <a key={id} href={'#' + id} aria-label={l}
            className={`rounded-full transition-all duration-300 ${active === id ? 'w-4 h-4 border-2 border-[var(--acc)] bg-[var(--acc)]/30' : 'w-1.5 h-1.5 bg-[var(--acc)]'}`} />
        ))}
      </nav>

      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden text-[var(--on)] px-6 pt-24 pb-64">
        <Sky />
        <div ref={body} className="absolute -z-10 w-32 h-32 md:w-48 md:h-48 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="98" style={{ fill: 'var(--glow,#9ec1f5)', opacity: 0.22 }} />
            <circle cx="100" cy="100" r="82" style={{ fill: 'var(--glow,#9ec1f5)', opacity: 0.35 }} />
            <circle cx="100" cy="100" r="64" style={{ fill: 'var(--b1,#e3eeff)' }} />
            <circle cx="84" cy="84" r="34" style={{ fill: 'var(--b2,#fff)', opacity: 0.6 }} />
            <g style={{ fill: '#9fb8e8', opacity: 'var(--cr,0.45)' }}>
              <circle cx="120" cy="112" r="10" />
              <circle cx="96" cy="132" r="6" />
              <circle cx="122" cy="84" r="5" />
            </g>
          </svg>
        </div>
        <Clouds className="bottom-[6%]" s={0.8} op={0.85} dur={170} />
        <Clouds className="bottom-0" dur={110} rev />
        <div data-speed="0.12" className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
          <div className="relative w-[19rem] h-[17rem] md:w-[26rem] md:h-[22rem]">
            <svg viewBox="0 0 300 260" className="w-full h-full float">
              <g transform="rotate(-7 150 130)">
                <rect x="30" y="35" width="240" height="180" rx="20" fill="#4d84ec" />
                <rect x="40" y="45" width="220" height="160" rx="12" fill="#1c2a68" />
                {['#ff6b6b', '#fbbf24', '#34d399'].map((f, i) => <circle key={i} cx={54 + i * 9} cy="56" r="2.6" fill={f} />)}
                <rect x="48" y="68" width="30" height="128" rx="4" fill="#22347a" />
                {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="52" y={74 + i * 14} width={18 + (i % 3) * 3} height="4" rx="2" fill="#5b78c8" />)}
                {code.map(([x, y, w, f], i) => <rect key={i} x={x + 16} y={y} width={w * 0.8} height="6" rx="3" fill={f} />)}
              </g>
            </svg>
            {chips.map(([I, pos, sz], i) => (
              <div key={i} className={`float glass absolute ${pos} ${sz} rounded-2xl flex items-center justify-center text-white`} style={{ animationDelay: i * 0.6 + 's' }}>
                <I className="w-6 h-6" />
              </div>
            ))}
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-script leading-none">
              <span className="block text-6xl md:text-7xl">Code</span>
              <span className="block text-3xl md:text-4xl -rotate-6 md:ml-8" style={{ color: 'color-mix(in srgb, var(--on) 45%, var(--bottom))' }}>Ideas</span>
              <span className="block text-4xl md:text-5xl -rotate-3">Real Builds</span>
              <span className="block text-6xl md:text-7xl md:ml-4" style={{ color: 'color-mix(in srgb, var(--on) 45%, var(--bottom))' }}>Things</span>
            </h1>
            <p className="mt-5 text-xs tracking-[0.3em]">PLAN &nbsp;•&nbsp; CODE &nbsp;•&nbsp; TEST &nbsp;•&nbsp; DEPLOY</p>
          </div>
        </div>
        <div data-speed="0.06" className="absolute bottom-8 md:bottom-14 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 text-white">
          <p className="font-script text-4xl -rotate-3">Arfan Nur Ivandi</p>
          <p className="text-xs md:text-sm tracking-wide text-center">Web Developer &nbsp;•&nbsp; Backend Developer &nbsp;•&nbsp; System Administrator</p>
        </div>
      </section>

      <section id="about" className={light}>
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center text-[var(--acc)]">
          <Mouse className="w-8 h-8" />
          <div className="w-px h-16 bg-current" />
        </div>
        <R><h2 className="flex items-center justify-center gap-4 text-3xl md:text-4xl font-extrabold tracking-wide"><Spark />ABOUT ME<Spark flip /></h2></R>
        <div className="max-w-2xl mx-auto mt-12 flex flex-col md:flex-row gap-8 items-center">
          <R className="relative shrink-0">
            <div className="hidden md:flex absolute -left-24 top-4 flex-col items-center gap-2 text-[var(--acc)]">
              <Code2 className="w-10 h-10 p-2 rounded-lg border-2 border-current -rotate-12" />
              <Settings className="w-9 h-9" />
            </div>
            <div
              data-speed="-0.03"
              className="w-52 h-52 rounded-full border-[3px] border-[var(--ink)] p-2"
            >
              <img
                src={profile}
                alt="Arfan Nur Ivandi"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </R>
          <R d={150} className="space-y-5 w-full">
            {[['Full Name', 'Arfan Nur Ivandi'], ['E-mail', 'arfanvn@gmail.com'], ['Website / Portfolio', 'www.arfanivan.dev']].map(([l, v]) => (
              <div key={l}><p className="font-extrabold uppercase text-[var(--acc)]">{l}</p><p className="opacity-75">{v}</p></div>
            ))}
          </R>
        </div>
        <R className="max-w-2xl mx-auto mt-8">
          <p className="leading-relaxed text-sm md:text-base">
            Hi, I'm <b className="text-[var(--acc)]">Arfan Nur Ivandi</b>. I'm a <b className="text-[var(--acc)]">Developer and IT Support</b> enthusiast, passionate about building systems,
            solving problems, and exploring new technologies. I enjoy working with <b>Linux, networking, web development,</b> and <b>embedded systems</b>.
            Always eager to learn, improve, and create useful solutions through code and technology.
          </p>
          <p className="mt-6 font-extrabold uppercase text-[var(--acc)]">My Skills</p>
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-7 gap-4">
            {mySkills.map(([I, l]) => (
              <div key={l} className="flex flex-col items-center gap-1 text-[10px] font-semibold"><I className="w-8 h-8" />{l}</div>
            ))}
          </div>
          <a
            href={resume}
            download="Arfan-Nur-Ivandi-Resume.pdf"
            className="mt-10 mx-auto w-fit flex items-center gap-2 px-8 py-3 rounded-full border-[3px] border-[var(--acc)] text-[var(--acc)] font-extrabold text-sm hover:scale-105 transition"
          >
            <CloudDownload className="w-5 h-5" />
            DOWNLOAD RESUME
          </a>
        </R>
        <Clouds className="bottom-0" s={0.5} dur={130} />
      </section>

      <section
  id="edu"
  className={`${dark} relative overflow-hidden pt-24 pb-64`}
>
  <Sky />

  <R>
    <Script>Education · Experience</Script>
  </R>

  <div className="relative z-10 max-w-5xl mx-auto mt-14 space-y-6">
    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />

    {timeline.map(([date, t, sub, I], i) => (
      <div
        key={i}
        className="md:grid md:grid-cols-[1fr_4rem_1fr] items-center"
      >
        <R
          className={`md:row-start-1 ${
            i % 2 ? "md:col-start-3" : "md:col-start-1"
          }`}
        >
          <div className="glass rounded-3xl p-5 flex gap-4 items-start">
            <I className="w-8 h-8 shrink-0" />

            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/85 text-[var(--ink)]">
                {date}
              </span>

              <h3 className="mt-2 font-extrabold text-lg">
                {t}
              </h3>

              <p className="text-sm opacity-90">
                {sub}
              </p>
            </div>
          </div>
        </R>

        <div className="hidden md:flex md:col-start-2 md:row-start-1 justify-center">
          <span className="glass w-12 h-12 rounded-full flex items-center justify-center">
            <I className="w-5 h-5" />
          </span>
        </div>
      </div>
    ))}
  </div>

  <Clouds light className="bottom-0" s={0.85} op={0.6} dur={170} />
  <Clouds light className="bottom-0" dur={120} rev />
</section>

      <section id="skills" className={light}>
        <R><div className="flex items-center justify-center gap-4 text-[var(--acc)]"><Orbit /><Script>Skills</Script><Orbit /></div></R>
        <div className="max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4">
          {skills.map(([p, l, s, I]) => <Ring key={l} pct={p} label={l} sub={s} icon={I} />)}
        </div>
        <Clouds className="bottom-0" s={0.5} dur={140} rev />
      </section>

      <section id="abilities" className={`${dark} relative pt-24 pb-64`}>
        <Sky />
        <R><Script>Abilities</Script></R>
        <div className="max-w-5xl mx-auto mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {abilities.map(([I, t, s], i) => (
            <R key={t} d={i * 90} className="flex gap-4">
              <span className="glass w-14 h-14 shrink-0 rounded-full flex items-center justify-center"><I className="w-6 h-6" /></span>
              <div><h3 className="font-extrabold">{t}</h3><p className="text-sm opacity-90">{s}</p></div>
            </R>
          ))}
        </div>
        <Clouds light className="bottom-0" s={0.85} op={0.6} dur={170} />
        <Clouds light className="bottom-0" dur={120} rev />
      </section>

      <Projects className={light + ' overflow-hidden'} />

      <section id="contact" className="relative z-10 px-6 pt-20 pb-16 text-[var(--on)]">
        <Sky />
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <R>
            <h2 className="flex items-center gap-3 text-2xl font-extrabold"><Send /> SEND ME YOUR MESSAGE</h2>
            <form
              className="mt-6 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()

                const form = e.currentTarget

                try {
                  await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    form,
                    {
                      publicKey: EMAILJS_PUBLIC_KEY
                    }
                  )

                  alert('Message sent successfully!')
                  form.reset()
                } catch (error) {
                  console.error('EmailJS error:', error)
                  alert('Failed to send message. Please try again.')
                }
              }}
            >
              {[
                [User, 'name', 'Name', 'text'],
                [Mail, 'email', 'Email address', 'email'],
                [Box, 'subject', 'Subject', 'text']
              ].map(([I, n, p, t]) => (
                <label
                  key={n}
                  className="glass flex items-center gap-3 px-4 py-3 rounded-full"
                >
                  <I className="w-5 h-5" />

                  <input
                    name={n}
                    type={t}
                    placeholder={p}
                    required
                    className="bg-transparent outline-none w-full placeholder:text-current placeholder:opacity-70"
                  />
                </label>
              ))}

              <label className="glass flex gap-3 px-4 py-3 rounded-3xl">
                <MessageCircle className="w-5 h-5 mt-0.5" />

                <textarea
                  name="message"
                  rows="4"
                  placeholder="Message"
                  required
                  className="bg-transparent outline-none w-full resize-none placeholder:text-current placeholder:opacity-70"
                />
              </label>

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-sky-400 text-[#0b2a6b] font-extrabold hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                SEND
              </button>
            </form>
          </R>
          <R d={150}>
            <h2 className="text-2xl font-extrabold">SOCIAL</h2>
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/arfan-ivan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
              >
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/arfan-nur-ivandi-49357530a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="w-5 h-5" />
              </a>

                <a
                  href="https://www.instagram.com/4rfan_vn/"
                  aria-label="Instagram"
                  className="glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  aria-label="TikTok"
                  className="glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                >
                  <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
                </a>
            </div>
            <p className="font-script text-5xl mt-16 -rotate-6">Arfan Nur Ivandi</p>
          </R>
        </div>
        <div className="mt-16 flex justify-center gap-8 opacity-80">
          {[Code2, Laptop, Coffee, Settings, Orbit, Terminal, Rocket].map((I, i) => <I key={i} className="float w-7 h-7" style={{ animationDelay: i * 0.4 + 's' }} />)}
        </div>
        <p className="mt-8 text-center text-xs opacity-80">Designed and developed by Arfan Nur Ivandi</p>
      </section>
    </div>
  )
}
