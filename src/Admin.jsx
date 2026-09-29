import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { auth, db, ready } from './firebase'
import { useProjects } from './projects'

const toDataUrl = (file) =>
  new Promise((res, rej) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const k = Math.min(1, 900 / img.width)
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = rej
    img.src = url
  })

const field = 'w-full px-4 py-3 rounded-2xl bg-white border-2 border-sky-200 outline-none focus:border-sky-500'
const btn = 'px-6 py-3 rounded-full bg-sky-500 text-white font-extrabold disabled:opacity-50'

export default function Admin() {
  const [user, setUser] = useState(undefined)
  const [cred, setCred] = useState({ email: '', password: '' })
  const [form, setForm] = useState({ title: '', link: '' })
  const [thumb, setThumb] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const { items } = useProjects()

  useEffect(() => {
    if (!auth) {
      setUser(null)
      return
    }
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await signInWithEmailAndPassword(auth, cred.email, cred.password)
    } catch {
      setMsg('Email atau password salah')
    }
  }

  const pick = async (e) => {
    const f = e.target.files[0]
    if (f) setThumb(await toDataUrl(f))
  }

  const save = async (e) => {
    e.preventDefault()
    const fm = e.currentTarget
    if (!thumb) return setMsg('Pilih thumbnail dulu')
    setBusy(true)
    setMsg('')
    try {
      await addDoc(collection(db, 'projects'), { ...form, thumb, createdAt: serverTimestamp() })
      setForm({ title: '', link: '' })
      setThumb('')
      fm.reset()
      setMsg('Project tersimpan')
    } catch {
      setMsg('Gagal menyimpan, cek aturan Firestore')
    }
    setBusy(false)
  }

  const remove = async (p) => {
    if (window.confirm(`Hapus "${p.title}"?`)) await deleteDoc(doc(db, 'projects', p.id))
  }

  let body
  if (!ready) {
    body = <p>Isi konfigurasi Firebase di file .env terlebih dulu (lihat .env.example).</p>
  } else if (user === undefined) {
    body = <p>Memuat...</p>
  } else if (!user) {
    body = (
      <form onSubmit={login} className="space-y-3 max-w-sm">
        <input className={field} type="email" placeholder="Email" required value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} />
        <input className={field} type="password" placeholder="Password" required value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} />
        <button className={btn}>Masuk</button>
      </form>
    )
  } else {
    body = (
      <>
        <form onSubmit={save} className="space-y-3">
          <input className={field} placeholder="Judul project" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={field} type="url" placeholder="https://link-project.com" required value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <input className={field} type="file" accept="image/*" onChange={pick} />
          {thumb && <img src={thumb} alt="" className="w-64 aspect-video object-cover rounded-2xl border-2 border-sky-300" />}
          <button className={btn} disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan project'}</button>
        </form>
        <h2 className="mt-12 text-xl font-extrabold">Daftar project ({items.length})</h2>
        <ul className="mt-4 space-y-3">
          {items.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white border-2 border-sky-100">
              <img src={p.thumb} alt="" className="w-24 aspect-video object-cover rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold truncate">{p.title}</p>
                <p className="text-sm opacity-70 truncate">{p.link}</p>
              </div>
              <button onClick={() => remove(p)} className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-extrabold">Hapus</button>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f6ff] text-[#1e3a8a] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold">Admin Project</h1>
          <div className="flex gap-4 text-sm font-extrabold">
            <a href="/" className="underline">Lihat website</a>
            {user && <button onClick={() => signOut(auth)} className="underline">Keluar</button>}
          </div>
        </div>
        {body}
        {msg && <p className="mt-4 font-extrabold text-sky-700">{msg}</p>}
      </div>
    </div>
  )
}
