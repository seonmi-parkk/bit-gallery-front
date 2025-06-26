import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import getCroppedImg from '../../util/cropImage';
import { FaRegEdit } from "react-icons/fa";

type Props = {
  completedImage: (preview: string, file: File) => void;
};

const ProfileImageCropper = ({ completedImage }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_:any, croppedAreaPixels:any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(file);
      setModalOpen(true);
    }
  }

  const base64toFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleCropConfirm = async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(cropped);
      setModalOpen(false);

      const file = base64toFile(cropped, 'profile.jpg');
      completedImage(cropped, file); // 부모로 전달
    } catch (e) {
      console.error(e);
    }
  }

  const customStyle = {
    content: {
      maxWidth: '600px',
      maxHeight: '560px',
      margin: 'auto',
      padding: '20px',
      background: '#000'
    },
    overlay: {
      zIndex: '11',
      background: 'rgba(0, 0, 0, 0.75)'
    }
  }



  return (
    <div>
      <label className="flex justify-center items-center bg-main-3 w-9 h-9 rounded cursor-pointer">
        <span className="text-white pl-0.5 pb-0.5"><FaRegEdit/></span>
        <input type="file" accept="image/*" className='hidden' onChange={handleImageChange} />
      </label>

      <Modal style={customStyle} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} contentLabel="이미지 자르기">
        <div style={{ position: 'relative', width: '100%', height: 450 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={handleCropConfirm} className="px-4 py-2 btn-blue text-white rounded">확인</button>
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">취소</button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileImageCropper;
