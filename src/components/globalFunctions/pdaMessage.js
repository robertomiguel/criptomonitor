import { message } from 'antd'

export const pdaMessage = (title, body, type = 'success') => {
    message[type](
        <div>
            <label>{title}</label>
            <p>{body}</p>
        </div>
    )
}
