import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';

import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

export default function Rtc() {
  const [cameraCount2, setCameraCount2] = useState(0);
  const [stream, setStream] = useState<MediaStream>();

  let localMediaStream;
  let isVoiceOnly = false;

  useEffect(() => {
    let cameraCount = 0;
    const asyncEffect = async () => {
      try {
        const devices = await mediaDevices.enumerateDevices();

        devices.map(device => {
          if (device.kind != 'videoinput') {
            return;
          }

          cameraCount = cameraCount + 1;
        });
        console.log('cameraCount', cameraCount);
      } catch (err) {
        // Handle Error
      }
    };
    asyncEffect();
  }, []);

  const getCamera = async () => {
    // const sourceId = await ScreenCapturePickerView.getSourceId();
    // console.log('sourceId', sourceId);
    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      if (isVoiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }

      localMediaStream = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      // Handle Error
    }
  };

  const getScreen = async () => {
    // const sourceId = await ScreenCapturePickerView.getSourceId();
    // console.log('sourceId', sourceId);
    try {
      const mediaStream = await mediaDevices.getDisplayMedia();

      localMediaStream = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      // Handle Error
    }
  };

  //   try {
  //     const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

  //     if (isVoiceOnly) {
  //       let videoTrack = await mediaStream.getVideoTracks()[0];
  //       videoTrack.enabled = false;
  //     }

  //     localMediaStream = mediaStream;
  //   } catch (err) {
  //     // Handle Error
  //   }

  console.log('localMediaStream', localMediaStream);
  console.log('stream', stream);

  return (
    <View>
      <Button title="camera" onPress={getCamera} />
      <Button title="screen" onPress={getScreen} />
      {stream && (
        <RTCView
          mirror={true}
          objectFit={'cover'}
          streamURL={stream.toURL()}
          zOrder={0}
          style={{width: 200, height: 200}}
        />
      )}
    </View>
  );
}
