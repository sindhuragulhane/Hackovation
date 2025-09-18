export default function Teacher() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Teacher Dashboard 👩‍🏫
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Create lessons, upload slides, and track student progress — all in one powerful dashboard.
        </p>
        <button className="mt-6 px-8 py-3 bg-yellow-600 text-white rounded-xl shadow-lg hover:bg-yellow-700 transition">
          Upload Content
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-yellow-600">📂 Upload Lessons</h3>
          <p className="mt-2 text-gray-600">
            Share slides, PDFs, and notes with your students instantly.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-yellow-600">📊 Track Progress</h3>
          <p className="mt-2 text-gray-600">
            Monitor student activity, lesson completion, and quiz results.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-yellow-600">🔔 Announcements</h3>
          <p className="mt-2 text-gray-600">
            Post important updates and notify students in real-time.
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">📌 Teacher Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-yellow-700">Uploads</h3>
            <p className="text-gray-600 mt-2">12 Files Shared</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-orange-700">Lessons</h3>
            <p className="text-gray-600 mt-2">6 Active Lessons</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-amber-700">Quizzes</h3>
            <p className="text-gray-600 mt-2">3 Created Quizzes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
