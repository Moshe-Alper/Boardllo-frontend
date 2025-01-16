export function BoardStyle() {

    function generateComponentStyles(baseColor, gradientDirection = 'r') {
        return {
            BoardDetails: `bg-gradient-to-${gradientDirection} from-${baseColor}-400 to-${baseColor}-600`,
            BoardHeader: `bg-${baseColor}-600/80`,
            AppHeader: `bg-${baseColor}-700/90`,
            BoardSidebar: `bg-${baseColor}-800/20`
        }
    }

    function getRandomColorScheme() {
        const colorSchemes = [
            { color: 'blue', direction: 'r' },
            { color: 'purple', direction: 'r' },
            { color: 'green', direction: 'r' },
            { color: 'indigo', direction: 'br' },
            { color: 'pink', direction: 'br' }
        ]

        return colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
    }

    function generateRandomStyles() {
        const { color, direction } = getRandomColorScheme()
        return generateComponentStyles(color, direction)
    }
}