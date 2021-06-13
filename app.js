import {upload} from './upload.js'
import firebase from 'firebase/app'
import 'firebase/storage'
import firebaseConfig from './firebaseConfig'


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

console.log(storage)

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshop => {
        const percentage = (snapshop.bytesTransferred / snapshop.totalBytes * 100).toFixed(0)
        const block = blocks[index].querySelector('.preview-info-progress')

        block.textContent = percentage + '%'
        block.style.width = percentage + '%'
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log(url)
        })
      })
    })
  }
})