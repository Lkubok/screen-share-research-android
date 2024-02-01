import React from 'react';
import {Button, Platform, View} from 'react-native';

import RecordScreen, {RecordingStartResponse} from 'react-native-record-screen';

import RNFS from 'react-native-fs';

// create a path you want to write to
// :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
// but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
var path = RNFS.DownloadDirectoryPath + '/test3.mp4';
const androidPath = RNFS.DocumentDirectoryPath + '/test3.mp4';

// write the file
// RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
//   .then(success => {
//     console.log('FILE WRITTEN!');
//   })
//   .catch(err => {
//     console.log(err.message);
//   });

export default function Record() {
  const startRecord = async () => {
    const result: RecordingStartResponse = await RecordScreen.startRecording({
      //   fileName: 'test.mp4',
      //   includeAudio: true,
      //   includeMicrophone: true,
      //   videoQuality: 'medium',
      //   saveToCameraRoll: true,
    });
    console.log('result', result);
  };

  const stopRecord = async () => {
    const result = await RecordScreen.stopRecording();
    console.log('result', result);
    //
    //

    if (Platform.OS === 'ios') {
      RNFS.readFile(result.result.outputURL, 'base64')
        .then(res => {
          //   console.log('res', res);
          console.log('FILE READ!');
          const IOSPath = RNFS.DocumentDirectoryPath + '/test4.mp4';
          console.log('iOS path', IOSPath);
          RNFS.writeFile(IOSPath, res, 'base64');
        })
        .catch(err => {
          console.log(err.message);
          console.log(err);
        });
    }

    // RNFS.writeFile(path, result.result.outputURL)
    //   .then(success => {
    // console.log('FILE WRITTEN!');
    //   })
    //   .catch(err => {
    // console.log(err.message);
    //   });
    if (Platform.OS === 'android') {
      RNFS.copyFile(result.result.outputURL, path)
        .then(() => {
          console.log('FILE WRITTEN!');
        })
        .catch(err => {
          //   console.log(err.message);
          console.log(err);
        });
    }
  };

  return (
    <View>
      <Button title="start" onPress={startRecord} />
      <Button title="stop" onPress={stopRecord} />
      {/* {stream && (
        <RTCView
          mirror={true}
          objectFit={'cover'}
          streamURL={stream.toURL()}
          zOrder={0}
          style={{width: 200, height: 200}}
        />
      )} */}
    </View>
  );
}
