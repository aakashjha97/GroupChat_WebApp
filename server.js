const express=require('express')
const path=require('path')
const socketio=require('socket.io')
const http=require('http')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

let usersockets= {}

app.use('/',express.static(path.join(__dirname,'frontend')))

io.on('connection',(socket)=>{
	console.log("new socket formed from"+socket.id)
	socket.emit('connected')

	socket.on('login', (data)=>{
		usersockets[data.user]=socket.id
		console.log(usersockets)
		let rec=usersockets[data.user]
		io.to(rec).emit('rcv_wlcm',data)
	})

	socket.on('send_msg',(data)=>{
		if(data.message.startsWith('@')){
			let recipient=data.message.split(':')[0].substr(1)
			let recsocket=usersockets[recipient]
			io.to(recsocket).emit('recv_msg',data)
		}
		else
		{
			//io.emit('recv_msg', data) to send mmsg to everyone
			socket.broadcast.emit('recv_msg', data)//to send the message to others only
		}
	})
})

server.listen(1234)