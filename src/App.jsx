import { Analytics } from '@vercel/analytics/react';
import AppRouter from './router/index.jsx';
import WhatsappButton from './components/common/WhatsappButton.jsx'; // تأكد من صحة المسار
export default function App() {
  return (
    <div>
      <AppRouter />
      {/* <WhatsappButton /> */}
      <Analytics />
    </div>
  );
}
