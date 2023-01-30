import React, { useEffect, useState } from 'react'
//import notes from '../assets/data'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
import { Link, useParams } from 'react-router-dom'


const Note = () => {

    let history = []
    let params = useParams()
    let noteId = params.id

    let [note, setNote] = useState(null)

    //let note = notes.find(note => note.id == noteId)

    // component did update with dependancy witch is noteId here
    useEffect(() => {

        let getNote = async () => {
            if (noteId === 'new') return
            let response = await fetch(`http://localhost:5000/notes/${noteId}`)
            let data = await response.json()
            setNote(data)
        }
        getNote()
    }, [noteId])


    const createNote = async () => {


        await fetch(`http://localhost:5000/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }


    const updateNote = async () => {
        await fetch(`http://localhost:5000/notes/${noteId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }

    const deleteNote = async () => {
        await fetch(`http://localhost:5000/notes/${noteId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        history.push('/')
    }

    let handleSubmit = () => {
        if (noteId !== "new" && !note.body) {
            deleteNote()
        } else if (noteId !== "new" && note !== null) {
            updateNote()
        } else if (noteId === 'new' && note !== null) {
            createNote()
        }

        history.push('/')
    }


    return (
        <div className="note">
            <div className="note-header">
                <h2>
                    <Link to={'/'}>
                        <ArrowLeft onClick={handleSubmit} />
                    </Link>
                </h2>
                {noteId !== 'new' ? (
                    <Link to={`/`}>
                        <button onClick={deleteNote}>Delete</button>
                    </Link>
                ) : (
                    <Link to={`/`}>
                        <button className='done' onClick={handleSubmit}>Done</button>
                    </Link>
                )}

            </div>
            <textarea onChange={(e) => { setNote({ ...note, 'body': e.target.value }) }} placeholder="Edit note" value={note?.body}></textarea>
        </div >
    )
}

export default Note
