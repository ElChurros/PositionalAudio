import { v1 as uuid } from "uuid";
import { useHistory } from 'react-router-dom'

const CreateRoom = () => {
    let history = useHistory()

    const createRoom = () => {
        const id = uuid();
        history.push(`/room/${id}`)
    }

    return <button onClick={createRoom}>Create room</button>
}

export default CreateRoom;