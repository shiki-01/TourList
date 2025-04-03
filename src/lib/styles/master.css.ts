import type { Config } from '@master/css'

export default {
    variables: {
        primary: '#009cda',
    },
    animations: {
        'onActive': {
            '0%': {
                transform: 'rotate(0deg)',
            },
            '20%': {
                transform: 'rotate(-12deg)',
            },
            '40%': {
                transform: 'rotate(12deg)',
            },
            '80%': {
                transform: 'rotate(-6deg)',
            },
            '100%': {
                transform: 'rotate(0deg)',
            }
        }
    }
} as Config