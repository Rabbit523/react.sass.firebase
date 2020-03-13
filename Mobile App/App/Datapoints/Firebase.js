/**
 * FIX FOR ANDROID FIRESTORE
 */
const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  if (body === '') {
    originalSend.call(this);
  } else {
    originalSend.call(this, body);
  }
};
//END FIX

import * as firebase from 'firebase';
import Config from '../../config'
require("firebase/firestore");
firebase.initializeApp(Config.firebaseConfig);

/**
 *  Fix for latest version on Firestore
 */
const firestore=firebase.firestore();
const settings={
  //
}
firestore.settings({timestampsInSnapshots:true});
//END FIX 



export default firebase;
