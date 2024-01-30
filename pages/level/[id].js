// pages/[id].js

import { useRouter } from "next/router"
import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import { drawHand } from "../../components/handposeutil"
import * as fp from "fingerpose"
import Handsigns from "../../components/handsigns"

import {
    Text,
    Heading,
    Button,
    Image,
    Stack,
    Container,
    Box,
    VStack,
    ChakraProvider,
} from "@chakra-ui/react"

import { Signimage, Signpass } from "../../components/handimage"

// import "../styles/App.css"

// import "@tensorflow/tfjs-backend-webgl"

import { RiCameraFill, RiCameraOffFill } from "react-icons/ri"

const DynamicPage = () => {
    const router = useRouter()
    const { id } = router.query
    //   console.log(id,'id')
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const [camState, setCamState] = useState("on")

    const [sign, setSign] = useState(null)
    const [signList, setSignList] = useState(Signpass[id - 1] || [])
    console.log(signList)

    let currentSign = 0

    let gamestate = "started"

    // let net;

    async function runHandpose() {
        const net = await handpose.load()
        _signList()

        // window.requestAnimationFrame(loop);
        console.log("runHandpose")
        setInterval(() => {
            //   console.log("setinterval")
            if (signList) {
                // console.log("test")
                detect(net)
            }
        }, 150)
    }

    function _signList() {
        setSignList(Signpass[id - 1])
    }

    // function shuffle(a) {
    //   for (let i = a.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1))
    //     ;[a[i], a[j]] = [a[j], a[i]]
    //   }
    //   return a
    // }

    // function generateSigns() {
    //   const password = shuffle(Signpass)
    //   return password
    // }

    const GE = new fp.GestureEstimator([
        fp.Gestures.ThumbsUpGesture,
        Handsigns.aSign,
        Handsigns.bSign,
        Handsigns.cSign,
        Handsigns.dSign,
        Handsigns.eSign,
        Handsigns.fSign,
        Handsigns.gSign,
        Handsigns.hSign,
        Handsigns.iSign,
        Handsigns.jSign,
        Handsigns.kSign,
        Handsigns.lSign,
        Handsigns.mSign,
        Handsigns.nSign,
        Handsigns.oSign,
        Handsigns.pSign,
        Handsigns.qSign,
        Handsigns.rSign,
        Handsigns.sSign,
        Handsigns.tSign,
        Handsigns.uSign,
        Handsigns.vSign,
        Handsigns.wSign,
        Handsigns.xSign,
        Handsigns.ySign,
        Handsigns.zSign,
    ])
    async function detect(net) {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video
            const videoWidth = webcamRef.current.video.videoWidth
            const videoHeight = webcamRef.current.video.videoHeight

            // Set video width
            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.height = videoHeight

            // Set canvas height and width
            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            // Make Detections
            const hand = await net.estimateHands(video)
            //   console.log("second")

            if (hand.length > 0) {
                //loading the fingerpose model

                const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5)
                // document.querySelector('.pose-data').innerHTML =JSON.stringify(estimatedGestures.poseData, null, 2);
                // console.log("gamestate", gamestate)
                if (gamestate === "started") {
                    document.querySelector("#app-title").innerText =
                        "Make a 👍 gesture with your hand to start"
                }

                if (
                    estimatedGestures.gestures !== undefined &&
                    estimatedGestures.gestures.length > 0
                ) {
                    const confidence = estimatedGestures.gestures.map(p => p.confidence)
                    const maxConfidence = confidence.indexOf(
                        Math.max.apply(undefined, confidence)
                    )

                    //setting up game state, looking for thumb emoji
                    if (
                        estimatedGestures.gestures[maxConfidence].name === "thumbs_up" &&
                        gamestate !== "played"
                    ) {
                        _signList()
                        gamestate = "played"
                        document.getElementById("emojimage").classList.add("play")
                        document.querySelector(".tutor-text").innerText =
                            "make a hand gesture based on letter shown below"
                    } else if (gamestate === "played") {
                        document.querySelector("#app-title").innerText = ""

                        //looping the sign list
                        if (currentSign === signList?.length) {
                            // _signList()
                            // currentSign = 0
                            console.log("finished")
                            if(id < 4)
                            {
                                const newId = parseInt(id, 10) + 1;
                                router.push(`/practice/${newId}`, null, { shallow: true });
                            }
                            else
                            router.push(`/practice/5`, null, { shallow: true });
                            // gamestate = "finished"
                            return
                        }

                        // console.log(signList[currentSign].src.src)

                        //game play state

                        if (
                            signList &&
                            (typeof signList[currentSign].src.src === "string" ||
                                signList[currentSign].src.src instanceof String)
                        ) {
                            document
                                .getElementById("emojimage")
                                .setAttribute("src", signList[currentSign].src.src)
                            if (
                                signList[currentSign].alt ===
                                estimatedGestures.gestures[maxConfidence].name
                            ) {
                                console.log("MatchFound")
                                currentSign++
                            }
                            // setSign(estimatedGestures.gestures[maxConfidence].name)
                        }
                    } else if (gamestate === "finished") {
                        return
                    }
                }
            }
            // Draw hand lines
            const ctx = canvasRef.current.getContext("2d")
            drawHand(hand, ctx)
            // console.log('done')
        }
    }

    //   if (sign) {
    //     console.log(sign, Signimage[sign])
    //   }

    useEffect(() => {
        runHandpose()
    }, [])

    function turnOffCamera() {
        // console.log("first")
        if (camState === "on") {
            setCamState("off")
        } else {
            setCamState("on")
        }
    }

    return (
        // <ChakraProvider>
        // <Metatags />
        <div className="main-container">
            <div className="question-container">
                <div>
                    <div className="tutor-text"></div>
                    <div id="app-title">🧙‍♀️ Loading the Magic 🧙‍♂️</div>
                </div>

                {/* apptitle = thumsup+ loadingmagic */}
                
          <div
            id="singmoji"
            style={{
              zIndex: 9,
              position: "fixed",
              top: "50px",
              right: "30px",
            }}
          ></div>

                <Image h="150px" objectFit="cover" id="emojimage" />
                {/* <pre className="pose-data" color="white" style={{position: 'fixed', top: '150px', left: '10px'}} >Pose data</pre> */}

                <div id="start-button">
                    <Button
                        leftIcon={
                            camState === "on" ? (
                                <RiCameraFill size={20} />
                            ) : (
                                <RiCameraOffFill size={20} />
                            )
                        }
                        onClick={turnOffCamera}
                        colorScheme="orange"
                    >
                        Camera
                    </Button>
                </div>

                {sign ? (
                    <div
                        style={{
                            // position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            // right: "calc(50% - 50px)",
                            // bottom: 100,
                            // textAlign: "-webkit-center",
                        }}
                    >
                        <Text color="white" fontSize="sm" mb={1}>
                            detected gestures
                        </Text>
                        <img
                            alt="signImage"
                            src={
                                Signimage[sign]?.src
                                    ? Signimage[sign].src
                                    : "/loveyou_emoji.svg"
                            }
                            style={{
                                height: 50,
                                width: 50,
                            }}
                        />
                    </div>
                ) : (
                    " "
                )}
            </div>

            <div className="main-webcam">
                <div id="webcam-container">
                    {camState === "on" ? (
                        <Webcam id="webcam" ref={webcamRef} />
                    ) : (
                        <div id="webcam" background="black"></div>
                    )}
                </div>
                <canvas id="gesture-canvas" ref={canvasRef} style={{}} />
            </div>
        </div>
        // </ChakraProvider>
    )
}
export default DynamicPage
