function DownloadApp() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl rounded-3xl border p-12 text-center shadow">
        <h2 className="mb-6 text-4xl font-bold">
          Download the App
        </h2>

        <p className="mb-8">
          Get the GO SAGO mobile application.
        </p>

        <div className="flex justify-center gap-4">
          <button className="rounded-xl border px-8 py-4">
            Google Play
          </button>

          <button className="rounded-xl border px-8 py-4">
            App Store
          </button>
        </div>
      </div>
    </section>
  );
}

export default DownloadApp;