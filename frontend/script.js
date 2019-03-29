let socket=io();

socket.on('connected',()=>{
console.log("Connected"+socket.id)
})

$(function(){
	let msglist= $('#msglist')
	let sendbtn= $('#sendmsg')
	let msgbox= $('#msgbox')
	let loginbox=$('#loginbox')
	let loginbtn=$('#loginbtn')
	let loginDiv=$('#login-div')
	let chatDiv=$('#chat-div')
	let Wlcnote=$('#wlcnote')
	let userimg=$('#userimg')

	let user= ''

	sendbtn.click(function(){
		socket.emit('send_msg',{user: user,message: msgbox.val()})
	})

	loginbtn.click(function(){
		user=loginbox.val()
		socket.emit('login',{
			user: user
		})
		chatDiv.show()
		loginDiv.hide()
	})

	socket.on('rcv_wlcm',(data)=>{
		Wlcnote.append($('<h1>Hi! ' + data.user + '</h1>'))
	})

	socket.on('recv_msg', (data)=>{
		if(data.message.startsWith('@'))
		{
			msglist.append($('<li>' + data.user+':'+data.message.split(':')[1] + '</li>'))
		}
		else
			msglist.append($('<li>' + data.user+':'+data.message + '</li>'))
	})
})