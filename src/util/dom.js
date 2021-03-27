export function loadExternalScript (uri) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = uri
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    document.body.appendChild(script)
  })
}