import React, {useCallback, useEffect, useRef, useState} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client';

const TOOLBAR_OPTIONS = [

]

export default function TextEditor() {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    useEffect(() => {
        const s = io("https://localhost:3001")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    })

    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow"})
        setQuill(q)
    }, [])

    useEffect(() => {
        if(socket == null || quill == null) return
        const handler = (delta, oldDelta, source) => {
            if(source !== 'user') return
            socket.emit("send-changes", delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])


    return (
        <div className="container" ref={wrapperRef}>
            
        </div>
    )
}
