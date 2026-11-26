import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Mail,
  MessageSquare,
  Send,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useCreateContactInquiryMutation,
  useDeleteContactInquiryMutation,
  useGetUserContactInquiriesQuery,
} from '../app/api/pscApi';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { SharedSearchSelect } from '../components/common/SharedSearchSelect';
import { useAuth } from '../context/AuthContext';
import {
  storageService,
  type ContactInquiryRecord,
  type InquiryCategory,
  type InquiryStatus,
} from '../services/storageService';
import { formatRelativeDate } from '../utils/pdfHelpers';
import { copyWithToast } from '../utils/clipboardHelpers';
import {
  formatUserFriendlyError,
  isFirestoreOfflineError,
} from '../utils/errorHelpers';
import { toast } from '../services/toastService';
import { useGoogleAdsConversion } from '../hooks/useGoogleAdsConversion';
import { trackAnalyticsEvent } from '../services/analyticsService';
import {
  CONTACT_CATEGORY_OPTIONS,
  CONTACT_DIRECT_DESK,
  CONTACT_FORM_COPY,
  CONTACT_PAGE_HEADER,
  CONTACT_QUICK_LINKS,
  CONTACT_SUPPORT_TOPICS,
  getInquiryCategoryLabel,
} from '../data/contactContentData';

const SUPPORT_EMAIL = CONTACT_DIRECT_DESK.email;
const CATEGORY_OPTIONS = CONTACT_CATEGORY_OPTIONS;
const getCategoryLabel = getInquiryCategoryLabel;

const STATUS_BADGE: Record<
  InquiryStatus,
  { label: string; badgeClass: string }
> = {
  open: {
    label: 'Open',
    badgeClass:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
  },
  'in-review': {
    label: 'In Review',
    badgeClass:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
  },
  resolved: {
    label: 'Resolved',
    badgeClass:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
  },
};

export function ContactPage() {
  const { user, signInWithGoogle } = useAuth();
  const { trackInquiryConversion } = useGoogleAdsConversion();
  const canSyncCloud = Boolean(user && user.emailVerified);

  const [name, setName] = useState(() => user?.displayName || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [category, setCategory] = useState<InquiryCategory>('quiz-errata');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [localInquiries, setLocalInquiries] = useState<ContactInquiryRecord[]>(
    () => storageService.loadContactInquiries()
  );
  const [lastSubmitted, setLastSubmitted] =
    useState<ContactInquiryRecord | null>(null);

  const { data: cloudInquiries = [], isFetching: isFetchingCloud } =
    useGetUserContactInquiriesQuery(user?.uid ?? '', {
      skip: !canSyncCloud || !user?.uid,
    });
  const [createContactInquiry, { isLoading: isSubmitting }] =
    useCreateContactInquiryMutation();
  const [deleteContactInquiry] = useDeleteContactInquiryMutation();

  // Pre-fill authenticated account name/email once user state hydrates
  useEffect(() => {
    if (user?.displayName && !name.trim()) {
      setName(user.displayName);
    }
    if (user?.email && !email.trim()) {
      setEmail(user.email);
    }
  }, [user?.displayName, user?.email, name, email]);

  const inquiries = useMemo<ContactInquiryRecord[]>(() => {
    if (!canSyncCloud) {
      return localInquiries;
    }
    const merged = new Map<string, ContactInquiryRecord>();
    for (const item of cloudInquiries) {
      merged.set(item.id, item);
    }
    for (const draft of localInquiries) {
      if (!merged.has(draft.id)) {
        merged.set(draft.id, draft);
      }
    }
    return Array.from(merged.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }, [canSyncCloud, cloudInquiries, localInquiries]);

  const activeCategoryConfig =
    CATEGORY_OPTIONS.find((c) => c.value === category) ?? CATEGORY_OPTIONS[0];

  const handleCopyEmail = async () => {
    const ok = await copyWithToast(
      SUPPORT_EMAIL,
      CONTACT_DIRECT_DESK.copyToastMessage
    );
    if (ok) {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedReference = reference.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError('Please enter your name.');
      return;
    }
    if (trimmedName.length > 120) {
      setFormError('Name must be 120 characters or fewer.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (trimmedReference.length > 300) {
      setFormError('Reference ID or URL must be 300 characters or fewer.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setFormError(
        'Please include at least 10 characters describing your inquiry or question note.'
      );
      return;
    }
    if (trimmedMessage.length > 4000) {
      setFormError('Details must be 4,000 characters or fewer.');
      return;
    }

    setFormError(null);

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const record: ContactInquiryRecord = {
      id: `inq-${Date.now()}`,
      ...(canSyncCloud && user ? { userId: user.uid } : {}),
      ticketCode: `PSC-${new Date().getFullYear()}-${randomCode}`,
      name: trimmedName,
      email: trimmedEmail,
      category,
      reference: trimmedReference,
      message: trimmedMessage,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    if (canSyncCloud && user) {
      try {
        const created = await createContactInquiry({
          userId: user.uid,
          inquiry: record,
        }).unwrap();
        trackAnalyticsEvent('contact_inquiry_submitted', {
          category,
          synced_cloud: true,
        });
        trackInquiryConversion({ transactionId: created.ticketCode });
        setLastSubmitted(created);
        toast.success(
          `Ticket ${created.ticketCode} submitted to the editorial desk.`
        );
        setReference('');
        setMessage('');
        return;
      } catch (err) {
        if (isFirestoreOfflineError(err)) {
          const updatedLocal = [record, ...localInquiries].slice(0, 25);
          setLocalInquiries(updatedLocal);
          storageService.saveContactInquiries(updatedLocal);
          setLastSubmitted(record);
          toast.warning(
            'Cloud database is offline. Saved draft to workspace cache; you can also dispatch via email.'
          );
          setReference('');
          setMessage('');
          return;
        }
        setFormError(
          formatUserFriendlyError(
            err,
            'Could not submit inquiry right now. Please try again.'
          )
        );
        return;
      }
    }

    const updated = [record, ...localInquiries].slice(0, 25);
    setLocalInquiries(updated);
    storageService.saveContactInquiries(updated);
    trackAnalyticsEvent('contact_inquiry_submitted', {
      category,
      synced_cloud: false,
    });
    trackInquiryConversion({ transactionId: record.ticketCode });
    setLastSubmitted(record);
    toast.success(
      `Support note ${record.ticketCode} prepared. Sign in to sync & track editorial replies.`
    );

    setReference('');
    setMessage('');
  };

  const handleDeleteInquiry = async (item: ContactInquiryRecord) => {
    const isCloudRecord =
      canSyncCloud && cloudInquiries.some((c) => c.id === item.id);

    if (isCloudRecord) {
      try {
        await deleteContactInquiry(item.id).unwrap();
      } catch (err) {
        toast.error(
          formatUserFriendlyError(
            err,
            'Could not remove inquiry from your cloud account.'
          )
        );
        return;
      }
    }

    const updatedLocal = localInquiries.filter((entry) => entry.id !== item.id);
    setLocalInquiries(updatedLocal);
    storageService.saveContactInquiries(updatedLocal);
    if (lastSubmitted?.id === item.id) {
      setLastSubmitted(null);
    }
    toast.info(`Removed inquiry ${item.ticketCode}.`);
  };

  const handleClearDraftsOnly = () => {
    setLocalInquiries([]);
    storageService.clearContactInquiries();
    toast.info('Cleared guest inquiry drafts.');
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
                  {CONTACT_PAGE_HEADER.breadcrumbLabel}
                </span>
              </div>

              <h1 className="font-serif text-fluid-h1 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                {CONTACT_PAGE_HEADER.title}
              </h1>
              <p className="mt-2.5 text-fluid-lead text-zinc-600 dark:text-zinc-400">
                {CONTACT_PAGE_HEADER.description}
              </p>
            </div>

            {/* Two-Column Editorial Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Channels & Support Scope */}
              <div className="lg:col-span-5 space-y-8">
                <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {CONTACT_DIRECT_DESK.label}
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
                      {CONTACT_DIRECT_DESK.sampleCodes[0]}
                    </span>{' '}
                    or{' '}
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">
                      {CONTACT_DIRECT_DESK.sampleCodes[1]}
                    </span>
                    ) along with the relevant statutory article or edition.
                  </p>
                </div>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-sm">
                  {CONTACT_SUPPORT_TOPICS.map((topic) => (
                    <div key={topic.title} className="py-4 space-y-1">
                      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {topic.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  ))}

                  <div className="py-4 flex flex-wrap items-center gap-4 text-xs font-medium">
                    {CONTACT_QUICK_LINKS.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
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
                          {canSyncCloud
                            ? 'Inquiry Synced to Editorial Desk'
                            : 'Inquiry Prepared'}{' '}
                          · Reference{' '}
                          <span className="font-mono tabular-nums">
                            {lastSubmitted.ticketCode}
                          </span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                      {canSyncCloud
                        ? 'Your ticket is saved in your cloud account so you can track its review status and official reply below. You can also send an email copy to '
                        : 'Your inquiry note is ready. You can dispatch it directly to '}
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
                  onSubmit={(e) => void handleSubmit(e)}
                  noValidate
                  className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-7 space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50">
                      {CONTACT_FORM_COPY.heading}
                    </h2>
                    {canSyncCloud ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70">
                        <Cloud className="w-3 h-3" />
                        <span>Cloud Ticket Tracking Active</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void signInWithGoogle()}
                        className="text-[11px] font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Sign in to sync &amp; track replies →
                      </button>
                    )}
                  </div>

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
                        maxLength={120}
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
                        maxLength={254}
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
                        maxLength={300}
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
                        {message.length}/4000 chars
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      maxLength={4000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={CONTACT_FORM_COPY.detailsPlaceholder}
                      className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-fluid-body text-zinc-900 dark:text-zinc-100 placeholder:text-xs sm:placeholder:text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {CONTACT_FORM_COPY.footerNote}
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-crimson-700 text-white hover:bg-crimson-800 dark:bg-crimson-600 dark:text-white dark:hover:bg-crimson-500 disabled:opacity-60 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isSubmitting
                          ? 'Submitting...'
                          : CONTACT_FORM_COPY.submitLabel}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Synced & Draft Inquiries Log */}
                {(inquiries.length > 0 || (canSyncCloud && isFetchingCloud)) && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-fluid-h3 font-semibold text-zinc-900 dark:text-zinc-100">
                        Your Submitted Inquiries ({inquiries.length})
                      </h3>
                      {localInquiries.length > 0 && !canSyncCloud && (
                        <button
                          type="button"
                          onClick={handleClearDraftsOnly}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear drafts</span>
                        </button>
                      )}
                    </div>

                    {isFetchingCloud && inquiries.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 py-4">
                        Loading your cloud inquiry tickets...
                      </p>
                    ) : (
                      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
                        {inquiries.map((item) => {
                          const statusStyle =
                            STATUS_BADGE[item.status] ?? STATUS_BADGE.open;
                          return (
                            <div
                              key={item.id}
                              className="py-3.5 space-y-2.5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="min-w-0 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                      {item.ticketCode}
                                    </span>
                                    <span
                                      className={`font-sans text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle.badgeClass}`}
                                    >
                                      {statusStyle.label}
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
                                    onClick={() =>
                                      void handleDeleteInquiry(item)
                                    }
                                    aria-label={`Delete inquiry ${item.ticketCode}`}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {item.adminReply && (
                                <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/70 p-3 text-xs space-y-1">
                                  <div className="flex items-center justify-between gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                                    <span className="inline-flex items-center gap-1.5">
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>Official Editorial Reply</span>
                                    </span>
                                    {item.respondedAt && (
                                      <span className="text-[11px] font-normal text-emerald-700/80 dark:text-emerald-300/80">
                                        {formatRelativeDate(item.respondedAt)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed whitespace-pre-wrap">
                                    {item.adminReply}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
