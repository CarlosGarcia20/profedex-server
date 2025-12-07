const activeTeachers = {}; 

const ROLE_MAP = {
    "1": "Admin",
    "2": "Profesor",
    "3": "Estudiante"
}

export default (io) => {
    io.on('connection', (socket) => {
        console.log(`Usuario conectado con el rol: ${ROLE_MAP[socket.user.userIdRol]}`);

        // --- EVENTOS DE MAESTRO ---
        socket.on('teacher:start', (coords) => {
            if (socket.user.userIdRol !== '2' && socket.user.role !== '1') {
                return;
            }

            activeTeachers[socket.user.userId] = {
                id: socket.user.userId,
                name: socket.user.nickname,
                lat: coords.lat,
                lng: coords.lng,
                lastUpdate: Date.now()
            };

            io.emit('map:update', Object.values(activeTeachers));
        });

        socket.on('teacher:move', (coords) => {
            const userId = socket.user.userId;
            
            if (activeTeachers[userId]) {
                activeTeachers[userId].lat = coords.lat;
                activeTeachers[userId].lng = coords.lng;
                activeTeachers[userId].lastUpdate = Date.now();

                io.emit('map:update', Object.values(activeTeachers));
            }
        });

        socket.on('teacher:stop', () => {
            delete activeTeachers[socket.user.userId];
            io.emit('map:update', Object.values(activeTeachers));
        });

        // --- EVENTOS DE ALUMNO ---
        // Si el alumno entra al mapa, se envia el estado actual inmediatamente
        socket.on('student:join_map', () => {
            socket.emit('map:update', Object.values(activeTeachers));
        });

        // --- DESCONEXIÓN ---
        socket.on('disconnect', () => {
            if (activeTeachers[socket.user.userId]) {
                delete activeTeachers[socket.user.userId];
                io.emit('map:update', Object.values(activeTeachers));
            }
            
            console.log('Usuario desconectado');
        });
    });
};