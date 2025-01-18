import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Camera() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [reps, setReps] = useState(0)
  const [exercise, setExercise] = useState('Deadlift')
  const [timer, setTimer] = useState(53)
  const [progress, setProgress] = useState(30)
  const [error, setError] = useState('')
  const [showLogModal, setShowLogModal] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setHasPermission(true);
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError(err.message);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      {/* Close Button - positioned at very top right */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-2 right-2 z-[100] w-[72px] h-[72px] rounded-[24px]flex items-center justify-center "
      >
        <svg 
          className="w-8 h-8 text-white" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="fixed inset-0 flex flex-col bg-black">
        {/* Camera Container */}
        <div className="relative">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full"
            style={{ transform: 'scaleX(1)', borderRadius: '0 0 4rem 4rem' }}
          />

          {/* Exercise Reference Image - Bottom Right
          <div className="absolute bottom-20 right-6 z-20 w-16 h-16 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
            <img 
              src="/exercises/Barbell_Deadlift/0.jpg" 
              alt="Deadlift" 
              className="w-full h-full object-cover"
            />
          </div> */}
        </div>

        {/* Exercise Title and Feedback */}
        <div className="bg-gray-900/50 px-2 py-2">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {exercise}
          </h2>
          <div className="flex justify-center items-center">
            <p 
              className="bg-red-500/20 text-red-500 text-center leading-[0.9] tracking-tighter font-extrabold py-2 px-4 rounded-lg"
              style={{ fontSize: '80px' }}
            >
              Keep your back straight!
            </p>
          </div>
        </div>

        {/* Log Set Modal */}
        {showLogModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Log Deadlift Set</h3>
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Set Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>Weight (kg)</div>
                  <div>Reps</div>
                  <div></div>
                </div>

                {[
                  { weight: 50, reps: 10, completed: true },
                  { weight: 50, reps: 10, completed: true },
                  { weight: 50, reps: 9, completed: false },
                ].map((set, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <input
                      type="number"
                      value={set.weight}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-center"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-center"
                    />
                    <button className="bg-green-500 h-12 rounded-lg flex items-center justify-center hover:bg-green-600">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button 
                className="w-full mt-6 py-4 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-all"
                onClick={() => setShowLogModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
