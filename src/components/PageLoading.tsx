import { LoaderCircle } from "lucide-react";
import "../styles/page-loading.css";

type Props = {
  title: string;
  detail?: string;
  darkMode: boolean;
};

export default function PageLoading({ title, detail, darkMode }: Props) {
  return (
    <main
      className={`page-loading ${darkMode ? "page-loading-dark" : "page-loading-light"}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loading-content">
        <div className="page-loading-icon" aria-hidden="true">
          <LoaderCircle className="page-loading-spinner" strokeWidth={1.8} />
        </div>
        <div className="page-loading-copy">
          <p className="page-loading-title">{title}</p>
          {detail && <p className="page-loading-detail">{detail}</p>}
        </div>
      </div>
    </main>
  );
}