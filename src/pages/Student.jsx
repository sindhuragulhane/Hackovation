export default function Student() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Student Dashboard 📚
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Access lessons, quizzes, and discussions anytime. Your personalized space 
          to learn and grow with smart tools.
        </p>
        <button className="mt-6 px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition">
          Start Learning
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">📖 Lessons</h3>
          <p className="mt-2 text-gray-600">
            Explore interactive lessons curated by your teachers.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">📝 Quizzes</h3>
          <p className="mt-2 text-gray-600">
            Attempt quizzes offline and sync results automatically when online.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-green-600">💬 Discussions</h3>
          <p className="mt-2 text-gray-600">
            Join class discussions, ask questions, and collaborate with peers.
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">📊 Student Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-green-700">Lessons</h3>
            <p className="text-gray-600 mt-2">8 Lessons Completed</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-teal-700">Quizzes</h3>
            <p className="text-gray-600 mt-2">2 Pending Quizzes</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold text-emerald-700">Discussions</h3>
            <p className="text-gray-600 mt-2">5 Active Threads</p>
          </div>
        </div>
      </section>
    </div>
  );
}
