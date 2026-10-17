import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Xasan & Xusan · 60 лет',description:'Две судьбы. Одна история. Приглашение на юбилей братьев-близнецов.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>}
