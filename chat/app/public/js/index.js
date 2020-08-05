$(document).ready(function() {

    $('#btn-go').click(function() {
        let inputRoom = $('#input-room-id');
        let roomId = inputRoom.val();

        if (roomId.length > 0) {
            window.location.href = `/chat/${ roomId }`;
        }
    });

});