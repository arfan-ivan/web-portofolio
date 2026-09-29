import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export function useProjects() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(Boolean(db))

  useEffect(() => {
    if (!db) return
    return onSnapshot(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
      (s) => {
        setItems(s.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [])

  return { items, loading }
}
