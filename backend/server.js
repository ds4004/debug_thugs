const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const dotenv = require("dotenv")
dotenv.config()

const io = require("socket.io")(server, {
	cors: {
		origin: `${process.env.URI}`,
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(process.env.PORT, () => console.log("server is running on port 5000"))
