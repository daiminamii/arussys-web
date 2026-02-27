// お問い合わせページ
import { useLanguage } from '@/i18n/LanguageContext';
import ContactForm from '@/components/ContactForm';

function ContactPage() {
  const { t } = useLanguage();

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">{t.contact.heading}</h1>
      <p className="mt-2 text-gray-400">{t.contact.subtitle}</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}

export default ContactPage;
