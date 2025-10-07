import ReactMarkdown from 'react-markdown'

interface RichTextSectionProps {
  data: {
    id: number
    content: string
  }
  locale: 'id' | 'en'
}

export function RichTextSection({ data, locale }: RichTextSectionProps) {
  if (!data.content) {
    return null
  }

  return (
    <section className="container-fluid py-16">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}