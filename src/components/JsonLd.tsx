export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TaskBee',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Android, iOS, Web',
    description: 'Nền tảng việc làm vi mô trên điện thoại. Kiếm tiền thật, minh bạch, không cần hồ sơ.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
