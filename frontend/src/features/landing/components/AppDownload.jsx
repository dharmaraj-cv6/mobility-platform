export default function AppDownload() {
  return (
    <section
      id="download"
      className="px-6 py-20 text-center"
    >
      <h2 className="mb-8 text-4xl font-bold">
        Download the App
      </h2>

      <div className="flex justify-center gap-4">
        <button className="rounded-xl border px-8 py-4">
          Google Play
        </button>

        <button className="rounded-xl border px-8 py-4">
          App Store
        </button>
      </div>
    </section>
  );
}