import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Memory Agent | Enterprise Operations & Memory Engine',
  description: 'Production-grade central memory and context service',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090d] text-gray-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
