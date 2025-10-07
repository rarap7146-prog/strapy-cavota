import Link from 'next/link'

interface NotFoundProps {
  params?: { locale?: string }
}

export default function NotFound({ params }: NotFoundProps = {}) {
  const locale = params?.locale || 'id'
  
  return (
    <div className="container-fluid py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
        </h2>
        <p className="text-muted-foreground mb-8">
          {locale === 'id' 
            ? 'Maaf, halaman yang Anda cari tidak dapat ditemukan.'
            : 'Sorry, the page you are looking for could not be found.'
          }
        </p>
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand-gradient text-white hover:opacity-90 h-12 px-8"
        >
          {locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}