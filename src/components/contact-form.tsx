"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "site",
  message: "",
  consent: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const t = useTranslations("ContactPage");
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = t("errors.name");
    } else if (form.name.trim().length < 2) {
      nextErrors.name = t("errors.nameShort");
    }

    if (!form.email.trim()) {
      nextErrors.email = t("errors.email");
    } else if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = t("errors.emailFormat");
    }

    if (!form.message.trim()) {
      nextErrors.message = t("errors.message");
    } else if (form.message.trim().length < 20) {
      nextErrors.message = t("errors.messageShort");
    }

    if (!form.consent) {
      nextErrors.consent = t("errors.consent");
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || t("errors.submit"));
      }

      setStatus("success");
      setForm(initialState);
      setServerMessage(payload.message || t("success"));
    } catch (error) {
      setStatus("error");
      setServerMessage(error instanceof Error ? error.message : t("errors.submit"));
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <label className="field">
          <span>{t("fields.name")}</span>
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            value={form.name}
          />
          {errors.name ? <small className="field-error">{errors.name}</small> : null}
        </label>

        <label className="field">
          <span>{t("fields.email")}</span>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            value={form.email}
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>
      </div>

      <label className="field">
        <span>{t("fields.company")}</span>
        <input
          autoComplete="organization"
          name="company"
          onChange={(event) => updateField("company", event.target.value)}
          value={form.company}
        />
      </label>

      <label className="field">
        <span>{t("fields.projectType")}</span>
        <select
          name="projectType"
          onChange={(event) => updateField("projectType", event.target.value)}
          value={form.projectType}
        >
          <option value="site">{t("projectOptions.site")}</option>
          <option value="app">{t("projectOptions.app")}</option>
          <option value="platform">{t("projectOptions.platform")}</option>
          <option value="other">{t("projectOptions.other")}</option>
        </select>
      </label>

      <label className="field">
        <span>{t("fields.message")}</span>
        <textarea
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          rows={7}
          value={form.message}
        />
        {errors.message ? <small className="field-error">{errors.message}</small> : null}
      </label>

      <label className="checkbox-row">
        <input
          checked={form.consent}
          onChange={(event) => updateField("consent", event.target.checked)}
          type="checkbox"
        />
        <span>{t("consent")}</span>
      </label>
      {errors.consent ? <small className="field-error">{errors.consent}</small> : null}

      <div className="form-actions">
        <button className="button button-primary" disabled={status === "loading"} type="submit">
          {status === "loading" ? t("submitting") : t("submit")}
        </button>
      </div>

      {status === "success" || status === "error" ? (
        <p className={status === "success" ? "form-status success" : "form-status error"}>{serverMessage}</p>
      ) : null}
    </form>
  );
}
