import { useEffect, useRef, useState } from 'react'

function getRecordingOptions() {
  if (typeof MediaRecorder === 'undefined') return undefined

  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  const mimeType = types.find((type) => MediaRecorder.isTypeSupported(type))
  return mimeType ? { mimeType } : undefined
}

export default function VendorRegistration({ onConfirm, mode = 'vendor' }) {
  const isTalkPage = mode === 'talk'
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const isPressingRef = useRef(false)

  async function transcribeAudio(audioBlob) {
    setIsTranscribing(true)
    setError('')
    setConfirmed(false)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, `${isTalkPage ? 'talk' : 'vendor-registration'}-recording.webm`)
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || 'We could not transcribe that recording. Please try again.')
      }
      const nextTranscript = data.text || data.transcript
      if (!nextTranscript) throw new Error('The transcription service returned no text.')
      setTranscript(nextTranscript)
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  async function startRecording(event) {
    event.preventDefault()
    if (isRecording || isTranscribing) return

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Audio recording is not supported in this browser.')
      return
    }

    isPressingRef.current = true
    setError('')
    setTranscript('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!isPressingRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      const recorder = new MediaRecorder(stream, getRecordingOptions())
      streamRef.current = stream
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (recordingEvent) => {
        if (recordingEvent.data.size > 0) chunksRef.current.push(recordingEvent.data)
      }
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        if (audioBlob.size > 0) transcribeAudio(audioBlob)
      }

      recorder.start()
      setIsRecording(true)
    } catch (recordingError) {
      isPressingRef.current = false
      setError(
        recordingError.name === 'NotAllowedError'
          ? 'Microphone access is required to record your registration.'
          : 'We could not start the microphone. Please try again.'
      )
    }
  }

  function stopRecording(event) {
    event?.preventDefault()
    isPressingRef.current = false
    if (!recorderRef.current || recorderRef.current.state === 'inactive') return
    setIsRecording(false)
    recorderRef.current.stop()
  }

  function confirmTranscript() {
    setConfirmed(true)
    onConfirm?.(transcript)
  }

  useEffect(() => () => {
    isPressingRef.current = false
    if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  return (
    <section className="bg-night text-paper">
      <div className="max-w-xl mx-auto px-6 py-12 text-center">
        <p className="text-marigold text-sm font-medium mb-2">
          {isTalkPage ? 'Talk to us' : 'Vendor registration'}
        </p>
        <h2 className="font-display text-3xl">
          {isTalkPage ? 'Tell us what you need' : 'Tell us about your business'}
        </h2>
        <p className="text-paper/70 mt-3 max-w-md mx-auto">
          {isTalkPage
            ? 'Press and hold the microphone, speak naturally, then release to review your message.'
            : 'Press and hold the microphone, describe your business naturally, then release to review your registration.'}
        </p>

        <button
          type="button"
          aria-label={isRecording ? 'Release to stop recording' : 'Press and hold to record'}
          aria-pressed={isRecording}
          disabled={isTranscribing}
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerCancel={stopRecording}
          onPointerLeave={isRecording ? stopRecording : undefined}
          onContextMenu={(event) => event.preventDefault()}
          className={`mx-auto mt-9 flex h-36 w-36 touch-none select-none items-center justify-center rounded-full border-4 transition-all disabled:cursor-wait disabled:opacity-60 ${
            isRecording
              ? 'border-marigold bg-marigold text-night scale-105 shadow-[0_0_0_14px_rgba(244,161,0,0.18)]'
              : 'border-paper/50 bg-paper/10 text-paper hover:border-marigold hover:text-marigold'
          }`}
        >
          <span className="text-5xl" aria-hidden="true">{isRecording ? '■' : '●'}</span>
        </button>

        <p className="mt-5 text-sm text-paper/60" aria-live="polite">
          {isTranscribing ? 'Transcribing your recording...' : isRecording ? 'Release when you are finished' : 'Press and hold to speak'}
        </p>

        {error && (
          <p role="alert" className="mt-6 border border-vermillion/50 bg-paper px-4 py-3 text-left text-sm text-vermillion">
            {error}
          </p>
        )}

        {transcript && !confirmed && (
          <div className="mt-8 border-2 border-teal bg-paper p-5 text-left text-ink">
            <p className="text-sm font-semibold text-teal">
              {isTalkPage ? 'Review your message' : 'Review your registration'}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed">{transcript}</p>
            <button
              type="button"
              onClick={confirmTranscript}
              className="mt-5 w-full bg-vermillion py-3 font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {isTalkPage ? 'Confirm message' : 'Confirm vendor registration'}
            </button>
          </div>
        )}

        {confirmed && (
          <p className="mt-8 border-2 border-teal px-4 py-3 text-left text-sm text-paper" role="status">
            {isTalkPage
              ? 'Your message has been confirmed.'
              : 'Your vendor registration has been confirmed.'}
          </p>
        )}
      </div>
    </section>
  )
}