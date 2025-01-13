import { useState } from 'react'
import { uploadService } from '../services/upload.service.js'
import { Loader } from './Loader.jsx'
import { updateUserImg } from '../store/actions/user.actions.js'
import { useSelector } from 'react-redux'

export function ImgUploader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const [imgData, setImgData] = useState(user.imgUrl)
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    ev.preventDefault()
    console.log('🚀 ~ uploadImg ~ ev:', ev)
    setIsUploading(true)

    const { secure_url } = await uploadService.uploadImg(ev)
    await updateUserImg({ ...user, imgUrl: secure_url })

    setImgData(secure_url)
    setIsUploading(false)
  }

  function getUploadLabel() {
    if (imgData) return <p className='change-pic'>Change picture?</p>
    return isUploading ? <Loader /> : <p className='upload-pic'>Upload Image</p>
  }

  return (
    <div>
      <div>{getUploadLabel()}</div>

      <label
        className='img-uploader'
        onDrop={uploadImg}
        // onDragOver={console.log}
        onDragOver={(ev) => ev.preventDefault()}
      >
        {imgData ? (
          <img
            style={{ width: '70px', height: '70px', cursor: 'pointer', borderRadius: '50%' }}
            src={imgData}
          ></img>
        ) : (
          <div
            className='user-initial-small'
            style={{ width: '70px', height: '70px', cursor: 'pointer', borderRadius: '50%' }}
          >
            {user.fullname?.charAt(0).toUpperCase()}
          </div>
        )}

        <input hidden type='file' onChange={uploadImg} accept='img/*' />
      </label>
    </div>
  )
}
