import React from 'react'
import { useAsync } from 'react-use'
import { Icon } from '@ant-design/compatible'

const PdaIconPack = {
    GxWarningTriangle: <span>=(</span>,
}

const iconPackLoader = async (prefix) => {
    switch (prefix) {
        case 'Ai':
            return await import('react-icons/ai') // Ant Design Icons
        case 'Bs':
            return await import('react-icons/bs') // Bootstrap Icons
        case 'Di':
            return await import('react-icons/di') // Devicons
        case 'Fc':
            return await import('react-icons/fc') // Flat Color Icons
        case 'Fa':
            return await import('react-icons/fa') // Font Awesome
        case 'Fi':
            return await import('react-icons/fi') // Feather
        case 'Gi':
            return await import('react-icons/gi') // Game Icons
        case 'Go':
            return await import('react-icons/go') // Github Octicons icons
        case 'Gr':
            return await import('react-icons/gr') // Grommet-Icons
        case 'Io':
            return await import('react-icons/io') // Ionicons 4
        case 'Md':
            return await import('react-icons/md') // Material Design icons
        case 'Ri':
            return await import('react-icons/ri') // Remix Icon
        case 'Ti':
            return await import('react-icons/ti') // Typicons
        case 'Wi':
            return await import('react-icons/wi') // Weather Icons
        default:
            return PdaIconPack
    }
}

export const iconLoader = async (name) => {
    if (!name) return

    const prefix = name.slice(0, 2)
    const iconPack = await iconPackLoader(prefix)
    if (!iconPack) return

    return iconPack[name]
}

const PDAIcon = (props) => {
    const { name, ...restProps } = props

    const loader = useAsync(() => iconLoader(name), [name])

    if (loader.loading)
        return (
            <Icon
                style={{ fontSize: props.size, color: props.color }}
                type="loading"
            />
        )

    if (loader.error || !loader.value) return null

    const SelectedIcon = loader.value
    return (
        <i
            className="anticon material-icons-outlined"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                margin: 0,
            }}
        >
            <SelectedIcon
                {...restProps}
                style={{
                    fontSize: '1.2em',
                    marginRight: '3px',
                }}
            />{' '}
            {props.content}
        </i>
    )
}

export default PDAIcon
