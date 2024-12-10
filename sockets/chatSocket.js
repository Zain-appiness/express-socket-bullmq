const chatSocket=(io)=>{
    io.on('connection',(socket)=>{
        console.log('A USER CONNECTED:',socket.id);

    
    socket.on('message',(data)=>{
        io.emit('message',data);
    });
    
    socket.on('disconnect',()=>{
        console.log('A USER DISCOONECTED:',socket.id);
    });

    });

}

module.exports= chatSocket;