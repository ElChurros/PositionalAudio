import { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import AudioTrack from './AudioTrack'

const Room = ({ match }) => {

    const roomId = match.params.id;

    const socketRef = useRef();

    const peers = useRef([])

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socketRef.current = io.connect('localhost:8000/');
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {

            socketRef.current.on("all users", payload => {
                payload.forEach(userId => {
                    if (userId !== socketRef.current.id) {
                        const peer = createPeer(userId, socketRef.current.id, stream);
                        peers.current.push({ id: userId, peer: peer })
                    }
                })
                setPlayers(payload)
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peers.current.push({ id: payload.callerID, peer: peer })
                setPlayers((prev) => [...prev, payload.callerID])
            })

            socketRef.current.emit("join room", roomId);
        })
    }, [roomId])

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        socketRef.current.on("receiving returned signal", payload => {
            const item = peers.current.find(p => p.id === payload.id);
            item.peer.signal(payload.signal);
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return <>
        <h1>Room {roomId}</h1>
        {players.map((player) => {
            return <div key={player}>
                <span>{player}</span>
            </div>
        })}
        {players.filter(player => player !== socketRef.current.id).map(player => {
            return <AudioTrack key={player} peer={peers.current.find(peer => peer.id === player).peer}></AudioTrack>
        })}
    </>
}

export default Room