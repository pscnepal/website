import { useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Send,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import {
  storageService,
  type ContactInquiryRecord,
  type InquiryCategory,
} from '../services/storageService';
import { formatRelativeDate } from '../utils/pdfHelpers';

const SUPPORT_EMAIL = 'info.pscnepal@gmail.com';

const CATEGORY_OPTIONS: Array<{
  value: InquiryCategory;
  label: string;
  placeholder: string;
}> = [
  {
    value: 'quiz-errata',
    label: 'Quiz / Written Q&A Errata',
    placeholder: 'e.g. PSC-LANG-100, PSC-WR-201, or Article reference...',
  },
  {
    value: 'material-request',
    label: 'Reading Material / Syllabus Request',
    placeholder: 'e.g. Local Government Operation Act 2074 PDF...',
  },
  {
    value: 'reader-support',
    label: 'PDF Reader / Flipbook Support',
    placeholder: 'e.g. External PDF CORS link or zoom behavior...',
  },
  {
    value: 'general',
    label: 'General Inquiry & Feedback',
    placeholder: 'Optional document URL or quiz set name...',
  },
];

function getCategoryLabel(category: InquiryCategory): string {
  return (
    CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ??
    'General Inquiry'
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<InquiryCategory>('quiz-errata');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>(() =>
    storageService.loadContactInquiries()
  );
  const [lastSubmitted, setLastSubmitted] =
    useState<ContactInquiryRecord | null>(null);

  const activeCategoryConfig =
    CATEGORY_OPTIONS.find((c) => c.value === category) ?? CATEGORY_OPTIONS[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fail quietly if clipboard is restricted
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError('Please enter your name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setFormError(
        'Please include at least 10 characters describing your inquiry or question note.'
      );
      return;
    }

    setFormError(null);

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const record: ContactInquiryRecord = {
      id: `inq-${Date.now()}`,
      ticketCode: `PSC-${new Date().getFullYear()}-${randomCode}`,
      name: trimmedName,
      email: trimmedEmail,
      category,
      reference: reference.trim(),
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    const updated = [record, ...inquiries].slice(0, 25);
    setInquiries(updated);
    storageService.saveContactInquiries(updated);
    setLastSubmitted(record);

    setReference('');
    setMessage('');
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter((item) => item.id !== id);
    setInquiries(updated);
    storageService.saveContactInquiries(updated);
    if (lastSubmitted?.id === id) {
      setLastSubmitted(null);
    }
  };

  const handleClearInquiries = () => {
    setInquiries([]);
    setLastSubmitted(null);
    storageService.clearContactInquiries();
  };

  const buildMailtoHref = (item: ContactInquiryRecord): string => {
    const subject = `[PSC Nepal ${item.ticketCode}] ${getCategoryLabel(
      item.category
    )}`;
    const bodyLines = [
      `Name: ${item.name}`,
      `Email: ${item.email}`,
      `Category: ${getCategoryLabel(item.category)}`,
      item.reference ? `Reference ID / URL: ${item.reference}` : null,
      '',
      item.message,
    ].filter((line): line is string => line !== null);

    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
          {/* Header */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
              <Link
                to="/"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                Contact
              </span>
            </div>

            <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
              Contact &amp; Editorial Feedback
            </h1>
            <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
              Report PSC question errata, request additional statutory PDFs or
              syllabus volumes, or share feedback on the PSC Nepal study,
              simulation, and flipbook workspace.
            </p>
          </div>

          {/* Two-Column Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Channels & Support Scope */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Direct Editorial &amp; Support Desk
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex items-center gap-2 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{SUPPORT_EMAIL}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  For objective or written question corrections, include the
                  question code displayed in the header (for example,{' '}
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    PSC-LANG-100
                  </span>{' '}
                  or{' '}
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    PSC-WR-201
                  </span>
                  ) along with the relevant statutory article or edition.
                </p>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-sm">
                <div className="py-4 space-y-1">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Question Bank &amp; Statutory Updates
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    When Acts, Periodic Plan benchmarks, or PSC curricula are
                    amended, submit the updated citation so we can revise both
                    the reference PDF and linked quiz explanations.
                  </p>
                </div>

                <div className="py-4 space-y-1">
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Local-First Privacy Notice
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    PSC Nepal runs entirely in your browser. Submitting the form
                    saves a structured ticket copy locally and prepares a direct
                    email dispatch when you choose to send via your mail client.
                  </p>
                </div>

                <div className="py-4 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <Link
                    to="/privacy"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy →
                  </Link>
                  <Link
                    to="/terms"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    Terms of Service →
                  </Link>
                  <Link
                    to="/features"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    Reader Guide →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Inquiry & Errata Form */}
            <div className="lg:col-span-7 space-y-6">
              {lastSubmitted && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Inquiry Logged · Reference{' '}
                        <span className="font-mono tabular-nums">
                          {lastSubmitted.ticketCode}
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                    Your note has been recorded in your browser&rsquo;s inquiry
                    log. You can also dispatch it directly to{' '}
                    <span className="font-mono">{SUPPORT_EMAIL}</span> with all
                    fields pre-filled:
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={buildMailtoHref(lastSubmitted)}
                      className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send via Email Client</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setLastSubmitted(null)}
                      className="text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Dismiss notice
                    </button>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-7 space-y-5"
              >
                <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                  Submit an Inquiry or Errata Note
                </h2>

                {formError && (
                  <p
                    role="alert"
                    className="text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    {formError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full h-10 sm:h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-[13.5px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 sm:h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-[13.5px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <SharedSearchSelect
                      id="contact-category"
                      label="Topic"
                      value={category}
                      onChange={(val) => setCategory(val as InquiryCategory)}
                      options={CATEGORY_OPTIONS}
                      size="sm"
                      className="w-full"
                      popoverWidth="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-reference"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Question ID or Document URL{' '}
                      <span className="text-zinc-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contact-reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder={activeCategoryConfig.placeholder}
                      className="w-full h-10 sm:h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-900 dark:text-zinc-100 placeholder:font-sans placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Details
                    </label>
                    <span className="font-mono tabular-nums text-[11px] text-zinc-400 dark:text-zinc-500">
                      {message.length} chars
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the question correction, requested study document, or reader feedback..."
                    className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-fluid-body text-zinc-900 dark:text-zinc-100 placeholder:text-xs sm:placeholder:text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Generates a local reference ticket &amp; ready-to-send email
                    draft.
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save &amp; Prepare Inquiry</span>
                  </button>
                </div>
              </form>

              {/* Saved Local Inquiries Log */}
              {inquiries.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100">
                      Your Logged Inquiries ({inquiries.length})
                    </h3>
                    <button
                      type="button"
                      onClick={handleClearInquiries}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear log</span>
                    </button>
                  </div>

                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                    {inquiries.map((item) => (
                      <div
                        key={item.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {item.ticketCode}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-sans">
                              {getCategoryLabel(item.category)}
                            </span>
                            {item.reference && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.reference}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span className="font-sans">
                              {formatRelativeDate(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-fluid-body text-zinc-700 dark:text-zinc-300">
                            {item.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={buildMailtoHref(item)}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(item.id)}
                            aria-label={`Delete inquiry ${item.ticketCode}`}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </PageTransition>
    </div>
  );
}
