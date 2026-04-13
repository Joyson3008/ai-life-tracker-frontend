type Props = {
  result: any;
  onDownload: () => void;
};

export default function AIResult({ result, onDownload }: Props) {
  if (!result) return null;

  return (
    <div className="mt-12 bg-[#121826] p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">⭐ Score: {result.score || 0}</h2>

        <button
          onClick={onDownload}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          📄 Download PDF
        </button>
      </div>

      <div className="space-y-4 text-gray-300">
        <div>
          <strong>📊 Summary:</strong>{" "}
          {result.finalSummary || result.aiFeedback}
        </div>
        <div>
          <strong>🔥 Motivation:</strong> {result.motivation}
        </div>
        <div>
          <strong>📖 Bible:</strong> {result.bibleReview}
        </div>
        <div>
          <strong>📚 Book:</strong> {result.bookReview}
        </div>
        <div>
          <strong>💻 Coding:</strong> {result.codingReview}
        </div>
        <div>
          <strong>🧠 CS:</strong> {result.csTopicReview}
        </div>
        <div>
          <strong>🏫 College:</strong> {result.collegeReview}
        </div>
        <div>
          <strong>📔 Diary:</strong> {result.diaryReview}
        </div>
        <div>
          <strong>💰 Expenses:</strong> {result.expensesReview}
        </div>
        <div>
          <strong>🎬 Movie:</strong> {result.movieReview}
        </div>
        <div>
          <strong>📱 Phone:</strong> {result.phoneUsageReview}
        </div>
      </div>
    </div>
  );
}
