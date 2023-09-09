import {
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  ClipboardEvent,
  MouseEventHandler,
  useRef,
  KeyboardEvent,
  FormEvent
} from "react"
import { toast } from "react-hot-toast"
import { SVG } from "./ui/svg"
import PasteIcon from '@/assets/images/paste.svg'
import UploadIcon from '@/assets/images/upload.svg'
import CameraIcon from '@/assets/images/camera.svg'
import { BingReturnType } from '@/lib/hooks/use-bing'
import { cn } from '@/lib/utils'
import { ImageUtils } from "@/lib/image"

interface ChatImageProps extends Pick<BingReturnType, 'uploadImage'> {}

const preventDefault: MouseEventHandler<HTMLDivElement> = (event) => {
  event.nativeEvent.stopImmediatePropagation()
}

export function ChatImage({ children, uploadImage }: React.PropsWithChildren<ChatImageProps>) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const mediaStream = useRef<MediaStream>()
  const [panel, setPanel] = useState('none')

  const upload = useCallback((url: string) => {
    if (url) {
      uploadImage(url)
      if (fileRef.current) {
        fileRef.current.value = ''
      }
    }
    setPanel('none')
  }, [panel])

  const onUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileDataUrl = await ImageUtils.getCompressedImageDataAsync(file)
      if (fileDataUrl) {
        upload(fileDataUrl)
      }
    }
  }, [])

  const onPaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
    const pasteUrl = event.clipboardData.getData('text') ?? ''
    upload(pasteUrl)
  }, [])

  const onEnter = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // @ts-ignore
    const inputUrl = event.target?.elements?.image?.value?.trim?.()
    if (inputUrl) {
      if (/^https?:\/\/.+/.test(inputUrl)) {
        upload(inputUrl)
      } else {
        toast.error('Please enter a valid image link')
      }
    }
  }, [])

  const openVideo: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()
    setPanel('camera-mode')
  }

  const onCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current
      canvas.width = videoRef.current!.videoWidth
      canvas.height = videoRef.current!.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const cameraUrl = canvas.toDataURL('image/jpeg')
      upload(cameraUrl)
    }
  }

  useEffect(() => {
    const handleBlur = () => {
      if (panel !== 'none') {
        setPanel('none')
      }
    }
    document.addEventListener('click', handleBlur)
    return () => {
      document.removeEventListener('click', handleBlur)
    }
  }, [panel])

  useEffect(() => {
    if (panel === 'camera-mode') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(videoStream => {
        mediaStream.current = videoStream
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream
        }
      })
    } else {
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(function(track) {
          track.stop()
        })
        mediaStream.current = undefined
      }
    }
  }, [panel])

return (
  <div className="visual-search-container">
    <div onClick={() => panel === 'none' ? setPanel('normal') : setPanel('none')}>{children}</div>
    <div className={cn('visual-search', panel)} onClick={preventDefault}>
      <div className="normal-content">
        <div className="header">
          <h4>Upload an image</h4>
        </div>
        <div className="paste">
          <SVG alt="paste" src={PasteIcon} width={24} />
          <form onSubmitCapture={onEnter}>
            <input
              className="paste-input"
              id="sb_imgpst"
              type="text"
              name="image"
              placeholder="Paste the image URL"
              aria-label="Paste the image URL"
              onPaste={onPaste}
              onClickCapture={(e) => e.stopPropagation()}
            />
          </form>
        </div>
      </div>
    </div>
  </div>
);

