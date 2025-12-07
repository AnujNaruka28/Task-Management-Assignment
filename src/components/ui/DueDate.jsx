"use client";

import React from 'react';
import { DatePicker, ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';

export default function DueDate({ value, onChange }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBgContainer: '#1c1917', // stone-800
                    colorBorder: '#44403c',      // stone-700
                    colorText: '#e7e5e4',        // stone-200
                    colorPrimary: '#fafaf9',     // stone-50 (white-ish)
                }
            }}
        >
            <DatePicker
                value={value ? dayjs(value) : null}
                onChange={(_, dateString) => onChange(dateString)}
                className="w-full cursor-pointer"
                needConfirm={false}
            />
        </ConfigProvider>
    );
}
