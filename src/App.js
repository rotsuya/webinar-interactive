import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mode: undefined,
            localStream: undefined,
            remoteStreams: [],
            isPeerOpen: false
        };
        this.update = this.update.bind(this); // es6対応
    }
    update (newState) {
        const mode = newState.mode ? newState.mode : this.state.mode;
        const localStream = newState.hasOwnProperty('localStream') ? newState.localStream : this.state.localStream;
        let remoteStreams = this.state.remoteStreams;
        if (newState.remoteStream && newState.remoteStream.add) {
            remoteStreams.push(newState.remoteStream.add);
        }
        if (newState.remoteStream && newState.remoteStream.remove) {
            remoteStreams = remoteStreams.filter((stream) => {
                return stream !== newState.remoteStream.remove;
            });
        }
        const isPeerOpen = newState.isPeerOpen ? newState.isPeerOpen : this.state.isPeerOpen;
        this.setState({
            mode: mode,
            localStream: localStream,
            remoteStreams: remoteStreams,
            isPeerOpen: isPeerOpen
        });
    }
    render() {
        return (
            <div className="App">
                <SelectMode update={this.update} mode={this.state.mode} />
                <SpeakerUi roomName="skyway_webinar" update={this.update} mode={this.state.mode} localStream={this.state.localStream} remoteStreams={this.state.remoteStreams} isPeerOpen={this.state.isPeerOpen}></SpeakerUi>
                <AudienceUi roomName="skyway_webinar" update={this.update} mode={this.state.mode} localStream={this.state.localStream} remoteStreams={this.state.remoteStreams} isPeerOpen={this.state.isPeerOpen}/>
            </div>
        );
    }
}

class SelectMode extends Component {
    _onClick (event) {
        this.props.update({
            mode: event.target.dataset.mode
        });
    }
    render () {
        if (!this.props.mode) {
            return (
                <div>
                    <h1>モード選択</h1>
                    <button data-mode="speaker" onClick={this._onClick.bind(this)}>Speaker</button>
                    <button data-mode="audience" onClick={this._onClick.bind(this)}>Audience</button>
                </div>
            );
        } else {
            return false;
        }
    }
}

class SpeakerUi extends Component {
    constructor (props) {
        super(props);
        this.peer = new Peer('speaker', {
            key: 'a84196a8-cf9a-4c17-a7e9-ecf4946ce837',
            debug: 3
        });
        this.peer.on('open', () => {
            this.props.update({
                isPeerOpen: true
            })
        });
        this.peer.on('error', (err) => {
            console.error(err.message);
        });
    }
    _onClick () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        const videoConstraints
            = navigator.webkitGetUserMedia
            ? // for chrome
                {
                    mandatory: {
                        maxWidth: 640,
                        maxHeight: 360,
                        maxFrameRate: 5
                    }
                }
            : // for firefox
                {
                    width: 160,
                    height: 90,
                    facingMode: 'user'
                };
        const roomName = this.props.roomName;
        navigator.getUserMedia({audio: true, video: videoConstraints}, (stream) => {
            this.props.update({
                localStream: stream
            });
            this.room = this.peer.joinRoom(roomName, {mode: 'sfu', stream: stream});
            this.room.on('stream', (stream) => {
                this.props.update({
                    remoteStream: {add: stream}
                });
            });
            this.room.on('removeStream', (stream) => {
                this.props.update({
                    remoteStream: {remove: stream}
                });
            });
            this.room.on('close', () => {
                console.warn('room is closed.');
            });
            this.room.on('peerJoin', () => {
                console.log('peerJoin');
            });
        }, (err) => {
            console.error(err);
        });
    }
    render () {
        const buttonDisabled = !this.props.isPeerOpen;
        if (this.props.mode === 'speaker') {
            return (
                <div>
                    <h1>講師</h1>
                    <button disabled={buttonDisabled} onClick={this._onClick.bind(this)} >Call</button>
                    <h2>自分</h2>
                    <LocalVideo localStream={this.props.localStream} />
                    <h2>聴衆</h2>
                    <RemoteVideos remoteStreams={this.props.remoteStreams} target="audience" />
                </div>
            );
        } else {
            return false;
        }
    }
}

class AudienceUi extends Component {
    constructor (props) {
        super(props);
        this.peer = new Peer({
            key: 'a84196a8-cf9a-4c17-a7e9-ecf4946ce837',
            debug: 3
        });
        this.peer.on('open', () => {
            this.props.update({
                isPeerOpen: true
            })
        });
        this.peer.on('error', (err) => {
            console.error(err.message);
        });
    }
    _onClick () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        const videoConstraints
            = navigator.webkitGetUserMedia
            ? // for chrome
        {
            mandatory: {
                maxWidth: 160,
                maxHeight: 90,
                maxFrameRate: 5
            }
        }
            : // for firefox
        {
            width: 160,
            height: 90,
            facingMode: 'user'
        };
        const roomName = this.props.roomName;
        navigator.getUserMedia({audio: true, video: videoConstraints}, (stream) => {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = false;
            });
            stream.getVideoTracks().forEach((track) => {
                track.enabled = false;
            });
            this.props.update({
                localStream: stream
            });
            this.room = this.peer.joinRoom(roomName, {mode: 'sfu', stream: stream});
            this.room.on('stream', (stream) => {
                this.props.update({
                    remoteStream: {add: stream}
                });
            });
            this.room.on('removeStream', (stream) => {
                this.props.update({
                    remoteStream: {remove: stream}
                });
            });
            this.room.on('close', () => {
                console.warn('room is closed.');
            });
            this.room.on('peerJoin', () => {
                console.log('peerJoin');
            });
        }, (err) => {
            console.error(err);
        });
    }
    render () {
        const buttonDisabled = !this.props.isPeerOpen;
        if (this.props.mode === 'audience') {
            return (
                <div>
                    <h1>視聴者</h1>
                    <button disabled={buttonDisabled} onClick={this._onClick.bind(this)} >Call</button>
                    <h2>自分</h2>
                    <LocalVideo localStream={this.props.localStream} />
                    <h2>講師</h2>
                    <RemoteVideos remoteStreams={this.props.remoteStreams} target="speaker" />
                </div>
            );
        } else {
            return false;
        }
    }
}

class LocalVideo extends Component {
    render () {
        let localVideoNode;
        if (this.props.localStream) {
            const url = URL.createObjectURL(this.props.localStream)
            localVideoNode = (() => {return (
                <video autoPlay src={url} />
            )})();  // 即時実行
        }
        return (
            <div>
                {localVideoNode}
            </div>
        )
    }
}

class RemoteVideos extends Component {
    render () {
        const target = this.props.target;
        const remoteStreamNodes = this.props.remoteStreams.map((stream) => {
            if (target === 'audience' && stream.peerId === 'speaker') {
                return false;
            }
            if (target === 'speaker' && stream.peerId !== 'speaker') {
                return false;
            }
            const url = URL.createObjectURL(stream)
            return (
                <video autoPlay src={url} />
            )
        })
        return (
            <div>
                {remoteStreamNodes}
            </div>
        )
    }
}

export default App;
