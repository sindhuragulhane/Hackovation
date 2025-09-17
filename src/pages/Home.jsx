export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Classroom Prototype 🚀
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          A Smart Learning Platform where Students & Teachers connect, share lessons, 
          and collaborate seamlessly for the future of education.
        </p>
        <button className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-indigo-600">📚 Student Dashboard</h3>
          <p className="mt-2 text-gray-600">
            Access lessons, attempt quizzes, and engage in discussions — all in one place.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-indigo-600">👩‍🏫 Teacher Dashboard</h3>
          <p className="mt-2 text-gray-600">
            Upload slides, create content, and share updates instantly with students.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-indigo-600">📝 Quizzes & Offline Mode</h3>
          <p className="mt-2 text-gray-600">
            Students can practice quizzes offline and sync results when back online.
          </p>
        </div>
      </section>

      {/* Preview Dashboard Section */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📊 Dashboard Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-indigo-700">Lessons</h3>
            <p className="text-gray-600 mt-2">10 Lessons Available</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-blue-700">Quizzes</h3>
            <p className="text-gray-600 mt-2">3 Active Quizzes</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-purple-700">Uploads</h3>
            <p className="text-gray-600 mt-2">2 New Slides</p>
          </div>
        </div>
      </section>
    </div>
  );
}
