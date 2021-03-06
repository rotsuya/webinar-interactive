const CONST = {
    SPEAKER_PEER_ID: 'speaker',
    ROOM_NAME_WORDS: ['happy', 'cheerful', 'interesting', 'cool', 'awesome', 'mysterious', 'magical', 'fantastic'],
    ROOM_NAME_MAX_LENGTH: 32,
    STREAM_KIND_CAMERA: 'CAMERA',
    STREAM_KIND_SCREEN: 'SCREEN',
    ALERT_KIND_NOT_SUPPORT_WEBRTC: Symbol(),
    ALERT_KIND_UNSTABLE_SFU: Symbol(),
    ALERT_KIND_GUM: Symbol(),
    ALERT_KIND_ROOM_PERMISSION: Symbol(),
    ALERT_KIND_NO_SPEAKER: Symbol(),
    ALERT_KIND_PEERID_IN_USE: Symbol(),
    ROLE_AUDIENCE: 'AUDIENCE',
    ROLE_SPEAKER: 'SPEAKER',
    ROLE_QUESTIONER: 'QUESTIONER',
    QA_STATUS_DO_NOTHING: 'DO_NOTHING',
    QA_STATUS_WAITING: 'WAITING',
    QA_STATUS_TALKING: 'TALKING',
    TIMEOUT_MILLISECONDS_ALERT_GUM: 2000,
    TIMEOUT_MILLISECONDS_ALERT_NO_SPEAKER: 5000
};

export default CONST;
