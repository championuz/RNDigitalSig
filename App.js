
import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  TextInput,
  View,
  Platform,
} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import SignatureScreen from "react-native-signature-canvas";

const App = ({ text, onOK }) => {
  const [signature, setSign] = useState(null);
  const [colorText, setPenColor] = useState("");
  const ref = useRef();

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    setSign(signature);
    console.log(colorText)
  };

  const handleEmpty = () => {
    alert("Kindly Affix your Signature!")
  };
  
  const handleClear = () => {
    console.log("clear success!");
  };

  const handleColorChange = () => {
    ref.current.changePenColor(colorText);
  };
  const handleUndo = () => {
    ref.current.undo();
  };
  const handleRedo = () => {
    ref.current.redo();
  };

  const handleSave = async () => {
    if (Platform.OS === 'android') {
    var isReadGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }
    if (isReadGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const dirs = RNFetchBlob.fs.dirs
      console.log(dirs)
      var image_data = signature.split('data:image/png;base64,');
      const filePath = dirs.DownloadDir+"/"+'signture'+new Date().getMilliseconds()+'.png'
      RNFetchBlob.fs.writeFile(filePath, image_data[1], 'base64')
      .then(() => {
        console.log("got here", filePath)
        // RNFetchBlob.ios.previewDocument("file://"+filePath)
      })
      .catch((errorMessage) =>{
        console.log(errorMessage)
      })      }
       
      if (Platform.OS ==='ios') {
      const dirs = RNFetchBlob.fs.dirs
      console.log(dirs)
      var image_data = signature.split('data:image/png;base64,');
      const filePath = dirs.DocumentDir+"/"+'signature'+new Date().getMilliseconds()+'.png'
      RNFetchBlob.fs.writeFile(filePath, image_data[1], 'base64')
      .then(() => {
            RNFetchBlob.ios.previewDocument("file://"+filePath)
            console.log(filePath)
          })
      .catch((errorMessage) =>{
        console.log(errorMessage)
      })
      }
    }

  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.textSign}>Sign Below</Text>
    <View style={styles.row}>
    <TouchableOpacity
      style={[styles.setButton, {marginRight: 30, backgroundColor: 'red'}]}
      onPress={handleUndo}
      >
      <Text style={styles.text}>Undo</Text>
      </TouchableOpacity>
    <TextInput
      placeholder="Specify Pen Color"
      style={styles.textInput}
      autoCapitalize="none"
      value={colorText}
      onChangeText={setPenColor} />
      <TouchableOpacity
      style={styles.setButton}
      onPress={handleColorChange}
      >
      <Text style={styles.text}>Set</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.setButton, {marginLeft: 30, backgroundColor: 'red'}]}
      onPress={handleRedo}
      >
      <Text style={styles.text}>Redo</Text>
      </TouchableOpacity>
    </View>

    <SignatureScreen
      ref={ref}
      onOK={handleOK}
      onEmpty={handleEmpty}
      penColor={colorText}
      onClear={handleClear}
      confirmText="Preview"
      // onGetData={handleData}
      />
     <Text style={styles.textSign}>Preview Signature</Text>
    <Image
    resizeMode={"cover"}
    style={{ width: 300, height: 180, paddingBottom: 20 }}
    source={{ uri: signature }}/>
    <TouchableOpacity
    style={styles.saveButton}
    onPress={handleSave}
    >
    <Text style={styles.text}>Save Signature</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    padding: 10,
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  }, 
  row: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
     borderBottomColor: '#f2f2f2',
     paddingBottom: 5
    },
    textSign: {
      color: 'deepskyblue',
      fontWeight: 'bold',
      paddingVertical: 5,
    },
    text: {
      color: '#fff',
      fontWeight: '900',
    },
    textInput: {
      paddingVertical: 10,
      textAlign: 'center'
   },
   saveButton: {
     backgroundColor: 'deepskyblue',
     textAlign: 'center',
     fontWeight: '900',
     color: '#fff',
     paddingVertical: 10,
     paddingHorizontal: 10,
     borderRadius: 20,
    },
    setButton: {
      backgroundColor: 'deepskyblue',
      textAlign: 'center',
     fontWeight: '900',
     color: '#fff',
     marginHorizontal: 10,
     paddingVertical: 15,
     paddingHorizontal: 10,
     borderRadius: 5,
    }
  });
  
  export default App;
  
  // const {dirs: {DownloadDir, DocumentDir } } = RNFetchBlob.fs;
  // const {config} = RNFetchBlob;
  // const platformPath = Platform.select({ios: DocumentDir, android: DownloadDir});
  // var imageURI = signature
  // var ext = 'png'
  // var fileName = 'sign.png'
  
  // const filePath = `${platformPath}/${fileName}`;
  // const configOptions = Platform.select({
  //   ios: {
  //     fileCache: true,
  //     path: filePath,
  //     appendExt: ext,
  //   },
  //   android: {
  //     fileCache: false,
  //     appendExt: ext,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: platformPath + "/" + fileName,
  //       description: 'Signature'
  //     }
  //   },
  // });
  
  // if (isIOS) {
  //   RNFetchBlob.config(configOptions)
  //   .fetch('GET', imageURI)
  //   .then((res) => {
  //     console.log("file ", res)
  //     RNFetchBlob.ios.previewDocument("file://"+res.path())
  //   })
  //   .then((console.log(succesful)));
  //   return;
  // }else{
  //   config(configOptions).
  //   fetch('GET', imageURI)
  //   .progress((recieved, total) => {
  //     console.log("Progres", recieved / total);
  //   })
  //   .then((res) => {
  //     console.log("file_download", res)
  //     RNFetchBlob.android.actionViewIntent(res.path())
  //   })
  //   .catch((errorMessage, statusCode) => {
  //     console.log("Error with downloading file", errorMessage)
  //   })
  // }