import { useState, useEffect } from 'react'
import './signed.css'

import { auth, dataBase } from '../../firebaseConnection';
import { signOut } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'

export default function Signed() {
    const [taskInput, setTaskInput] = useState('')
    const [user, setUser] = useState({})
    const [tasks, setTasks] = useState([])
    const [edit, setEdit] = useState({})

    useEffect(() => {
        async function loadTasks() {
            const userDetail = localStorage.getItem('@detailsUser')
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail)
                const taskRef = collection(dataBase, "tasks")
                const q = query(taskRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let list = [];

                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            task: doc.data().task,
                            userUid: doc.data().userUid
                        })
                    })
                    console.log(list);
                    setTasks(list);
                })
            }
        }
        loadTasks();
    }, [])


    async function handleRegister(e) {
        e.preventDefault();

        if (taskInput === '') {
            alert("Please enter a task...")
            return;
        }

        if (edit?.id) {
            handleUpdateTask();
            return;
        }

        await addDoc(collection(dataBase, "tasks"), {
            task: taskInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                console.log("Task registered with success")
                setTaskInput('')
            })
            .catch((error) => {
                console.log("Failed to register task " + error)
            })
    }

    async function handleLogout() {
        await signOut(auth)
    }

    async function deleteTask(id) {
        const docRef = doc(dataBase, "tasks", id)
        await deleteDoc(docRef)
    }

    async function editTask(item) {
        setTaskInput(item.task)
        setEdit(item);
    }

    async function handleUpdateTask() {
        // alert("Task updated!")
        const docRef = doc(dataBase, "tasks", edit?.id)
        await updateDoc(docRef, {
            task: taskInput
        })
            .then(() => {
                console.log("task update!")
                setTaskInput('')
                setEdit({})
            })
            .catch(() => {
                console.log("failed to update!")
                setTaskInput('')
                setEdit({})
            })
    }

    return (
        <div className='signed-container'>
            <h1>My tasks</h1>

            <form className='task-form' onSubmit={handleRegister}>
                <textarea
                    placeholder='Enter your task...'
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' type='submit'>Update task</button>
                ) : (
                    <button className='btn-register' type='submit'>Add task</button>
                )}
            </form>

            {tasks.map((item) => (
                <article key={item.id} className='list'>
                    <p>{item.task}</p>

                    <div>
                        <button onClick={() => editTask(item)}>Edit</button>
                        <button onClick={() => deleteTask(item.id)} className='btn-delete'>Done</button>
                    </div>
                </article>
            ))}

            <button className='btn-logout' onClick={handleLogout}>Logout</button>
        </div>
    )
}