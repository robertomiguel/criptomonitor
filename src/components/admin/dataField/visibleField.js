import { Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import PDAIcon from '../../common/pdaIcon'

export const VisibleField = (props) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        if (!props.edit) setValue(() => props.value)
    }, [props])

    return props.view ? (
        !value ? (
            <PDAIcon name="MdClear" color="red" />
        ) : (
            <PDAIcon name="MdCheck" color="green" />
        )
    ) : (
        <div>
            <Switch checked={value} onChange={(v) => props.onChange(v)} />
        </div>
    )
}
