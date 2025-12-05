const canvas = document.getElementById("designCanvas")
const downloadBtn = document.getElementById("downloadBtn")
const fontFamilySel = document.getElementById("fontFamily")
const fontSizeIn = document.getElementById("fontSize")
const fontColorIn = document.getElementById("fontColor")
const addTitleBtn = document.getElementById("addTitleBtn")
const addMessageBtn = document.getElementById("addMessageBtn")
const addCtaBtn = document.getElementById("addCtaBtn")
const deleteBtn = document.getElementById("deleteBtn")

let selected = null

const state = { bg: "white" }

function setSelected(el) {
  if (selected) selected.classList.remove("selected")
  selected = el
  if (selected) selected.classList.add("selected")
}

function permitirArrastre(el) {
  let dragging = false
  let startX = 0, startY = 0, origX = 0, origY = 0
  el.addEventListener("mousedown", e => {
    const isEditing = el.isContentEditable && document.activeElement === el
    const sel = window.getSelection ? window.getSelection() : null
    const collapsed = !sel || sel.isCollapsed
    const allowWhileEditing = e.altKey || e.ctrlKey || e.metaKey || collapsed
    if (isEditing && !allowWhileEditing) return
    dragging = true
    setSelected(el)
    startX = e.clientX
    startY = e.clientY
    const rect = el.getBoundingClientRect()
    origX = rect.left
    origY = rect.top
    e.preventDefault()
  })
  window.addEventListener("mousemove", e => {
    if (!dragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const canvasRect = canvas.getBoundingClientRect()
    const newLeft = origX + dx - canvasRect.left
    const newTop = origY + dy - canvasRect.top
    const maxLeft = canvasRect.width - el.offsetWidth
    const maxTop = canvasRect.height - el.offsetHeight
    el.style.left = Math.max(0, Math.min(maxLeft, newLeft)) + "px"
    el.style.top = Math.max(0, Math.min(maxTop, newTop)) + "px"
  })
  window.addEventListener("mouseup", () => { dragging = false })
}

function addResizer(el) {
  const h = document.createElement("div")
  h.className = "handle br"
  el.append(h)
  let resizing = false
  let startX = 0, startY = 0, startW = 0, startH = 0, startF = 0
  h.addEventListener("mousedown", e => {
    resizing = true
    startX = e.clientX
    startY = e.clientY
    startW = el.offsetWidth
    startH = el.offsetHeight
    startF = parseInt(getComputedStyle(el).fontSize || "24", 10)
    e.stopPropagation()
    e.preventDefault()
  })
  window.addEventListener("mousemove", e => {
    if (!resizing) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (el.tagName === "IMG") {
      el.style.width = Math.max(24, startW + dx) + "px"
      el.style.height = Math.max(24, startH + dy) + "px"
    } else {
      const fs = Math.max(12, startF + Math.max(dx, dy))
      el.style.fontSize = fs + "px"
    }
  })
  window.addEventListener("mouseup", () => { resizing = false })
}

function addDragHandle(el) {
  const dh = document.createElement("div")
  dh.className = "drag-handle tl"
  el.append(dh)
  let dragging = false
  let startX = 0, startY = 0, origX = 0, origY = 0
  dh.addEventListener("mousedown", e => {
    dragging = true
    setSelected(el)
    startX = e.clientX
    startY = e.clientY
    const rect = el.getBoundingClientRect()
    origX = rect.left
    origY = rect.top
    e.stopPropagation()
    e.preventDefault()
  })
  window.addEventListener("mousemove", e => {
    if (!dragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const canvasRect = canvas.getBoundingClientRect()
    const newLeft = origX + dx - canvasRect.left
    const newTop = origY + dy - canvasRect.top
    const maxLeft = canvasRect.width - el.offsetWidth
    const maxTop = canvasRect.height - el.offsetHeight
    el.style.left = Math.max(0, Math.min(maxLeft, newLeft)) + "px"
    el.style.top = Math.max(0, Math.min(maxTop, newTop)) + "px"
  })
  window.addEventListener("mouseup", () => { dragging = false })
}

function cambiarFondo(key) {
  canvas.classList.remove("bg-light","bg-white","bg-black","bg-dark","bg-blue","bg-yellow","bg-red","bg-gradient","bg-texture")
  const map = { white: "bg-white", black: "bg-black", blue: "bg-blue", yellow: "bg-yellow", red: "bg-red", gradient: "bg-gradient", texture: "bg-texture" }
  canvas.classList.add(map[key] || "bg-white")
  state.bg = key
}

function insertarIcono(key) {
  const img = document.createElement("img")
  img.src = `assets/icons/${key}.png`
  img.alt = key
  img.className = "elm draggable resizable"
  img.style.left = "40px"
  img.style.top = "40px"
  img.style.width = "96px"
  img.style.height = "96px"
  img.addEventListener("error", () => {
    const map = { lamp: "💡", notebook: "📓", bottle: "🧴", headphones: "🎧", phone: "📱", food: "🍔", backpack: "🎒", clothes: "👕", star: "⭐", arrow: "➡️", bubble: "💬" }
    img.replaceWith(createEmoji(map[key] || "⭐"))
  })
  canvas.append(img)
  permitirArrastre(img)
  addResizer(img)
  setSelected(img)
}

function createEmoji(symbol) {
  const el = document.createElement("div")
  el.className = "elm draggable icon resizable"
  el.textContent = symbol
  el.style.left = "40px"
  el.style.top = "40px"
  el.style.fontSize = "64px"
  canvas.append(el)
  permitirArrastre(el)
  addResizer(el)
  setSelected(el)
  return el
}

function insertarTexto(type) {
  let el
  if (type === "cta") {
    el = document.createElement("button")
    el.className = "elm draggable elm-cta"
    el.textContent = "Comprar ahora"
  } else if (type === "title") {
    el = document.createElement("div")
    el.className = "elm draggable elm-title"
    el.textContent = "Título / Slogan"
    el.contentEditable = "true"
  } else {
    el = document.createElement("div")
    el.className = "elm draggable elm-message"
    el.textContent = "Mensaje principal"
    el.contentEditable = "true"
  }
  el.style.left = "80px"
  el.style.top = "80px"
  el.style.fontFamily = fontFamilySel.value
  el.style.color = fontColorIn.value
  el.style.fontSize = parseInt(fontSizeIn.value, 10) + "px"
  canvas.append(el)
  if (el.isContentEditable) { addDragHandle(el); addResizer(el) } else { permitirArrastre(el); addResizer(el) }
  setSelected(el)
  el.addEventListener("click", () => setSelected(el))
}

function aplicarPropiedades() {
  if (!selected) return
  selected.style.fontFamily = fontFamilySel.value
  selected.style.color = fontColorIn.value
  const fs = parseInt(fontSizeIn.value, 10)
  if (!Number.isNaN(fs)) selected.style.fontSize = fs + "px"
}

function descargarPNG() {
  const prevSelectedEls = Array.from(canvas.querySelectorAll('.elm.selected'))
  const textEls = Array.from(canvas.querySelectorAll('.elm-title, .elm-message'))
  const prevEditable = textEls.map(el => el.isContentEditable)
  prevSelectedEls.forEach(el => el.classList.remove('selected'))
  textEls.forEach(el => { if (el.isContentEditable) el.contentEditable = 'false' })
  canvas.classList.add('exporting')
  html2canvas(canvas, {
    scale: 2,
    ignoreElements: el => el.classList && (el.classList.contains('handle') || el.classList.contains('drag-handle'))
  }).then(imgCanvas => {
    const a = document.createElement('a')
    a.href = imgCanvas.toDataURL('image/png')
    a.download = 'mi_publicidad.png'
    a.click()
    const m = document.getElementById('thanksModal')
    if (m) m.classList.remove('hidden')
  }).finally(() => {
    canvas.classList.remove('exporting')
    textEls.forEach((el, i) => { el.contentEditable = prevEditable[i] ? 'true' : 'false' })
    prevSelectedEls.forEach(el => el.classList.add('selected'))
  })
}

document.querySelectorAll("[data-bg]").forEach(btn => {
  btn.addEventListener("click", () => cambiarFondo(btn.getAttribute("data-bg")))
})

const emojiInput = document.getElementById("emojiInput")
const addEmojiBtn = document.getElementById("addEmojiBtn")
const emojiGrid = document.getElementById("emojiGrid")
if (emojiGrid) {
  emojiGrid.querySelectorAll("[data-emoji]").forEach(btn => {
    btn.addEventListener("click", () => createEmoji(btn.getAttribute("data-emoji")))
  })
}
if (addEmojiBtn) {
  addEmojiBtn.addEventListener("click", () => {
    const val = (emojiInput.value || "").trim()
    if (val) createEmoji(val)
  })
}

addTitleBtn.addEventListener("click", () => insertarTexto("title"))
addMessageBtn.addEventListener("click", () => insertarTexto("message"))
addCtaBtn.addEventListener("click", () => insertarTexto("cta"))

fontFamilySel.addEventListener("change", aplicarPropiedades)
fontSizeIn.addEventListener("input", aplicarPropiedades)
fontColorIn.addEventListener("input", aplicarPropiedades)

downloadBtn.addEventListener("click", descargarPNG)
deleteBtn.addEventListener("click", () => { if (selected) { selected.remove(); selected = null } })
window.addEventListener("keydown", e => {
  if (!selected) return
  const isEditing = selected.isContentEditable && document.activeElement === selected
  if (e.key === "Escape" && isEditing) { selected.blur(); return }
  if (e.key === "Delete" || (e.key === "Backspace" && !isEditing)) {
    selected.remove()
    selected = null
  }
})

const thanksClose = document.getElementById('thanksClose')
const thanksModal = document.getElementById('thanksModal')
if (thanksClose) {
  thanksClose.addEventListener('click', () => { if (thanksModal) thanksModal.classList.add('hidden') })
}

function initCanvas() { canvas.innerHTML = ""; cambiarFondo("white") }
initCanvas()

const introModal = document.getElementById('introModal')
const introStart = document.getElementById('introStart')
const introDontShow = document.getElementById('introDontShow')
function showIntro() {
  if (localStorage.getItem('introDismissed') === '1') return
  if (introModal) introModal.classList.remove('hidden')
}
if (introStart) {
  introStart.addEventListener('click', () => {
    if (introDontShow && introDontShow.checked) localStorage.setItem('introDismissed', '1')
    if (introModal) introModal.classList.add('hidden')
  })
}
showIntro()
