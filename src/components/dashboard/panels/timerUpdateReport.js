import moment from 'moment'
import { Divider, Statistic } from 'antd'
import { PDA_COLOR_BACKGROUND_BLACK } from '../../common/pdaColor'

export const TimerUpdateReport = (props) => {
    const { Countdown } = Statistic
    const deadline = moment().add(props.minutes, 'm') // Moment is also OK

    return (
        <div
            style={{
                display: 'inline-block',
                backgroundColor: PDA_COLOR_BACKGROUND_BLACK,
                width: 'auto',
                padding: '1em',
                position: 'fixed',
                zIndex: 1001,
                bottom: 1,
                right: 1,
                opacity: 0.7,
                borderRadius: '10px',
            }}
        >
            <Statistic
                style={{ display: 'inline-block' }}
                title="Última act."
                value={moment().format('HH:mm:ss')}
            />
            <Divider type="vertical" />
            <Statistic
                style={{ display: 'inline-block' }}
                title="Próxima act."
                value={moment().add(props.minutes, 'm').format('HH:mm:ss')}
            />
            <Divider type="vertical" />
            <Countdown
                style={{ display: 'inline-block' }}
                title="Recargar en"
                value={deadline}
            />
        </div>
    )
}
