import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center px-4">
      
      {/* رقم الخطأ الكبير */}
      <span className="font-display text-8xl font-bold text-slate-200 select-none tracking-widest animate-pulse">
        404
      </span>
      
      {/* العنوان الأساسي المترجم */}
      <h1 className="font-display mt-4 text-2xl font-bold text-[#111e38] sm:text-3xl">
        {t('notfound_title') || 'عذراً، هذه الصفحة غير موجودة!'}
      </h1>
      
      {/* الجزء المضاف: شرح مهندل وواضح للمستخدم لسبب المشكلة */}
      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
        {t('notfound_sub') || 'يبدو أنك قمت بكتابة الرابط في شريط العنوان بالأعلى بشكل غير صحيح، أو أن هذه الصفحة تم نقلها أو حفلها نهائياً.'}
      </p>
      
      {/* زر العودة للملف الرئيسي بنفس الكلاس الأصلي */}
      <Link 
        to="/" 
        className="btn-primary mt-8 bg-[#111e38] hover:bg-[#1d2d4f] text-white font-medium py-3 px-6 rounded-xl text-sm transition-all duration-300 shadow-sm active:scale-[0.98]"
      >
        {t('notfound_btn') || 'العودة للصفحة الرئيسية'}
      </Link>

    </div>
  );
}