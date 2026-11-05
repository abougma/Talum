import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitByIp = new Map<string, number[]>();

function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cloudflare = request.headers.get("cf-connecting-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || cloudflare || "unknown";
}

function hasExceededRateLimit(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const timestamps = rateLimitByIp.get(ip) ?? [];
  const recent = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  recent.push(now);
  rateLimitByIp.set(ip, recent);

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    if (hasExceededRateLimit(request)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes.",
        },
        { status: 429 },
      );
    }

    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      company?: string;
      projectType?: string;
      message?: string;
      consent?: boolean;
    };

    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const projectType = payload.projectType ?? "other";
    const message = payload.message?.trim() ?? "";
    const company = payload.company?.trim() ?? "";
    const consent = Boolean(payload.consent);

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Nom invalide." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Adresse e-mail invalide." }, { status: 400 });
    }

    if (!message || message.length < 20) {
      return NextResponse.json({ ok: false, error: "Le message est trop court." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Le consentement est requis." },
        { status: 400 },
      );
    }

    const toAddress = process.env.CONTACT_TO_EMAIL?.trim();
    const fromAddress = process.env.CONTACT_FROM_EMAIL?.trim();
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey || !toAddress || !fromAddress) {
      console.error(
        "Contact email is not configured. Set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.",
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Le service d’envoi n’est pas encore configuré. Merci de réessayer plus tard.",
        },
        { status: 503 },
      );
    }

    const subject = `Nouvelle demande de projet – ${projectType}`;
    const text = [
      `Nom : ${name}`,
      `Email : ${email}`,
      company ? `Entreprise : ${company}` : null,
      `Type de projet : ${projectType}`,
      "",
      "Message :",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email send failed:", errorText);
      return NextResponse.json(
        { ok: false, error: "Le message n’a pas pu être envoyé pour le moment." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Merci, votre demande a bien été envoyée.",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { ok: false, error: "Une erreur serveur est survenue lors de l’envoi." },
      { status: 500 },
    );
  }
}
