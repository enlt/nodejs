// src/app/layout.tsx
export const metadata = {
  title: 'LuoH_AN&API',
  description: '落渐离&API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}