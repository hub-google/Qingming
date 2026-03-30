import { createContext, useContext, useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

const RoomContext = createContext()

const DEFAULT_ROOM_ID = 'f8c2a3d1-4e5f-6789-abcd-ef0123456789'

export function RoomProvider({ children }) {
  const [roomId, setRoomId] = useState(DEFAULT_ROOM_ID)
  const location = useLocation()

  useEffect(() => {
    // Attempt to extract roomId from /family/:roomId
    const match = location.pathname.match(/\/family\/([^/]+)/)
    if (match && match[1]) {
      setRoomId(match[1])
      localStorage.setItem('qingming_room_id', match[1])
    } else {
      const stored = localStorage.getItem('qingming_room_id')
      if (stored) setRoomId(stored)
    }
  }, [location])

  return (
    <RoomContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}
