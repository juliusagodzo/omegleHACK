const apiKey = "my-api-key";

window.oRTCPeerConnection = Window.oRTCPeerConnection || window.RTCPeerConnection;

Window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.oaddIceCandidate;

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};

async function getLocation(ip) {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

    await fetch(url).then((response) =>
        response.json().then((json) => {
            const output = `
                ------------
                Country: ${json.country_name}
                State: ${json.state_prov}
                City: ${json.district}
                Lat / Long: (${json.latitude}, ${json.longitude})
                ------------
            `;
            console.log(output);
        })
    )
}