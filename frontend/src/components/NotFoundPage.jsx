export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-10 max-w-lg text-center text-white">
        <div className="text-pink-500 text-6xl mb-4">
          <i className="fas fa-exclamation-triangle animate-pulse"></i>
        </div>

        <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
        <p className="text-gray-300 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <a
          href="/"
          className="inline-block mt-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition text-white font-semibold"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}
