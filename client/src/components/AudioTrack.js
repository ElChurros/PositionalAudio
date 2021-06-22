import { useEffect, useRef, useContext } from 'react';
import AudioCtx from '../contexts/audioCtx';

const AudioTrack = ({peer}) => {

    const audioCtx = useContext(AudioCtx)

    const audioRef = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(audioCtx.destination);
            audioRef.current.srcObject = stream;
        })
    // eslint-disable-next-line
    }, [peer, audioCtx])

    console.log("displaying AudioTrack for peer", peer)

    return (<>
        <audio ref={audioRef}></audio>
    </>
    );
}

export default AudioTrack;