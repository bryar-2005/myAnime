export default function Footer() {
  return (
    <footer className="mt-10 px-6 md:px-10 py-10 border-t border-line/50 bg-black/20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Otaku Haven</p>
          <p className="text-sm text-muted leading-relaxed">
            بینینی ئەنیمێ و مانگا و فیلمی هەڵبژێردراو بە شێوازێکی پاک و ڕۆشن.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">گەڕان</p>
          <div className="flex flex-col gap-2 text-sm">
            <a href="/browse" className="text-accent hover:text-white transition">کتێبخانە</a>
            <a href="/schedule" className="text-accent hover:text-white transition">خشتەی پەخش</a>
            <a href="/profile" className="text-accent hover:text-white transition">پڕۆفایل</a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">یارمەتی</p>
          <div className="flex flex-col gap-2 text-sm">
            <a href="mailto:support@example.com" className="text-accent hover:text-white transition">پەیوەندی</a>
            <a href="#" className="text-accent hover:text-white transition">پرسیاری دووبارە</a>
            <a href="#" className="text-accent hover:text-white transition">دۆخ</a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-xs text-muted">
        مافی چاپ {new Date().getFullYear()} Otaku Haven. هەموو مافەکان پارێزراون.
      </div>
    </footer>
  );
}
