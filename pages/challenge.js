import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import Competition from "../components/competition"
import { route } from "next/dist/server/router"
import { useRouter } from "next/router"


const socket = io.connect('http://localhost:5000')
function zoom() {
    const router = useRouter()
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)
        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name || id
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
        router.push(`/`);
    }

    return (
        <>
            <div className="container">
                <div className="video-container">
                    {stream &&
                        <div className="video">
                            <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                        </div>
                    }


                    {callAccepted && !callEnded ?
                        <div className="video">
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Challenge
                            </Button>
                        </div>
                        : null
                    }
                </div>

                {(!callAccepted) ?
                    <div className="myId">
                        <TextField
                            id="filled-basic"
                            label="Name"
                            variant="filled"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginBottom: "20px", width: '100%' }}
                        />
                        <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                            <Button variant="contained" color="primary">
                                Your ID: {me}
                            </Button>
                        </CopyToClipboard>

                        <TextField
                            id="filled-basic"
                            label="Friend's ID"
                            variant="filled"
                            value={idToCall}
                            onChange={(e) => setIdToCall(e.target.value)}
                        />
                        <div className="call-button">
                            {callAccepted && !callEnded ? (
                                <Button variant="contained" color="secondary" onClick={leaveCall}>
                                    End Challenge
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={() => callUser(idToCall)}>
                                    Start Challenge
                                </Button>
                            )}
                            {/* {idToCall} */}
                        </div>
                    </div>
                    :
                    // <competetion id={1} />
                    // <p>Hello</p>

                    <Competition id={3} leaveCall={leaveCall} />
                }
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1 >{name} want's to have a Challenge with You</h1>
                            <Button variant="contained" color="primary" onClick={answerCall}>
                                Accept Challenge
                            </Button>
                        </div>
                    ) : null}
                </div>

            </div>
        </>
    )
}

export default zoom