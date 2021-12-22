import { Descriptions } from 'antd'

export const PDADescription = (props) => (
    <Descriptions bordered layout="horizontal" size="small">
        <Descriptions.Item
            label={props.label}
            contentStyle={{ width: '30%', textAlign: 'center' }}
        >
            {props.content}
        </Descriptions.Item>
    </Descriptions>
)
