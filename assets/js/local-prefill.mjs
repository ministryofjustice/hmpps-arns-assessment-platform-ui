// Local development helper: Cmd+Shift+F (Ctrl+Shift+F on Windows/Linux) fills the
// visible form fields on the page with realistic mock data. Does nothing unless the
// page is served from localhost.

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]', '::1']

const SAMPLES = {
  // Keyed by the area of need slug used in sentence plan URLs.
  goalsByArea: {
    accommodation: ['Find somewhere stable to live', 'Keep up with my rent so I can stay in my flat'],
    'employment-and-education': ['Find paid work that fits around my family', 'Finish my forklift licence'],
    finances: ['Manage my money and pay off my debts', 'Open a bank account'],
    'drug-use': ['Stop using cocaine', 'Stay on my methadone prescription'],
    'alcohol-use': ['Cut down how much I drink', 'Stay sober at weekends'],
    'health-and-wellbeing': ['Get support for my anxiety', 'Register with a GP'],
    'personal-relationships-and-community': [
      'Rebuild my relationship with my children',
      'Spend less time with people who get me into trouble',
    ],
    'thinking-behaviours-and-attitudes': [
      'Find better ways to handle my anger',
      'Think through decisions before acting',
    ],
  },
  stepsByArea: {
    accommodation: [
      'Register with the local council housing team',
      'Fill in the housing benefit form with support from Shelter',
    ],
    'employment-and-education': [
      'Sign up for the construction skills course at the job centre',
      'Update my CV with the employment adviser',
    ],
    finances: ['Meet a debt adviser from Citizens Advice', 'Set up a payment plan for my council tax arrears'],
    'drug-use': ['Book an appointment with the drug and alcohol service', 'Go to the weekly recovery group'],
    'alcohol-use': ['Book an appointment with the drug and alcohol service', 'Keep a drink diary for four weeks'],
    'health-and-wellbeing': ['Ask my GP for a mental health referral', 'Go to the talking therapies drop in'],
    'personal-relationships-and-community': [
      'Attend the parenting course at the family centre',
      'Speak to social services about contact with my children',
    ],
    'thinking-behaviours-and-attitudes': [
      'Complete the Building Choices programme',
      'Practise the coping plan we wrote together',
    ],
  },
  text: [
    'Discussed this in our appointment. They are motivated and want to make changes, and we agreed to review progress next month.',
    'They said things have been harder since losing their job. They want support and have agreed to the next steps.',
    'Progress has been steady. They attended every appointment this month and are engaging well.',
  ],
  firstName: ['Sam', 'Alex', 'Jordan', 'Chris', 'Taylor', 'Jamie'],
  lastName: ['Smith', 'Patel', 'Jones', 'Williams', 'Khan', 'Taylor'],
}

const pick = list => list[Math.floor(Math.random() * list.length)]

// Goals and steps follow the area of need in the URL (or the page heading on step pages).
const samplesFor = (byArea, el) => {
  const doc = el.ownerDocument
  const context = `${doc.location.pathname} ${doc.querySelector('main')?.textContent ?? ''}`.toLowerCase()
  const area = Object.keys(byArea).find(slug => context.includes(slug) || context.includes(slug.replace(/-/g, ' ')))
  return area ? byArea[area] : Object.values(byArea).flat()
}

export const isLocalhost = hostname => LOCAL_HOSTNAMES.includes(hostname)

const isVisible = el => !el.disabled && !el.readOnly && el.getClientRects().length > 0

const describe = el => {
  const label = el.id ? el.ownerDocument.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null
  return `${el.name} ${el.id} ${label?.textContent ?? ''} ${el.getAttribute('aria-label') ?? ''}`.toLowerCase()
}

const dateFor = hint => {
  const date = new Date()
  if (/birth|dob/.test(hint)) date.setFullYear(date.getFullYear() - 35)
  else date.setMonth(date.getMonth() + 3)
  return date
}

const mockValueFor = el => {
  const hint = describe(el)
  const type = (el.getAttribute('type') || 'text').toLowerCase()

  if (/(^|[-_ ])day\b/.test(hint)) return String(dateFor(hint).getDate())
  if (/(^|[-_ ])month\b/.test(hint)) return String(dateFor(hint).getMonth() + 1)
  if (/(^|[-_ ])year\b/.test(hint)) return String(dateFor(hint).getFullYear())
  if (type === 'date') return dateFor(hint).toISOString().slice(0, 10)
  if (type === 'email' || /email/.test(hint)) return 'sam.smith@example.com'
  if (type === 'tel' || /phone|mobile/.test(hint)) return '07700 900123'
  if (type === 'number' || el.inputMode === 'numeric') return '3'
  if (/postcode/.test(hint)) return 'SW1A 1AA'
  if (/\bcrn\b/.test(hint)) return `X${Math.floor(100000 + Math.random() * 900000)}`
  if (/\bpnc\b/.test(hint)) return '2001/0123456A'
  if (/first|given|forename/.test(hint)) return pick(SAMPLES.firstName)
  if (/last|family|surname/.test(hint)) return pick(SAMPLES.lastName)
  if (/step|action/.test(hint)) return pick(samplesFor(SAMPLES.stepsByArea, el))
  if (/goal/.test(hint)) return pick(samplesFor(SAMPLES.goalsByArea, el))
  if (el.tagName === 'TEXTAREA') return pick(SAMPLES.text)
  if (/name/.test(hint)) return `${pick(SAMPLES.firstName)} ${pick(SAMPLES.lastName)}`
  return pick(SAMPLES.text)
}

const setValue = (el, value) => {
  el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

// A real click lets GOV.UK Frontend show any conditional content for the choice.
const check = el => el.click()

// Fills empty visible fields once and returns how many were filled.
// Already filled fields and answered radio/checkbox groups are left alone.
const fillOnce = root => {
  let filled = 0
  const groups = new Map()

  root.querySelectorAll('input, textarea, select').forEach(el => {
    if (!isVisible(el)) return
    const type = (el.getAttribute('type') || '').toLowerCase()
    if (['hidden', 'submit', 'button', 'reset', 'file', 'image', 'search'].includes(type)) return

    if (type === 'radio' || type === 'checkbox') {
      const key = `${type}:${el.name}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(el)
      return
    }

    if (el.tagName === 'SELECT') {
      if (el.value) return
      const option = [...el.options].find(o => o.value && !o.disabled)
      if (option) {
        // Sentence plan's custom dropdown shows its own label, so let it update that too
        const wrapper = el.closest('wrapping-select-wrapper')
        if (typeof wrapper?.selectOption === 'function') wrapper.selectOption(option.value)
        else setValue(el, option.value)
        filled += 1
      }
      return
    }

    if (el.value) return
    setValue(el, mockValueFor(el))
    filled += 1
  })

  groups.forEach(options => {
    if (options.some(o => o.checked)) return
    const choice = options.find(o => o.dataset.behaviour !== 'exclusive') ?? options[0]
    check(choice)
    filled += 1
  })

  return filled
}

// Runs a few passes so fields revealed by a choice (GOV.UK conditional reveals) get filled too.
export const prefill = (root = document.querySelector('main') ?? document.body) => {
  let total = 0
  for (let pass = 0; pass < 3; pass += 1) {
    const filled = fillOnce(root)
    if (filled === 0) break
    total += filled
  }
  return total
}

const announce = (doc, message) => {
  const note = doc.createElement('div')
  note.setAttribute('role', 'status')
  note.textContent = message
  note.style.cssText =
    'position:fixed;bottom:16px;right:16px;z-index:10000;padding:8px 12px;background:#0b0c0c;color:#fff;font:16px/1.4 sans-serif'
  doc.body.appendChild(note)
  setTimeout(() => note.remove(), 2000)
}

export const initLocalPrefill = (win = window) => {
  if (!isLocalhost(win.location.hostname)) return

  win.document.addEventListener('keydown', event => {
    if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.code !== 'KeyF') return
    event.preventDefault()
    const count = prefill()
    announce(win.document, `Prefilled ${count} field${count === 1 ? '' : 's'} with mock data`)
  })
}
