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
        <div className='container'>
            <div className='container-list'>
                <div className='wrap-list'>
                    <form className="list-form" onSubmit={handleRegister}>
                        <span className='list-form-title'>My tasks</span>

                        <div className='text-and-button'>
                            <div className='wrap-input'>
                                <input className={taskInput !== "" ? 'has-value input' : 'input'} type="text" value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)} />
                                <span className="focus-input" data-placeholder='Enter your task...'></span>
                            </div>
                            <div className='container-task-form-btn'>
                                {Object.keys(edit).length > 0 ? (
                                    <button className='btn-register' type='submit'>Update task</button>
                                ) : (
                                    <button className='btn-register' type='submit'>Add task</button>
                                )}
                            </div> </div>
                    </form>
                    {tasks.map((item, index) => (
                        <article key={item.id} className='tasks'>
                            {/* <p>{(index + 1) + ". " + item.task}</p> */}
                            <p>{(index + 1).toString().padStart(2, '0') + ". " + item.task}</p>
                            <div>
                                <button onClick={() => editTask(item)} className='btn-edit'>Edit</button>
                                <button onClick={() => deleteTask(item.id)} className='btn-delete'>Done</button>
                            </div>
                        </article>
                    ))}
                    <button className='btn-logout' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}