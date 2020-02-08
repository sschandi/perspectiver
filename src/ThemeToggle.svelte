<div>
  <button class="btn" on:click={() => darkMode = !darkMode}>
    <span class="gradient-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
  </button>
</div>

<script>
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false

const light = {
  '--font': '#4b5062',
  '--base': '#ffffff',
  '--transparent-base': 'rgba(255, 255, 255, 0.5)',
	'--body-bg': '#f2f3fd',
	'--body-bg-gradient': 'linear-gradient(45deg, #f8fafe, #f2f3fd)',
	'--inset-shadow': 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
	'--shadow': '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.5)',
	'--input-shadow': 'inset 2px 2px 3px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8), inset -60px 0px 30px -30px rgba(0, 0, 0, 0.01), inset 60px 0px 30px -30px rgba(255, 255, 255, 0.1)',
	'--btn-shadow': '2px 2px 3px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8), inset -60px 0px 30px -30px rgba(0, 0, 0, 0.01), inset 60px 0px 30px -30px rgba(255, 255, 255, 0.1)'
}
const dark = {
  '--font': '#ffffff',
  '--base': '#333333',
  '--transparent-base': 'rgba(51, 51, 51, 0.5)',
	'--body-bg': '#212121',
	'--body-bg-gradient': 'linear-gradient(45deg, #282828, #212121)',
	'--inset-shadow': 'inset 3px 3px 6px #171717, inset -3px -3px 8px #333333',
	'--shadow': '3px 3px 6px #171717, -3px -3px 6px #333333',
	'--input-shadow': 'inset 2px 2px 3px #171717, inset -3px -3px 6px #333333, inset -60px 0px 30px -30px rgba(0, 0, 0, 0.01), inset 60px 0px 30px -30px rgba(31, 31, 31, 0.1)',
	'--btn-shadow': '2px 2px 3px #171717, -3px -3px 6px #333333, inset -60px 0px 30px -30px rgba(0, 0, 0, 0.01), inset 60px 0px 30px -30px rgba(31, 31, 31, 0.1)'
}

$: if (darkMode) {
  setTheme(dark)
} else {
  setTheme(light)
}

function setTheme(theme) {
  localStorage.setItem('darkMode', darkMode)
  Object.keys(theme).map(key => {
    const value = theme[key]
    document.documentElement.style.setProperty(key, value)
  })
}
</script>