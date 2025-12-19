import './globals.css'

export const metadata = {
  title: 'Japam Chat - Real-Time Messaging',
  description: 'Real-time one-to-one chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}


