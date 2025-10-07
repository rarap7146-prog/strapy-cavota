interface MetricItem {
  id: number
  value: string
  label: string
  description?: string
}

interface MetricsGridData {
  id: number
  title: string
  subtitle?: string
  style_variant?: string
  metrics?: MetricItem[]
}

interface MetricsGridSectionProps {
  data: MetricsGridData
  locale: 'id' | 'en'
}

export function MetricsGridSection({ data, locale }: MetricsGridSectionProps) {
  const { title, subtitle, metrics } = data

  // Don't render anything if there are no metrics
  if (!metrics || metrics.length === 0) {
    return null
  }

  return renderMetricsSection(data)
}

function renderMetricsSection(data: MetricsGridData) {
  const { title, subtitle, metrics } = data

  if (!metrics || metrics.length === 0) {
    return null
  }

  // Dynamic column calculation based on number of metrics
  const getGridClasses = (metricCount: number) => {
    switch (metricCount) {
      case 1:
        return "grid grid-cols-1 gap-8 max-w-md mx-auto"
      case 2:
        return "grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto"
      case 3:
        return "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
      case 4:
        return "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto"
      case 5:
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto"
      case 6:
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
      default:
        // For 7+ metrics, use 2 columns on mobile, 3 on desktop
        return "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
    }
  }

  return (
    <section className="container-fluid py-16 bg-muted/30">
      <div className="mb-12">
        <h2 className="text-3xl text-center md:text-4xl font-bold mb-4">{title}</h2>
        {subtitle && (
          <p className="text-xl text-center text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div className={getGridClasses(metrics.length)}>
        {metrics.map((metric) => (
          <div key={metric.id}>
            <div className="text-4xl font-bold text-brand-gradient mb-2">
              {metric.value}
            </div>
            <p className="text-muted-foreground font-medium">
              {metric.label}
            </p>
            {metric.description && (
              <p className="text-sm text-muted-foreground/80 mt-1">
                {metric.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}