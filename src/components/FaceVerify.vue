<template>
    <div>
        <button v-on:click="fuck">Fuck</button><br>
        <video id="video" ref="video" width="600" height="480"></video>
    </div>
</template>
<script src="../../faceverify/faceverify.js"></script>
<script>
import * as mb from '../../src/faceverify/face-verify.js';
export default {
    name: "FaceVerify",
    data: function() {
        return {
        };
    },
    methods: {
        fuck: function() {
            console.clear();
            console.log(mb);
            var fv =  new machinebox.FaceVerify({
                facebox: 'http://localhost:8080',
                videoSelector: '#video',
                snapshotInterval: 1000,
                error: function(error) {
                    console.log(error);
                },
                onSecure: function(name) {
                    console.log('secure');
                },
                onInsecure: function(message) {
                    console.log('insecure');
                }
            });
            const video = this.$refs.video;
            navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
			navigator.getMedia({video:true, audio:false},
				function (mediaStream) {
					video.srcObject = mediaStream;
                    video.play();
                },
				function (error) {
					console.log(error);
                }
            );
        }
    },
    created: function() {
    }
};
</script>