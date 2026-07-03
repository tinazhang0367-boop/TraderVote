// Composable: shared formatting helpers
export const useFormatDate = () => {
  return {
    relative: (iso: string) => {
      const diff = (Date.now() - new Date(iso).getTime()) / 1000
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
      return new Date(iso).toLocaleDateString()
    },
    long: (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  }
}
