// Initialize the plugin UI
penpot.ui.open('Palette generator', `./index.html?theme=${penpot.theme}`)

// Listen for theme changes
penpot.on('themechange', (theme) => {
  // Send theme changes to the UI
  penpot.ui.sendMessage({
    type: 'theme',
    content: theme
  })
})

// Handle messages from UI
penpot.on('message', (message) => {
  console.log('Message received from UI:', message)
  // Add your message handling logic here
})

// Make sure to export the plugin functions so Penpot can find them
export {}
