module.exports = {
    darkMode: 'class',
    content: ["./pub/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                Nosferatu:  '#282a36', //Background Color
                Aro:        '#44475a',	//Current Line Color
                Cullen:     '#f8f8f2',	//Foreground Color
                VonCount:   '#6272a4',	//Comment Color
                VanHelsing: '#8be9fd', //Cyan Color
                Blade:      '#50fa7b',	//Green Color
                Morbius:    '#ffb86c',//Orange Color
                Buffy:      '#ff79c6',	//Pink Color
                Dracula:    '#bd93f9',//Purple Color
                Marcelin:   '#ff5555',	//Red Color
                Lincoln:    '#f1fa8c',	//Yellow Color
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
    ],
}

