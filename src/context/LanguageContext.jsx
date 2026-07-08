import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../utils/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // تم تعديل الحالة الافتراضية لتقرأ 'ar' دائماً وتتجاهل أي قيمة قديمة مخزنة بالخطأ في الـ localStorage
  const [lang, setLang] = useState(() => 'ar');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }, [lang]);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.ar;
    return (key) => dict[key] ?? translations.ar[key] ?? key;
  }, [lang]);

  // التعديل هنا: تم تعطيل التبديل للانجليزية وتثبيتها على العربي لضمان عدم حدوث أي تغيير برمجي في باقي الصفحات
  const toggleLang = () => setLang('ar'); 
  /* اللوجيك القديم المحفوظ كتعليق:
  const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  */

  const value = {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    setLang,
    toggleLang,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}