import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsappButton() {
  const whatsappNumber = "201206923817"; // رقمك بالصيغة الدولية
  const message = encodeURIComponent("مرحباً، أود الاستفسار عن المدارس المتاحة.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      // تم استخدام الـ style المباشر لضمان ظهور اللون الأخضر والظل القوي فوق خلفية الموقع
      style={{ backgroundColor: '#25D366' }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="h-8 w-8 text-white" />
      
      {/* نقطة الإشعار الذكية لتنبيه المستخدم */}
      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
      </span>
    </a>
  );
}