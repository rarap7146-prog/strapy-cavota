interface PlaybookStep {
  id: number
  title: string
  description: string
}

interface PlaybookData {
  id: number
  title: string
  steps?: PlaybookStep[]
}

interface PlaybookSectionProps {
  data: PlaybookData
  locale: 'id' | 'en'
}

export function PlaybookSection({ data, locale }: PlaybookSectionProps) {
  const { title, steps } = data

  // Don't render anything if there are no steps
  if (!steps || steps.length === 0) {
    return null
  }

  // Dynamic column calculation based on number of steps
  const getGridClasses = (stepCount: number) => {
    switch (stepCount) {
      case 1:
        return "grid grid-cols-1 gap-8 max-w-md mx-auto"
      case 2:
        return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
      case 3:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      case 4:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
      case 5:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
      case 6:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      default:
        // For 7+ steps, use 3 columns and allow wrapping
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
    }
  }

  return (
    <section className="container-fluid py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="font-semibold mb-4">
          {title}
        </h2>
      </div>

      <div className={getGridClasses(steps.length)}>
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="relative bg-card p-8 rounded-lg border hover:shadow-lg transition-shadow"
          >
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            
            <h3 className="font-semibold text-lg mb-4 mt-4">
              {step.title}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}