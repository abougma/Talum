import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="site-footer">
      <div>
        <Link className="wordmark" href="/">
          TALOOM<span aria-hidden="true">.</span>
        </Link>
        <p>{t("statement")}</p>
      </div>
      <div className="footer-legal">
        <Link href="/mentions-legales">{t("legal")}</Link>
        <Link href="/confidentialite">{t("privacy")}</Link>
        <span>
          © {new Date().getFullYear()} Taloom. {t("copyright")}
        </span>
      </div>
    </footer>
  );
}
