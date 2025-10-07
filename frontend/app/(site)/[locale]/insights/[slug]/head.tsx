/**
 * Head component for Insights pages
 * Injects AMP HTML link for the corresponding AMP version
 */

interface HeadProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function Head({ params }: HeadProps) {
  const { locale, slug } = params;
  
  return (
    <>
      <link 
        rel="amphtml" 
        href={`/${locale}/insights/${slug}/amp`} 
      />
    </>
  );
}