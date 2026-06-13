export function exportToCSV(data, filename = 'export.csv') {
  if (!data?.length) return

  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h]
      const str = val === null || val === undefined ? '' : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }).join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function CSVExportButton({ data, filename, label = 'Export CSV' }) {
  return (
    <button
      type="button"
      onClick={() => exportToCSV(data, filename)}
      className="rounded-lg border px-4 py-2 text-sm font-medium text-primary hover:bg-gray-50"
      disabled={!data?.length}
    >
      {label}
    </button>
  )
}
