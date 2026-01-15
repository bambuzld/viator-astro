import { useState, useEffect } from "react";
import { getCurrentLanguage, type LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import hrTranslations from "@/i18n/translations/hr.json";
import enTranslations from "@/i18n/translations/en.json";
import frTranslations from "@/i18n/translations/fr.json";
import deTranslations from "@/i18n/translations/de.json";

const translations: Record<LanguageCode, typeof hrTranslations> = {
  hr: hrTranslations,
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  email: string;
  bookingReference: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function CustomerSupportPage() {
  const [language, setLanguage] = useState<LanguageCode>("hr");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bookingReference: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setLanguage(getCurrentLanguage());

    const handleLanguageChange = () => {
      setLanguage(getCurrentLanguage());
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);

  const t = translations[language].customerSupport;

  const faqs: FAQItem[] = Object.values(t.faqs);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = t.form.errors.nameRequired;
    }

    if (!formData.email.trim()) {
      errors.email = t.form.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t.form.errors.emailInvalid;
    }

    if (!formData.subject.trim()) {
      errors.subject = t.form.errors.subjectRequired;
    }

    if (!formData.message.trim()) {
      errors.message = t.form.errors.messageRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      name: "",
      email: "",
      bookingReference: "",
      subject: "",
      message: "",
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <ContactCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            title={t.contact.phone.title}
            description={t.contact.phone.description}
            action={
              <a href="tel:+38516265222" className="text-primary hover:underline font-semibold">
                +385 1 6265 222
              </a>
            }
            highlight={t.contact.phone.hours}
          />

          <ContactCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title={t.contact.email.title}
            description={t.contact.email.description}
            action={
              <a href="mailto:support@lastminute-rentacar.hr" className="text-primary hover:underline font-semibold">
                support@lastminute-rentacar.hr
              </a>
            }
            highlight={t.contact.email.responseTime}
          />

          <ContactCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title={t.contact.office.title}
            description={t.contact.office.description}
            action={
              <a href="/offices" className="text-primary hover:underline font-semibold">
                {t.contact.office.viewOffices}
              </a>
            }
            highlight={t.contact.office.locations}
          />
        </div>

        {/* Emergency Assistance Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-1">{t.emergency.title}</h3>
              <p className="text-red-700">{t.emergency.description}</p>
            </div>
            <a
              href="tel:+385915551234"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +385 91 555 1234
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.faqTitle}</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQAccordion
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isExpanded={expandedFAQ === index}
                  onToggle={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>

          {/* Support Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.form.title}</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.form.successTitle}</h3>
                  <p className="text-gray-600">{t.form.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t.form.name} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                          formErrors.name ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder={t.form.namePlaceholder}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t.form.email} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                          formErrors.email ? "border-red-500" : "border-gray-200"
                        )}
                        placeholder={t.form.emailPlaceholder}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.form.bookingReference}
                    </label>
                    <input
                      type="text"
                      id="bookingReference"
                      name="bookingReference"
                      value={formData.bookingReference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder={t.form.bookingReferencePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.form.subject} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                        formErrors.subject ? "border-red-500" : "border-gray-200"
                      )}
                    >
                      <option value="">{t.form.subjectPlaceholder}</option>
                      {Object.entries(t.form.subjects).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.form.message} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none",
                        formErrors.message ? "border-red-500" : "border-gray-200"
                      )}
                      placeholder={t.form.messagePlaceholder}
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t.form.sending}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {t.form.submit}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  highlight: string;
}

function ContactCard({ icon, title, description, action, highlight }: ContactCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="mb-3">{action}</div>
      <p className="text-xs text-gray-500">{highlight}</p>
    </div>
  );
}

interface FAQAccordionProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQAccordion({ question, answer, isExpanded, onToggle }: FAQAccordionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <svg
          className={cn(
            "w-5 h-5 text-gray-500 flex-shrink-0 transition-transform",
            isExpanded && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-96" : "max-h-0"
        )}
      >
        <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
