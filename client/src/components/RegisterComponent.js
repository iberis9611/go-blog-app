const tailFormItemLayout = {
    wrapperCol: {
    xs: {
        span: 10,
        offset: 0,
    },
    sm: {
        span: 10,
        offset: 8,
    },
    },
}

const tailFormButtonLayout = {
    wrapperCol: {
    xs: {
        span: 8,
        offset: 0,
    },
    sm: {
        span: 7,
        offset: 8,
    },
    },
}

const residences = [
    {
        value: 'shaanxi',
        label: '陕西',
        children: [
        {
            value: 'xian',
            label: '西安',
        },
        {
            value: 'ankang',
            label: '安康',
        },
        {
            value: 'baoji',
            label: '宝鸡',
        },
        {
            value: 'hanzhong',
            label: '汉中',
        },
        {
            value: 'shangluo',
            label: '商洛',
        },
        {
            value: 'tongchuan',
            label: '铜川',
        },
        {
            value: 'weinan',
            label: '渭南',
        },
        {
            value: 'xianyang',
            label: '咸阳',
        },
        {
            value: 'yanan',
            label: '延安',
        },
        {
            value: 'yulin',
            label: '榆林',
        },
        ],
    },
    {
        value: 'guangdong',
        label: '广东',
        children: [
        {
            value: 'guangzhou',
            label: '广州',
        },
        {
            value: 'zhuhai',
            label: '珠海',
        },
        {
            value: 'dongguan',
            label: '东莞',
        },
        {
            value: 'chaozhou',
            label: '潮州',
        },
        {
            value: 'qingyuan',
            label: '清远',
        },
        ],
    },
    ]

export {
    residences,
    tailFormItemLayout,
    tailFormButtonLayout,
}